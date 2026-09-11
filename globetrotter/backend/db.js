const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

// Real Relational SQLite Database engine (compiled to pure WebAssembly).
// This eliminates native C++ / node-gyp / Visual Studio compilation dependencies
// so it runs on ANY Node version (including Node 24) on Windows, Mac, and Linux,
// while satisfying the Problem Statement's explicit requirement for a relational
// database with foreign keys, cascading deletes, indexes, and ACID transactions.

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbFilePath = path.join(dataDir, 'globetrotter.db');

let sqliteDb = null;
let initialized = false;

let inTransaction = false;

function saveToFile() {
  if (!sqliteDb || inTransaction) return;
  try {
    const data = sqliteDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbFilePath, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

async function init() {
  if (initialized && sqliteDb) return dbWrapper;

  const SQL = await initSqlJs();

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    sqliteDb = new SQL.Database(fileBuffer);
  } else {
    sqliteDb = new SQL.Database();
  }

  // Enable foreign keys
  sqliteDb.exec('PRAGMA foreign_keys = ON;');

  // Initialize schema
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'English',
      photo_url TEXT,
      is_admin INTEGER NOT NULL DEFAULT 0,
      reset_token TEXT,
      reset_token_expiry TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      region TEXT NOT NULL DEFAULT 'Other',
      cost_index REAL NOT NULL,
      popularity REAL NOT NULL,
      description TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      description TEXT DEFAULT '',
      cover_photo TEXT,
      budget REAL,
      is_public INTEGER NOT NULL DEFAULT 0,
      share_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stops (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      city_id TEXT NOT NULL REFERENCES cities(id),
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      stop_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      stop_id TEXT REFERENCES stops(id) ON DELETE CASCADE,
      city_id TEXT REFERENCES cities(id),
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'General',
      cost REAL NOT NULL DEFAULT 0,
      duration REAL NOT NULL DEFAULT 1,
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      activity_date TEXT,
      start_time TEXT,
      activity_order INTEGER NOT NULL DEFAULT 0,
      is_template INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS saved_destinations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
      saved_at TEXT NOT NULL,
      UNIQUE(user_id, city_id)
    );

    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Landmark',
      rating REAL NOT NULL DEFAULT 4.5,
      reviews_count INTEGER NOT NULL DEFAULT 120,
      cost REAL NOT NULL DEFAULT 0,
      duration REAL NOT NULL DEFAULT 2,
      best_time TEXT NOT NULL DEFAULT 'Morning',
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      address TEXT DEFAULT '',
      insider_tip TEXT DEFAULT '',
      tags TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      destinationKey TEXT NOT NULL,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      photoUrl TEXT,
      helpfulCount INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      bio TEXT DEFAULT '',
      vibes TEXT DEFAULT '[]',
      currency TEXT DEFAULT 'INR',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      booking_ref TEXT NOT NULL UNIQUE,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      destination_name TEXT NOT NULL,
      service_type TEXT NOT NULL DEFAULT 'tour',
      adults INTEGER NOT NULL DEFAULT 1,
      children INTEGER NOT NULL DEFAULT 0,
      start_date TEXT NOT NULL,
      stay_tier TEXT NOT NULL DEFAULT '3star',
      pickup_city TEXT,
      contact_name TEXT NOT NULL,
      contact_email TEXT,
      contact_phone TEXT NOT NULL,
      subtotal REAL NOT NULL,
      gst REAL NOT NULL,
      total_amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      payment_status TEXT NOT NULL DEFAULT 'CONFIRMED',
      payment_method TEXT NOT NULL DEFAULT 'RAZORPAY',
      payment_id TEXT,
      order_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
    CREATE INDEX IF NOT EXISTS idx_stops_trip ON stops(trip_id);
    CREATE INDEX IF NOT EXISTS idx_activities_stop ON activities(stop_id);
    CREATE INDEX IF NOT EXISTS idx_activities_city ON activities(city_id);
    CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_destinations(user_id);
    CREATE INDEX IF NOT EXISTS idx_places_city ON places(city_id);
    CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
    CREATE INDEX IF NOT EXISTS idx_places_city_rating ON places(city_id, rating DESC);
    CREATE INDEX IF NOT EXISTS idx_cities_popularity ON cities(popularity DESC);
    CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
    CREATE INDEX IF NOT EXISTS idx_reviews_dest ON reviews(destinationKey);
    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_ref);
  `);

  saveToFile();
  initialized = true;
  return dbWrapper;
}

const dbWrapper = {
  init,
  pragma(cmd) {
    if (!sqliteDb) return;
    sqliteDb.exec(`PRAGMA ${cmd};`);
  },
  exec(sql) {
    if (!sqliteDb) return;
    sqliteDb.exec(sql);
    saveToFile();
  },
  prepare(sql) {
    return {
      all(...params) {
        if (!sqliteDb) return [];
        const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const stmt = sqliteDb.prepare(sql);
        if (flatParams.length > 0) stmt.bind(flatParams);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
      },
      get(...params) {
        if (!sqliteDb) return undefined;
        const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const stmt = sqliteDb.prepare(sql);
        if (flatParams.length > 0) stmt.bind(flatParams);
        let row = undefined;
        if (stmt.step()) {
          row = stmt.getAsObject();
        }
        stmt.free();
        return row;
      },
      run(...params) {
        if (!sqliteDb) return { changes: 0, lastInsertRowid: 0 };
        const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const stmt = sqliteDb.prepare(sql);
        if (flatParams.length > 0) stmt.bind(flatParams);
        stmt.step();
        const changes = sqliteDb.getRowsModified();
        stmt.free();
        saveToFile();
        return { changes, lastInsertRowid: 0 };
      }
    };
  },
  transaction(fn) {
    return (...args) => {
      if (!sqliteDb) return;
      let startedLocal = false;
      if (!inTransaction) {
        try {
          sqliteDb.exec('BEGIN TRANSACTION;');
          inTransaction = true;
          startedLocal = true;
        } catch (e) {
          console.error('Begin transaction error:', e);
        }
      }
      try {
        const result = fn(...args);
        if (startedLocal) {
          sqliteDb.exec('COMMIT;');
          inTransaction = false;
          saveToFile();
        }
        return result;
      } catch (err) {
        if (startedLocal) {
          try {
            sqliteDb.exec('ROLLBACK;');
          } catch (rbErr) {}
          inTransaction = false;
        }
        console.error('Database transaction execution error:', err.message || err);
        throw err;
      }
    };
  }
};

module.exports = dbWrapper;
