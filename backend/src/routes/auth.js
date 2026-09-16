const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const isGoogleConfigured = () => {
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  return (
    id && id !== 'REPLACE_GOOGLE_CLIENT_ID' &&
    secret && secret !== 'REPLACE_GOOGLE_CLIENT_SECRET'
  );
};

const googleNotConfigured = (_req, res) => {
  res.status(503).json({
    message: 'Google OAuth is not configured.',
  });
};

// @route GET /api/auth/google
router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured()) return googleNotConfigured(req, res);
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
});

// @route GET /api/auth/google/callback
router.get('/google/callback', (req, res, next) => {
  if (!isGoogleConfigured()) return googleNotConfigured(req, res);

  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/?error=auth_failed`,
    session: false,
  })(req, res, (err) => {
    if (err) return next(err);

    const token = generateToken(req.user._id);
    const isProd = process.env.NODE_ENV === 'production';

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,           // must be true for SameSite=None to work
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with token in URL — React will store it in localStorage
    const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientURL}/dashboard?token=${token}`);
  });
});

// @route GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });
});

// @route POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
