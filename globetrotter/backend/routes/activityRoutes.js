const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { mapActivity } = require('../serializers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

function assertStopOwnership(stopId, userId) {
  const stop = db.prepare('SELECT * FROM stops WHERE id = ?').get(stopId);
  if (!stop) return { error: 404, message: 'Stop not found.' };
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(stop.trip_id);
  if (!trip || trip.user_id !== userId) return { error: 403, message: 'You do not have access to this stop.' };
  return { stop, trip };
}

// GET /api/activities/templates or GET /api/templates or GET /api/activities
router.get(['/templates', '/activities/templates', '/activities'], (req, res) => {
  try {
    const { type, maxCost, maxDuration, search, cityId } = req.query;
    let sql = `
      SELECT activities.*, cities.name as cityName, cities.country as cityCountry 
      FROM activities 
      LEFT JOIN cities ON activities.city_id = cities.id 
      WHERE activities.is_template = 1
    `;
    const params = [];

    if (type) {
      sql += ' AND LOWER(activities.type) = ?';
      params.push(type.toLowerCase());
    }
    if (maxCost) {
      sql += ' AND activities.cost <= ?';
      params.push(Number(maxCost));
    }
    if (maxDuration) {
      sql += ' AND activities.duration <= ?';
      params.push(Number(maxDuration));
    }
    if (search) {
      sql += ' AND (LOWER(activities.name) LIKE ? OR LOWER(activities.description) LIKE ? OR LOWER(COALESCE(cities.name, "")) LIKE ?)';
      const q = `%${search.toLowerCase()}%`;
      params.push(q, q, q);
    }
    if (cityId) {
      sql += ' AND activities.city_id = ?';
      params.push(cityId);
    }
    sql += ' ORDER BY activities.cost DESC, activities.name ASC';
    const rows = db.prepare(sql).all(...params);
    return res.json(rows.map(mapActivity));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch activity templates.' });
  }
});

// POST /api/stops/:stopId/activities
router.post('/stops/:stopId/activities', authMiddleware, (req, res) => {
  try {
    const { error, message } = assertStopOwnership(req.params.stopId, req.userId);
    if (error) return res.status(error).json({ message });

    const { name, type, cost, duration, description, imageUrl, activityDate, startTime } = req.body;
    if (!name || cost === undefined) {
      return res.status(400).json({ message: 'Activity name and cost are required.' });
    }

    const orderResult = db.prepare('SELECT COUNT(*) AS c FROM activities WHERE stop_id = ?').get(req.params.stopId);
    const activityOrder = orderResult?.c || 0;

    const id = uuidv4();
    db.prepare(
      `INSERT INTO activities (id, stop_id, city_id, name, type, cost, duration, description, image_url, activity_date, start_time, activity_order, is_template)
       VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).run(
      id,
      req.params.stopId,
      name,
      type || 'General',
      Number(cost),
      duration ? Number(duration) : 1,
      description || '',
      imageUrl || '',
      activityDate || null,
      startTime || null,
      activityOrder
    );

    return res.status(201).json(mapActivity(db.prepare('SELECT * FROM activities WHERE id = ?').get(id)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not add activity.' });
  }
});

// POST /api/stops/:stopId/activities/from-template/:templateId
router.post('/stops/:stopId/activities/from-template/:templateId', authMiddleware, (req, res) => {
  try {
    const { error, message } = assertStopOwnership(req.params.stopId, req.userId);
    if (error) return res.status(error).json({ message });

    const template = db.prepare('SELECT * FROM activities WHERE id = ? AND is_template = 1').get(req.params.templateId);
    if (!template) return res.status(404).json({ message: 'Activity template not found.' });

    const { activityDate, startTime } = req.body;

    const orderResult = db.prepare('SELECT COUNT(*) AS c FROM activities WHERE stop_id = ?').get(req.params.stopId);
    const activityOrder = orderResult?.c || 0;

    const id = uuidv4();
    db.prepare(
      `INSERT INTO activities (id, stop_id, city_id, name, type, cost, duration, description, image_url, activity_date, start_time, activity_order, is_template)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).run(
      id,
      req.params.stopId,
      template.city_id,
      template.name,
      template.type,
      template.cost,
      template.duration,
      template.description,
      template.image_url || '',
      activityDate || null,
      startTime || null,
      activityOrder
    );

    return res.status(201).json(mapActivity(db.prepare('SELECT * FROM activities WHERE id = ?').get(id)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not add activity from template.' });
  }
});

// PUT /api/stops/:stopId/activities/reorder
router.put('/stops/:stopId/activities/reorder', authMiddleware, (req, res) => {
  try {
    const { error, message } = assertStopOwnership(req.params.stopId, req.userId);
    if (error) return res.status(error).json({ message });

    const { orderedActivityIds } = req.body;
    if (!Array.isArray(orderedActivityIds)) {
      return res.status(400).json({ message: 'orderedActivityIds must be an array.' });
    }

    const update = db.prepare('UPDATE activities SET activity_order = ? WHERE id = ? AND stop_id = ?');
    const applyOrder = db.transaction((ids) => {
      ids.forEach((actId, index) => update.run(index, actId, req.params.stopId));
    });
    applyOrder(orderedActivityIds);

    const activities = db
      .prepare('SELECT * FROM activities WHERE stop_id = ? ORDER BY activity_order ASC, id ASC')
      .all(req.params.stopId)
      .map(mapActivity);
    return res.json(activities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not reorder activities.' });
  }
});

// PUT /api/stops/:stopId/activities/:activityId
router.put('/stops/:stopId/activities/:activityId', authMiddleware, (req, res) => {
  try {
    const { error, message } = assertStopOwnership(req.params.stopId, req.userId);
    if (error) return res.status(error).json({ message });

    const existing = db.prepare('SELECT * FROM activities WHERE id = ? AND stop_id = ?')
      .get(req.params.activityId, req.params.stopId);
    if (!existing) return res.status(404).json({ message: 'Activity not found.' });

    const { name, type, cost, duration, description, imageUrl, activityDate, startTime } = req.body;
    db.prepare(
      `UPDATE activities SET
        name = ?, type = ?, cost = ?, duration = ?, description = ?,
        image_url = ?, activity_date = ?, start_time = ?
       WHERE id = ?`
    ).run(
      name !== undefined ? name : existing.name,
      type !== undefined ? type : existing.type,
      cost !== undefined ? Number(cost) : existing.cost,
      duration !== undefined ? Number(duration) : existing.duration,
      description !== undefined ? description : existing.description,
      imageUrl !== undefined ? imageUrl : (existing.image_url || ''),
      activityDate !== undefined ? activityDate : existing.activity_date,
      startTime !== undefined ? startTime : existing.start_time,
      existing.id
    );

    return res.json(mapActivity(db.prepare('SELECT * FROM activities WHERE id = ?').get(existing.id)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not update activity.' });
  }
});

// DELETE /api/stops/:stopId/activities/:activityId
router.delete('/stops/:stopId/activities/:activityId', authMiddleware, (req, res) => {
  try {
    const { error, message } = assertStopOwnership(req.params.stopId, req.userId);
    if (error) return res.status(error).json({ message });

    const activity = db.prepare('SELECT * FROM activities WHERE id = ? AND stop_id = ?')
      .get(req.params.activityId, req.params.stopId);
    if (!activity) return res.status(404).json({ message: 'Activity not found.' });

    db.prepare('DELETE FROM activities WHERE id = ?').run(activity.id);
    return res.json({ message: 'Activity removed successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not remove activity.' });
  }
});

module.exports = router;
