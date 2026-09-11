const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { mapCity, mapSavedDestination } = require('../serializers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/saved
router.get('/', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT sd.*, c.name, c.country, c.region, c.cost_index, c.popularity, c.description
      FROM saved_destinations sd
      JOIN cities c ON sd.city_id = c.id
      WHERE sd.user_id = ?
      ORDER BY sd.saved_at DESC
    `).all(req.userId);

    const mapped = rows.map((r) => {
      const city = mapCity({
        id: r.city_id,
        name: r.name,
        country: r.country,
        region: r.region,
        cost_index: r.cost_index,
        popularity: r.popularity,
        description: r.description
      });
      return mapSavedDestination(r, city);
    });

    return res.json(mapped);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch saved destinations.' });
  }
});

// POST /api/saved/:cityId
router.post('/:cityId', authMiddleware, (req, res) => {
  try {
    const city = db.prepare('SELECT * FROM cities WHERE id = ?').get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ message: 'City not found.' });
    }

    const existing = db.prepare('SELECT * FROM saved_destinations WHERE user_id = ? AND city_id = ?')
      .get(req.userId, req.params.cityId);
    if (existing) {
      return res.status(200).json({ message: 'City already in saved destinations.', item: mapSavedDestination(existing, mapCity(city)) });
    }

    const id = uuidv4();
    const savedAt = new Date().toISOString();
    db.prepare('INSERT INTO saved_destinations (id, user_id, city_id, saved_at) VALUES (?, ?, ?, ?)')
      .run(id, req.userId, req.params.cityId, savedAt);

    const created = db.prepare('SELECT * FROM saved_destinations WHERE id = ?').get(id);
    return res.status(201).json({
      message: 'City saved successfully.',
      item: mapSavedDestination(created, mapCity(city))
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not save destination.' });
  }
});

// DELETE /api/saved/:cityId
router.delete('/:cityId', authMiddleware, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM saved_destinations WHERE user_id = ? AND city_id = ?')
      .get(req.userId, req.params.cityId);
    if (!existing) {
      return res.status(404).json({ message: 'Saved destination not found.' });
    }

    db.prepare('DELETE FROM saved_destinations WHERE user_id = ? AND city_id = ?')
      .run(req.userId, req.params.cityId);

    return res.json({ message: 'City removed from saved destinations.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not remove saved destination.' });
  }
});

module.exports = router;
