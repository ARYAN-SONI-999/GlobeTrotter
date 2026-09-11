require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const stopRoutes = require('./routes/stopRoutes');
const activityRoutes = require('./routes/activityRoutes');
const cityRoutes = require('./routes/cityRoutes');
const communityRoutes = require('./routes/communityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const savedRoutes = require('./routes/savedRoutes');
const placeRoutes = require('./routes/placeRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const transitRoutes = require('./routes/transitRoutes');
const externalRoutes = require('./routes/externalRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Headers ──────────────────────────────────────────────────────────
try {
  const helmet = require('helmet');
  app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  }));
} catch (e) {}

// ── CORS ─────────────────────────────────────────────────────────────────────
// Dynamic origin resolution supporting Render frontend URL & local dev environments
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((s) => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

// ── Optional response compression ────────────────────────────────────────────
try {
  const compression = require('compression');
  app.use(compression());
} catch (e) {
  // compression is optional; skip if not installed
}

// ── Rate limiting on auth endpoints ──────────────────────────────────────────
// Limits login and signup to 20 attempts per IP per 15 minutes to prevent
// brute-force attacks. express-rate-limit is installed as a dependency.
try {
  const rateLimit = require('express-rate-limit');
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts from this IP. Please try again in 15 minutes.' }
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/signup', authLimiter);
  app.use('/api/auth/forgot-password', authLimiter);
} catch (e) {
  console.warn('express-rate-limit not installed — auth rate limiting is disabled. Run: npm install express-rate-limit');
}

// ── Cache headers for GET requests (non-auth) ─────────────────────────────────
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'public, max-age=60');
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development', message: 'GlobeTrotter API is running.' });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips', stopRoutes);
app.use('/api', activityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/agency', agencyRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/transit', transitRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/checkout', checkoutRoutes);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ── Database init & server start ──────────────────────────────────────────────
const { seedDatabase } = require('./seed');

db.init()
  .then(async () => {
    try {
      const cityCount = db.prepare('SELECT count(*) as count FROM cities').get();
      if (!cityCount || Number(cityCount.count) === 0) {
        console.log('Database empty on startup — automatically seeding destinations and places...');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('Auto-seed check note:', seedErr.message);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`GlobeTrotter API listening on port ${PORT} (CORS origin: ${process.env.CORS_ORIGIN || 'localhost:5173'})`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;
