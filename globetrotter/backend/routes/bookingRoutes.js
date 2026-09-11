const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 1. Create a new confirmed booking & voucher record
 * POST /api/bookings
 */
router.post('/', async (req, res) => {
  try {
    const {
      destinationName,
      serviceType = 'tour',
      adults = 1,
      children = 0,
      startDate,
      stayTier = '3star',
      pickupCity = 'Mumbai',
      contactName,
      contactEmail,
      contactPhone,
      subtotal,
      gst,
      totalAmount,
      currency = 'INR',
      paymentMethod = 'RAZORPAY',
      paymentId,
      orderId
    } = req.body;

    if (!destinationName || !startDate || !contactName || !contactPhone) {
      return res.status(400).json({ message: 'Missing required booking details (destination, dates, or contact info).' });
    }

    // Optional user ID from token header if present
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'globetrotter_secure_jwt_secret_dev_key');
        userId = decoded.id || decoded.userId;
      }
    } catch (e) {}

    const id = uuidv4();
    const bookingRef = 'GT-BNK-' + Math.floor(100000 + Math.random() * 900000);
    const createdAt = new Date().toISOString();

    const calcSubtotal = Number(subtotal) || (adults * 7500 + children * 4500);
    const calcGst = Number(gst) || Math.round(calcSubtotal * 0.18);
    const calcTotal = Number(totalAmount) || (calcSubtotal + calcGst);

    db.prepare(`
      INSERT INTO bookings (
        id, booking_ref, user_id, destination_name, service_type,
        adults, children, start_date, stay_tier, pickup_city,
        contact_name, contact_email, contact_phone, subtotal, gst,
        total_amount, currency, payment_status, payment_method,
        payment_id, order_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      bookingRef,
      userId,
      destinationName,
      serviceType,
      adults,
      children,
      startDate,
      stayTier,
      pickupCity,
      contactName,
      contactEmail || '',
      contactPhone,
      calcSubtotal,
      calcGst,
      calcTotal,
      currency,
      'CONFIRMED',
      paymentMethod,
      paymentId || 'PAY_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      orderId || 'ORD_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      createdAt
    );

    const createdBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed!',
      booking: createdBooking
    });
  } catch (err) {
    console.error('Create booking error:', err);
    return res.status(500).json({ message: 'Internal server error while processing booking.' });
  }
});

/**
 * 2. Get user's active bookings
 * GET /api/bookings/my-bookings
 */
router.get('/my-bookings', authMiddleware, (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    return res.json(bookings);
  } catch (err) {
    console.error('Get my bookings error:', err);
    return res.status(500).json({ message: 'Failed to retrieve bookings.' });
  }
});

/**
 * 3. Look up single booking voucher by Reference Code
 * GET /api/bookings/voucher/:ref
 */
router.get('/voucher/:ref', (req, res) => {
  try {
    const ref = req.params.ref.toUpperCase();
    const booking = db.prepare('SELECT * FROM bookings WHERE booking_ref = ?').get(ref);
    if (!booking) {
      return res.status(404).json({ message: 'Booking voucher not found.' });
    }
    return res.json(booking);
  } catch (err) {
    console.error('Voucher lookup error:', err);
    return res.status(500).json({ message: 'Error retrieving voucher.' });
  }
});

module.exports = router;
