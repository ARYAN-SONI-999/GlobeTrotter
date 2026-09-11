const express = require('express');
const db = require('../db');
const { mapPlace, mapCity } = require('../serializers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/places/categories
router.get('/categories', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT category FROM places ORDER BY category ASC').all();
    const categories = rows.map((r) => r.category).filter(Boolean);
    return res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ message: 'Could not fetch place categories.' });
  }
});

// GET /api/places/suggestions/for-trip/:tripId
router.get('/suggestions/for-trip/:tripId', authMiddleware, (req, res) => {
  try {
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.tripId);
    if (!trip || trip.user_id !== req.userId) {
      return res.status(404).json({ message: 'Trip not found or access denied.' });
    }

    const stops = db.prepare('SELECT * FROM stops WHERE trip_id = ? ORDER BY stop_order ASC').all(trip.id);
    if (!stops || stops.length === 0) {
      return res.json({ suggestionsByCity: {} });
    }

    const cityIds = [...new Set(stops.map((s) => s.city_id))];
    const existingActivities = db.prepare(`
      SELECT a.name, a.city_id, a.stop_id, a.type
      FROM activities a
      JOIN stops s ON a.stop_id = s.id
      WHERE s.trip_id = ?
    `).all(trip.id);

    const existingNames = new Set(existingActivities.map((a) => a.name.toLowerCase()));

    const suggestionsByCity = {};

    cityIds.forEach((cityId) => {
      const cityRow = db.prepare('SELECT * FROM cities WHERE id = ?').get(cityId);
      if (!cityRow) return;
      const city = mapCity(cityRow);

      const placeRows = db.prepare('SELECT * FROM places WHERE city_id = ? ORDER BY rating DESC, reviews_count DESC').all(cityId);
      const filteredPlaces = placeRows
        .map(mapPlace)
        .filter((p) => !existingNames.has(p.name.toLowerCase()));

      suggestionsByCity[city.name] = {
        city,
        places: filteredPlaces.slice(0, 6)
      };
    });

    return res.json({ suggestionsByCity });
  } catch (err) {
    console.error('Error generating trip suggestions:', err);
    return res.status(500).json({ message: 'Could not generate recommendations.' });
  }
});

// GET /api/places/nearby/:id
router.get('/nearby/:id', (req, res) => {
  try {
    const place = db.prepare('SELECT * FROM places WHERE id = ?').get(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found.' });

    const nearbyRows = db.prepare('SELECT * FROM places WHERE city_id = ? AND id != ? ORDER BY rating DESC LIMIT 4').all(place.city_id, place.id);
    return res.json(nearbyRows.map(mapPlace));
  } catch (err) {
    console.error('Error fetching nearby places:', err);
    return res.status(500).json({ message: 'Could not fetch nearby places.' });
  }
});

// GET /api/places/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM places WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ message: 'Place not found.' });

    const place = mapPlace(row);
    const cityRow = db.prepare('SELECT * FROM cities WHERE id = ?').get(place.cityId);
    place.city = mapCity(cityRow);

    return res.json(place);
  } catch (err) {
    console.error('Error fetching place:', err);
    return res.status(500).json({ message: 'Could not fetch place details.' });
  }
});

const { getOrCreateCity, DETAILED_DESTINATION_BRAIN } = require('./plannerRoutes');

let brainSynced = false;
function syncBrainDestinations() {
  if (brainSynced) return;
  try {
    if (DETAILED_DESTINATION_BRAIN && typeof getOrCreateCity === 'function') {
      Object.keys(DETAILED_DESTINATION_BRAIN).forEach((key) => {
        getOrCreateCity(key);
      });
    }
    brainSynced = true;
  } catch (e) {
    console.error('Brain sync error:', e);
  }
}

// GET /api/places
router.get('/', (req, res) => {
  try {
    syncBrainDestinations();

    const { cityId, cityName, category, search, minRating, maxCost, scope, limit } = req.query;

    let sql = 'SELECT p.*, c.name as city_name, c.country as city_country, c.region as city_region FROM places p JOIN cities c ON p.city_id = c.id WHERE 1=1';
    const params = [];

    if (scope === 'domestic') {
      sql += " AND (LOWER(c.country) = 'india' OR LOWER(c.region) LIKE '%india%')";
    } else if (scope === 'international') {
      sql += " AND LOWER(c.country) != 'india' AND LOWER(c.region) NOT LIKE '%india%'";
    }

    if (cityId) {
      sql += ' AND p.city_id = ?';
      params.push(cityId);
    }

    if (cityName) {
      sql += ' AND (LOWER(c.name) LIKE ? OR LOWER(c.country) LIKE ?)';
      params.push(`%${cityName.toLowerCase()}%`, `%${cityName.toLowerCase()}%`);
    }

    if (category && category !== 'All') {
      sql += ' AND LOWER(p.category) = ?';
      params.push(category.toLowerCase());
    }

    if (search) {
      sql += ' AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.tags) LIKE ? OR LOWER(c.name) LIKE ?)';
      const q = `%${search.toLowerCase()}%`;
      params.push(q, q, q, q);
    }

    if (minRating) {
      sql += ' AND p.rating >= ?';
      params.push(Number(minRating));
    }

    if (maxCost !== undefined && maxCost !== '') {
      sql += ' AND p.cost <= ?';
      params.push(Number(maxCost));
    }

    sql += ' ORDER BY p.rating DESC, p.reviews_count DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
    }

    let rows = db.prepare(sql).all(...params);

    // If search term or cityName returned no results, dynamically synthesize the destination on the fly!
    if (rows.length === 0 && (search || cityName) && typeof getOrCreateCity === 'function') {
      const term = (search || cityName).trim();
      if (term.length >= 2) {
        getOrCreateCity(term);
        rows = db.prepare(sql).all(...params);
      }
    }

    const mapped = rows.map((r) => {
      const place = mapPlace(r);
      place.cityName = r.city_name;
      place.cityCountry = r.city_country;
      place.cityRegion = r.city_region;
      return place;
    });

    return res.json(mapped);
  } catch (err) {
    console.error('Error fetching places:', err);
    return res.status(500).json({ message: 'Could not fetch places.' });
  }
});

module.exports = router;
