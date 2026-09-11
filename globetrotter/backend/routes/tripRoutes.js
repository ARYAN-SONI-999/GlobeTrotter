const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { mapTrip, mapStop, mapCity, mapActivity } = require('../serializers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

const STAY_COST_PER_NIGHT_FACTOR = 1.2;
const TRANSPORT_COST_PER_STOP = 600;  // ₹ INR — avg intercity bus/train fare per stop
const MEAL_COST_PER_DAY = 400;        // ₹ INR — avg daily meal cost (breakfast + lunch + dinner)

function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function dateRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function getStopsWithCityAndActivities(tripId) {
  const stopRows = db.prepare('SELECT * FROM stops WHERE trip_id = ? ORDER BY stop_order ASC').all(tripId);
  return stopRows.map((stopRow) => {
    const stop = mapStop(stopRow);
    const city = mapCity(db.prepare('SELECT * FROM cities WHERE id = ?').get(stopRow.city_id));
    const activities = db
      .prepare('SELECT * FROM activities WHERE stop_id = ? ORDER BY activity_order ASC, id ASC')
      .all(stopRow.id)
      .map(mapActivity);
    return { ...stop, city, activities };
  });
}

function computeBudget(tripId) {
  const stops = getStopsWithCityAndActivities(tripId);
  const tripRow = db.prepare('SELECT * FROM trips WHERE id = ?').get(tripId);
  const tripBudget = tripRow ? tripRow.budget : null;

  let stayCost = 0;
  let transportCost = 0;
  let activityCost = 0;
  const perStop = [];

  const dayCostMap = {};

  stops.forEach((stop) => {
    const nights = daysBetween(stop.startDate, stop.endDate);
    const stopStayCost = stop.city ? Math.round(stop.city.costIndex * STAY_COST_PER_NIGHT_FACTOR * nights) : 0;
    const stopActivityCost = stop.activities.reduce((sum, a) => sum + Number(a.cost || 0), 0);

    stayCost += stopStayCost;
    transportCost += TRANSPORT_COST_PER_STOP;
    activityCost += stopActivityCost;

    perStop.push({
      stopId: stop.id,
      city: stop.city ? stop.city.name : 'Unknown',
      nights,
      stayCost: stopStayCost,
      activityCost: stopActivityCost,
      activityCount: stop.activities.length
    });

    const dates = dateRange(stop.startDate, stop.endDate);
    const perDayStay = dates.length > 0 ? Math.round(stopStayCost / dates.length) : 0;
    dates.forEach((date) => {
      if (!dayCostMap[date]) dayCostMap[date] = { cost: 0, city: stop.city ? stop.city.name : 'Unknown' };
      dayCostMap[date].cost += perDayStay + MEAL_COST_PER_DAY;
    });

    stop.activities.forEach((act) => {
      const dateKey = act.activityDate || stop.startDate;
      if (!dayCostMap[dateKey]) dayCostMap[dateKey] = { cost: 0, city: stop.city ? stop.city.name : 'Unknown' };
      dayCostMap[dateKey].cost += Number(act.cost || 0);
    });
  });

  const mealsCost = stops.reduce((sum, stop) => sum + daysBetween(stop.startDate, stop.endDate) * MEAL_COST_PER_DAY, 0);
  const total = stayCost + transportCost + activityCost + mealsCost;
  const totalDays = stops.reduce((sum, s) => sum + daysBetween(s.startDate, s.endDate), 0) || 1;
  const averagePerDay = Math.round(total / totalDays);

  const dailyBudgetThreshold = tripBudget ? Math.round(tripBudget / totalDays) : Math.round(averagePerDay * 1.5);
  const dailyBudget = Object.entries(dayCostMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { cost, city }]) => ({
      date,
      city,
      dayCost: Math.round(cost),
      isOverBudget: Math.round(cost) > dailyBudgetThreshold,
      budgetThreshold: dailyBudgetThreshold
    }));

  return {
    total,
    breakdown: {
      stay: stayCost,
      transport: transportCost,
      activities: activityCost,
      meals: mealsCost
    },
    averagePerDay,
    tripBudget,
    dailyBudgetThreshold,
    dailyBudget,
    perStop
  };
}

function getOwnedTrip(tripId, userId) {
  const row = db.prepare('SELECT * FROM trips WHERE id = ?').get(tripId);
  if (!row) return { error: 404, message: 'Trip not found.' };
  if (row.user_id !== userId) return { error: 403, message: 'You do not have access to this trip.' };
  return { trip: mapTrip(row) };
}

// GET /api/trips
router.get('/', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
    const enriched = rows.map((row) => {
      const trip = mapTrip(row);
      const destinationCount = db.prepare('SELECT COUNT(*) AS c FROM stops WHERE trip_id = ?').get(trip.id)?.c || 0;
      return { ...trip, destinationCount };
    });
    return res.json(enriched);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch trips.' });
  }
});

