const express = require('express');
const router = express.Router();

let TRANSIT_DATA = {};
let getTransitForDestination = () => null;

try {
  const service = require('../services/transitDataService');
  TRANSIT_DATA = service.TRANSIT_DATA;
  getTransitForDestination = service.getTransitForDestination;
} catch (e) {
  console.warn('transitDataService not yet available:', e.message);
}

// GET /api/transit/:destinationKey
router.get('/:destinationKey', (req, res) => {
  try {
    const data = getTransitForDestination(req.params.destinationKey);
    if (!data) {
      return res.status(404).json({ message: 'Transit data not found for this destination.' });
    }
    return res.json(data);
  } catch (err) {
    console.error('Transit route error:', err);
    return res.status(500).json({ message: 'Failed to fetch transit data.' });
  }
});

// GET /api/transit — list all destinations
router.get('/', (req, res) => {
  try {
    return res.json(Object.keys(TRANSIT_DATA));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch transit destinations.' });
  }
});

module.exports = router;
