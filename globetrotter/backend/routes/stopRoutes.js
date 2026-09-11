const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { mapStop, mapCity } = require('../serializers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

function assertTripOwnership(tripId, userId) {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(tripId);
  if (!trip) return { error: 404, message: 'Trip not found.' };
  if (trip.user_id !== userId) return { error: 403, message: 'You do not have access to this trip.' };
  return { trip };
}

// POST /api/trips/:tripId/stops
router.post('/:tripId/stops', authMiddleware, (req, res) => {
  try {
    const { trip, error, message } = assertTripOwnership(req.params.tripId, req.userId);
    if (error) return res.status(error).json({ message });

    const { cityId, startDate, endDate } = req.body;
    if (!cityId || !startDate || !endDate) {
      return res.status(400).json({ message: 'City, start date, and end date are required.' });
    }
    const cityRow = db.prepare('SELECT * FROM cities WHERE id = ?').get(cityId);
    if (!cityRow) return res.status(404).json({ message: 'City not found.' });

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'Stop end date cannot be before start date.' });
    }
    if (new Date(startDate) < new Date(trip.start_date) || new Date(endDate) > new Date(trip.end_date)) {
      return res.status(400).json({
        message: `Stop dates must be within the trip dates (${trip.start_date} – ${trip.end_date}).`
      });
    }

    const order = db.prepare('SELECT COUNT(*) AS c FROM stops WHERE trip_id = ?').get(req.params.tripId)?.c || 0;
    const id = uuidv4();
    db.prepare(`INSERT INTO stops (id, trip_id, city_id, start_date, end_date, stop_order)
      VALUES (?, ?, ?, ?, ?, ?)`).run(id, req.params.tripId, cityId, startDate, endDate, order);

    const stop = mapStop(db.prepare('SELECT * FROM stops WHERE id = ?').get(id));
    return res.status(201).json({ ...stop, city: mapCity(cityRow) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not add stop.' });
  }
});

// PUT /api/trips/:tripId/stops/reorder
router.put('/:tripId/stops/reorder', authMiddleware, (req, res) => {
  try {
    const { error, message } = assertTripOwnership(req.params.tripId, req.userId);
    if (error) return res.status(error).json({ message });

    const { orderedStopIds } = req.body;
    if (!Array.isArray(orderedStopIds)) {
      return res.status(400).json({ message: 'orderedStopIds must be an array.' });
    }
    const update = db.prepare('UPDATE stops SET stop_order = ? WHERE id = ? AND trip_id = ?');
    const applyOrder = db.transaction((ids) => {
      ids.forEach((stopId, index) => update.run(index, stopId, req.params.tripId));
    });
    applyOrder(orderedStopIds);

    const stops = db.prepare('SELECT * FROM stops WHERE trip_id = ? ORDER BY stop_order ASC')
      .all(req.params.tripId)
      .map(mapStop);
    return res.json(stops);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not reorder stops.' });
  }
});

// PUT /api/trips/:tripId/stops/:stopId
router.put('/:tripId/stops/:stopId', authMiddleware, (req, res) => {
  try {
    const { trip, error, message } = assertTripOwnership(req.params.tripId, req.userId);
    if (error) return res.status(error).json({ message });

    const existing = db.prepare('SELECT * FROM stops WHERE id = ? AND trip_id = ?')
      .get(req.params.stopId, req.params.tripId);
    if (!existing) return res.status(404).json({ message: 'Stop not found.' });

    const { startDate, endDate } = req.body;
    const newStart = startDate || existing.start_date;
    const newEnd = endDate || existing.end_date;

    if (new Date(newEnd) < new Date(newStart)) {
      return res.status(400).json({ message: 'Stop end date cannot be before start date.' });
    }
    if (new Date(newStart) < new Date(trip.start_date) || new Date(newEnd) > new Date(trip.end_date)) {
      return res.status(400).json({
        message: `Stop dates must be within the trip dates (${trip.start_date} – ${trip.end_date}).`
      });
    }

    db.prepare('UPDATE stops SET start_date = ?, end_date = ? WHERE id = ?').run(newStart, newEnd, existing.id);
    return res.json(mapStop(db.prepare('SELECT * FROM stops WHERE id = ?').get(existing.id)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not update stop.' });
  }
});

// DELETE /api/trips/:tripId/stops/:stopId
router.delete('/:tripId/stops/:stopId', authMiddleware, (req, res) => {
  try {
    const { error, message } = assertTripOwnership(req.params.tripId, req.userId);
    if (error) return res.status(error).json({ message });

    const existing = db.prepare('SELECT * FROM stops WHERE id = ? AND trip_id = ?')
      .get(req.params.stopId, req.params.tripId);
    if (!existing) return res.status(404).json({ message: 'Stop not found.' });

    db.prepare('DELETE FROM stops WHERE id = ?').run(existing.id);
    return res.json({ message: 'Stop removed successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not remove stop.' });
  }
});

module.exports = router;
