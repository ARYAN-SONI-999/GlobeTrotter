const express = require('express');
const db = require('../db');
const { mapUser } = require('../serializers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

function requireAdmin(req, res, next) {
  const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  const user = mapUser(userRow);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}

// GET /api/admin/stats
router.get('/stats', authMiddleware, requireAdmin, (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get()?.c || 0;
    const tripCount = db.prepare('SELECT COUNT(*) AS c FROM trips').get()?.c || 0;
    const publicTripCount = db.prepare('SELECT COUNT(*) AS c FROM trips WHERE is_public = 1').get()?.c || 0;
    const stopCount = db.prepare('SELECT COUNT(*) AS c FROM stops').get()?.c || 0;
    const activityCount = db.prepare('SELECT COUNT(*) AS c FROM activities WHERE is_template = 0').get()?.c || 0;

    const popularCities = db.prepare(`
      SELECT c.name, c.country, COUNT(s.id) AS count
      FROM stops s
      JOIN cities c ON s.city_id = c.id
      GROUP BY c.id
      ORDER BY count DESC
      LIMIT 5
    `).all();

    const popularActivities = db.prepare(`
      SELECT name, COUNT(id) AS count
      FROM activities
      WHERE is_template = 0
      GROUP BY name
      ORDER BY count DESC
      LIMIT 5
    `).all();

    return res.json({
      userCount,
      tripCount,
      publicTripCount,
      stopCount,
      activityCount,
      popularCities,
      popularActivities
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch admin statistics.' });
  }
});

// GET /api/admin/users
router.get('/users', authMiddleware, requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT id, name, email, language, is_admin, created_at FROM users ORDER BY created_at DESC').all();
    const users = rows.map((r) => {
      const u = mapUser(r);
      const tripCount = db.prepare('SELECT COUNT(*) AS c FROM trips WHERE user_id = ?').get(u.id)?.c || 0;
      return { ...u, tripCount };
    });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch users list.' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', authMiddleware, requireAdmin, (req, res) => {
  try {
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found.' });

    const { name, email, isAdmin } = req.body;
    const newName = name !== undefined ? name : target.name;
    const newEmail = email !== undefined ? email.toLowerCase() : target.email;
    const newIsAdmin = isAdmin !== undefined ? (isAdmin ? 1 : 0) : target.is_admin;

    db.prepare('UPDATE users SET name = ?, email = ?, is_admin = ? WHERE id = ?')
      .run(newName, newEmail, newIsAdmin, target.id);

    return res.json(mapUser(db.prepare('SELECT * FROM users WHERE id = ?').get(target.id)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not update user.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', authMiddleware, requireAdmin, (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: 'You cannot delete your own admin account from here.' });
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    return res.json({ message: 'User account deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not delete user.' });
  }
});

module.exports = router;
