const express = require('express');
const db = require('../db');
const { mapCity } = require('../serializers');

const router = express.Router();

// GET /api/cities/regions
router.get('/regions', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT region FROM cities ORDER BY region ASC').all();
    return res.json(rows.map((r) => r.region).filter(Boolean));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch regions.' });
  }
});

// GET /api/cities
router.get('/', (req, res) => {
  try {
    const { search, country, region, sortBy } = req.query;
    let sql = 'SELECT * FROM cities WHERE 1 = 1';
    const params = [];

    if (search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(country) LIKE ? OR LOWER(region) LIKE ?)';
      const q = `%${search.toLowerCase()}%`;
      params.push(q, q, q);
    }
    if (country) {
      sql += ' AND LOWER(country) = ?';
      params.push(country.toLowerCase());
    }
    if (region) {
      sql += ' AND LOWER(region) = ?';
      params.push(region.toLowerCase());
    }
    if (sortBy === 'popularity') sql += ' ORDER BY popularity DESC';
    else if (sortBy === 'cost') sql += ' ORDER BY cost_index ASC';
    else sql += ' ORDER BY name ASC';

    const rows = db.prepare(sql).all(...params);
    return res.json(rows.map(mapCity));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch cities.' });
  }
});

// GET /api/cities/:id
router.get('/:id', (req, res) => {
  try {
    const city = mapCity(db.prepare('SELECT * FROM cities WHERE id = ?').get(req.params.id));
    if (!city) return res.status(404).json({ message: 'City not found.' });
    return res.json(city);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch city.' });
  }
});

module.exports = router;
