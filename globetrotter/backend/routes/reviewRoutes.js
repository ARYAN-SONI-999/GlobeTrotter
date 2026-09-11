const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// NOTE: The 'reviews' table is now created at startup in db.js — no ad-hoc
// table creation needed here.

// GET /api/reviews/:destinationKey
router.get('/:destinationKey', (req, res) => {
  try {
    const destKey = req.params.destinationKey.toLowerCase().replace(/[\s-]+/g, '');
    const reviews = db.prepare(
      'SELECT * FROM reviews WHERE LOWER(REPLACE(destinationKey, " ", "")) LIKE ? ORDER BY datetime(createdAt) DESC'
    ).all(`%${destKey}%`);

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 4.8;

    return res.json({
      reviews,
      avgRating: parseFloat(avgRating),
      totalReviews
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({ message: 'Failed to load reviews.' });
  }
});

// POST /api/reviews/:destinationKey (Auth required)
router.post('/:destinationKey', authMiddleware, (req, res) => {
  try {
    const destKey = req.params.destinationKey.toLowerCase().replace(/[\s-]+/g, '');
    const { rating, text, photoUrl } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ message: 'Rating and text review are required.' });
    }

    const userRow = db.prepare('SELECT name, email FROM users WHERE id = ?').get(req.userId);
    const userName = userRow?.name || userRow?.email?.split('@')[0] || 'Traveler';

    const reviewId = uuidv4();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO reviews (id, destinationKey, userId, userName, rating, text, photoUrl, helpfulCount, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).run(reviewId, destKey, req.userId, userName, parseInt(rating, 10), text, photoUrl || null, createdAt);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);

    return res.status(201).json({
      message: 'Review posted successfully!',
      review: newReview
    });
  } catch (err) {
    console.error('Error creating review:', err);
    return res.status(500).json({ message: 'Failed to post review.' });
  }
});

// POST /api/reviews/:reviewId/helpful
router.post(['/:reviewId/helpful', '/item/:reviewId/helpful'], (req, res) => {
  try {
    const { reviewId } = req.params;
    db.prepare('UPDATE reviews SET helpfulCount = helpfulCount + 1 WHERE id = ?').run(reviewId);
    const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);
    return res.json(updated || { helpfulCount: 1 });
  } catch (err) {
    console.error('Error updating helpful count:', err);
    return res.status(500).json({ message: 'Failed to mark helpful.' });
  }
});

module.exports = router;
