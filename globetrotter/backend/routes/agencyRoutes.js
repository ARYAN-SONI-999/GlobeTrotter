const express = require('express');
const { getAllAgencyDestinations, getAgencyDestinationByKey } = require('../services/travelAgencyService');

const router = express.Router();

// GET /api/agency/destinations
router.get('/destinations', (req, res) => {
  try {
    const { state, search } = req.query;
    let list = getAllAgencyDestinations();

    if (state) {
      list = list.filter((d) => d.state.toLowerCase() === state.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d) => 
        d.name.toLowerCase().includes(q) || 
        d.state.toLowerCase().includes(q) || 
        d.region.toLowerCase().includes(q)
      );
    }

    return res.json(list);
  } catch (err) {
    console.error('Agency API error:', err);
    return res.status(500).json({ message: 'Could not fetch tour agency destinations.' });
  }
});

// GET /api/agency/destinations/:key
router.get('/destinations/:key', (req, res) => {
  try {
    const dest = getAgencyDestinationByKey(req.params.key);
    if (!dest) return res.status(404).json({ message: 'Tour agency data not found for this destination.' });
    return res.json(dest);
  } catch (err) {
    console.error('Agency API error:', err);
    return res.status(500).json({ message: 'Could not fetch tour agency destination details.' });
  }
});

// GET /api/agency/packages
router.get('/packages', (req, res) => {
  try {
    const all = getAllAgencyDestinations();
    const packages = [];

    all.forEach((d) => {
      if (d.agencyPackages && d.agencyPackages.length > 0) {
        d.agencyPackages.forEach((pkg) => {
          packages.push({
            ...pkg,
            destination: d.name,
            state: d.state,
            destinationKey: d.key,
            coverPhoto: d.coverPhoto,
            agencyRating: d.agencyRating,
            agencyReviews: d.agencyReviews,
            certifications: d.certifications
          });
        });
      }
    });

    return res.json(packages);
  } catch (err) {
    console.error('Agency API error:', err);
    return res.status(500).json({ message: 'Could not fetch agency tour packages.' });
  }
});

module.exports = router;
