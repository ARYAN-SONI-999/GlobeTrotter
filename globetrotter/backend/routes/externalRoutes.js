const express = require('express');
const router = express.Router();
const {
  geocodeLocation,
  getWikiSummary,
  getDrivingRoute,
  getLiveExchangeRates
} = require('../services/externalApiService');

// GET /api/external/geocode?q=...
router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }
    const results = await geocodeLocation(q);
    return res.json(results);
  } catch (err) {
    console.error('Geocode route error:', err);
    return res.status(500).json({ message: 'Geocoding request failed.' });
  }
});

// GET /api/external/wiki-summary?title=...
router.get('/wiki-summary', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Title parameter is required.' });
    }
    const summary = await getWikiSummary(title);
    if (!summary) {
      return res.status(404).json({ message: 'Wikipedia summary not found.' });
    }
    return res.json(summary);
  } catch (err) {
    console.error('Wikipedia route error:', err);
    return res.status(500).json({ message: 'Failed to fetch Wikipedia summary.' });
  }
});

// POST /api/external/directions
// Body: { points: [[lat1, lng1], [lat2, lng2], ...] }
router.post('/directions', async (req, res) => {
  try {
    const { points } = req.body;
    if (!Array.isArray(points) || points.length < 2) {
      return res.status(400).json({ message: 'At least 2 coordinate points required.' });
    }
    const route = await getDrivingRoute(points);
    if (!route) {
      return res.status(404).json({ message: 'Driving route could not be calculated.' });
    }
    return res.json(route);
  } catch (err) {
    console.error('Directions route error:', err);
    return res.status(500).json({ message: 'Failed to compute road route.' });
  }
});

// GET /api/external/exchange-rates
router.get('/exchange-rates', async (req, res) => {
  try {
    const rates = await getLiveExchangeRates();
    return res.json(rates);
  } catch (err) {
    console.error('Exchange rates route error:', err);
    return res.status(500).json({ message: 'Failed to fetch live exchange rates.' });
  }
});

module.exports = router;
