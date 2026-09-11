const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { mapUser } = require('../serializers');
const { authMiddleware, JWT_SECRET } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const normalizedEmail = email.toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);
    const language = 'English';
    const createdAt = new Date().toISOString();

    db.prepare(`INSERT INTO users (id, name, email, password_hash, language, is_admin, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)`).run(id, name, normalizedEmail, passwordHash, language, createdAt);

    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      token,
      user: { id, name, email: normalizedEmail, language, photoUrl: null, isAdmin: false }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    const user = mapUser(userRow);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        language: user.language,
        photoUrl: user.photoUrl,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

    if (!userRow) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = uuidv4().replace(/-/g, '');
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?')
      .run(resetToken, expiry, userRow.id);

    const resetUrl = `/reset-password?token=${resetToken}`;
    return res.json({
      message: 'Password reset link generated.',
      resetUrl,
      note: 'In production this URL would be emailed. For this demo it is returned directly.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during password reset request.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const userRow = db.prepare('SELECT * FROM users WHERE reset_token = ?').get(token);
    if (!userRow) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    if (new Date(userRow.reset_token_expiry) < new Date()) {
      return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?')
      .run(newHash, userRow.id);

    return res.json({ message: 'Password updated successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during password reset.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = mapUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId));
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      language: user.language,
      photoUrl: user.photoUrl,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch profile.' });
  }
});

// PUT /api/auth/me
router.put('/me', authMiddleware, (req, res) => {
  try {
    const user = mapUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId));
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { name, language, photoUrl } = req.body;
    const newName = name !== undefined ? name : user.name;
    const newLanguage = language !== undefined ? language : user.language;
    const newPhotoUrl = photoUrl !== undefined ? photoUrl : user.photoUrl;

    db.prepare('UPDATE users SET name = ?, language = ?, photo_url = ? WHERE id = ?')
      .run(newName, newLanguage, newPhotoUrl, req.userId);

    return res.json({
      id: user.id,
      name: newName,
      email: user.email,
      language: newLanguage,
      photoUrl: newPhotoUrl,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not update profile.' });
  }
});

// DELETE /api/auth/me
router.delete('/me', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.userId);
    return res.json({ message: 'Account and all associated data deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not delete account.' });
  }
});

// GET /api/auth/preferences
// Returns stored bio, vibes, and currency preference for the authenticated user.
router.get('/preferences', authMiddleware, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(req.userId);
    return res.json({
      bio: row?.bio || '',
      vibes: row?.vibes ? JSON.parse(row.vibes) : [],
      currency: row?.currency || 'INR'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch preferences.' });
  }
});

// PUT /api/auth/preferences
// Upserts bio, vibes, and currency for the authenticated user.
router.put('/preferences', authMiddleware, (req, res) => {
  try {
    const { bio, vibes, currency } = req.body;
    const updatedAt = new Date().toISOString();
    const existingRow = db.prepare('SELECT user_id FROM user_preferences WHERE user_id = ?').get(req.userId);
    if (existingRow) {
      db.prepare(
        'UPDATE user_preferences SET bio = ?, vibes = ?, currency = ?, updated_at = ? WHERE user_id = ?'
      ).run(
        bio !== undefined ? bio : '',
        vibes !== undefined ? JSON.stringify(vibes) : '[]',
        currency || 'INR',
        updatedAt,
        req.userId
      );
    } else {
      db.prepare(
        'INSERT INTO user_preferences (user_id, bio, vibes, currency, updated_at) VALUES (?, ?, ?, ?, ?)'
      ).run(
        req.userId,
        bio || '',
        vibes ? JSON.stringify(vibes) : '[]',
        currency || 'INR',
        updatedAt
      );
    }
    const row = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(req.userId);
    return res.json({
      bio: row.bio || '',
      vibes: row.vibes ? JSON.parse(row.vibes) : [],
      currency: row.currency || 'INR'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not update preferences.' });
  }
});

module.exports = router;
