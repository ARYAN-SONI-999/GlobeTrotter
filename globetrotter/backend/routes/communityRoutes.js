const express = require('express');
const db = require('../db');
const { mapTrip } = require('../serializers');

const router = express.Router();

// GET /api/community — public trip feed
// Uses a single JOIN query to avoid the N+1 problem of fetching each user's
// name in a separate query per trip.
router.get('/', (req, res) => {
  try {
    // One query to get all public trips with their author names
    const rows = db.prepare(`
      SELECT t.*, u.name AS author_name
      FROM trips t
      JOIN users u ON u.id = t.user_id
      WHERE t.is_public = 1
      ORDER BY t.created_at DESC
    `).all();

    const publicTrips = rows.map((row) => {
      const trip = mapTrip(row);
      // Fetch cities for this trip's stops in a single query per trip
      const stopRows = db.prepare(
        'SELECT c.name FROM stops s JOIN cities c ON c.id = s.city_id WHERE s.trip_id = ? ORDER BY s.stop_order ASC'
      ).all(trip.id);
      return {
        ...trip,
        authorName: row.author_name || 'A GlobeTrotter user',
        cities: stopRows.map((s) => s.name)
      };
    });

    return res.json(publicTrips);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch community trips.' });
  }
});

module.exports = router;