// POST /api/trips
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, startDate, endDate, description, coverPhoto, budget } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Trip name, start date, and end date are required.' });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date.' });
    }
    const id = uuidv4();
    const shareId = uuidv4();
    const createdAt = new Date().toISOString();

    db.prepare(
      `INSERT INTO trips (id, user_id, name, start_date, end_date, description, cover_photo, budget, is_public, share_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
    ).run(id, req.userId, name, startDate, endDate, description || '', coverPhoto || null, budget || null, shareId, createdAt);

    return res.status(201).json(mapTrip(db.prepare('SELECT * FROM trips WHERE id = ?').get(id)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not create trip.' });
  }
});

// GET /api/trips/:id
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const { trip, error, message } = getOwnedTrip(req.params.id, req.userId);
    if (error) return res.status(error).json({ message });
    return res.json({ ...trip, stops: getStopsWithCityAndActivities(trip.id) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch trip.' });
  }
});

// PUT /api/trips/:id
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { trip, error, message } = getOwnedTrip(req.params.id, req.userId);
    if (error) return res.status(error).json({ message });

    const { name, startDate, endDate, description, coverPhoto, isPublic, budget } = req.body;
    const updated = {
      name: name !== undefined ? name : trip.name,
      startDate: startDate !== undefined ? startDate : trip.startDate,
      endDate: endDate !== undefined ? endDate : trip.endDate,
      description: description !== undefined ? description : trip.description,
      coverPhoto: coverPhoto !== undefined ? coverPhoto : trip.coverPhoto,
      budget: budget !== undefined ? budget : trip.budget,
      isPublic: isPublic !== undefined ? (isPublic ? 1 : 0) : (trip.isPublic ? 1 : 0)
    };

    db.prepare(
      `UPDATE trips SET name = ?, start_date = ?, end_date = ?, description = ?, cover_photo = ?, budget = ?, is_public = ? WHERE id = ?`
    ).run(updated.name, updated.startDate, updated.endDate, updated.description, updated.coverPhoto, updated.budget, updated.isPublic, trip.id);

    return res.json(mapTrip(db.prepare('SELECT * FROM trips WHERE id = ?').get(trip.id)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not update trip.' });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { trip, error, message } = getOwnedTrip(req.params.id, req.userId);
    if (error) return res.status(error).json({ message });
    db.prepare('DELETE FROM trips WHERE id = ?').run(trip.id);
    return res.json({ message: 'Trip deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not delete trip.' });
  }
});

// GET /api/trips/:id/budget
router.get('/:id/budget', authMiddleware, (req, res) => {
  try {
    const { trip, error, message } = getOwnedTrip(req.params.id, req.userId);
    if (error) return res.status(error).json({ message });
    return res.json(computeBudget(trip.id));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not compute budget.' });
  }
});

// GET /api/trips/public/:shareId
router.get('/public/:shareId', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM trips WHERE share_id = ? AND is_public = 1').get(req.params.shareId);
    if (!row) return res.status(404).json({ message: 'This shared itinerary is not available.' });
    const trip = mapTrip(row);
    const owner = db.prepare('SELECT * FROM users WHERE id = ?').get(trip.userId);

    return res.json({
      ...trip,
      ownerName: owner ? owner.name : 'A GlobeTrotter user',
      stops: getStopsWithCityAndActivities(trip.id),
      budget: computeBudget(trip.id)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not load shared itinerary.' });
  }
});

// POST /api/trips/:id/copy
router.post('/:id/copy', authMiddleware, (req, res) => {
  try {
    const sourceRow = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    if (!sourceRow || !sourceRow.is_public) {
      return res.status(404).json({ message: 'This trip is not available to copy.' });
    }
    const source = mapTrip(sourceRow);

    const newTripId = uuidv4();
    const newShareId = uuidv4();
    const createdAt = new Date().toISOString();

    const copyTxn = db.transaction(() => {
      db.prepare(
        `INSERT INTO trips (id, user_id, name, start_date, end_date, description, cover_photo, budget, is_public, share_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
      ).run(newTripId, req.userId, `${source.name} (Copy)`, source.startDate, source.endDate, source.description, source.coverPhoto, source.budget, newShareId, createdAt);

      const sourceStops = db.prepare('SELECT * FROM stops WHERE trip_id = ? ORDER BY stop_order ASC').all(source.id);
      sourceStops.forEach((stopRow) => {
        const newStopId = uuidv4();
        db.prepare(`INSERT INTO stops (id, trip_id, city_id, start_date, end_date, stop_order)
          VALUES (?, ?, ?, ?, ?, ?)`)
          .run(newStopId, newTripId, stopRow.city_id, stopRow.start_date, stopRow.end_date, stopRow.stop_order);

        const stopActivities = db.prepare('SELECT * FROM activities WHERE stop_id = ?').all(stopRow.id);
        stopActivities.forEach((actRow) => {
          db.prepare(
            `INSERT INTO activities (id, stop_id, city_id, name, type, cost, duration, description, image_url, activity_date, start_time, activity_order, is_template)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
          ).run(
            uuidv4(), newStopId, actRow.city_id, actRow.name, actRow.type,
            actRow.cost, actRow.duration, actRow.description,
            actRow.image_url || '', actRow.activity_date, actRow.start_time, actRow.activity_order
          );
        });
      });
    });
    copyTxn();

    return res.status(201).json(mapTrip(db.prepare('SELECT * FROM trips WHERE id = ?').get(newTripId)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not copy trip.' });
  }
});

module.exports = router;
