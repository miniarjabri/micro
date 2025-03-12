const express = require('express');
const router = express.Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

// auth logout handled by passport
router.get('/logout', (req, res) => {
  req.logOut(); // logs user out
  res.redirect('/'); // redirects to homepage
});

/*
 *   authenticate using the google strat from passport-setup.js
 *   scope: ['profile'] means you're only requesting their profile
 *   passpport will send you to the consent screen and ask if you
 *   want to allow this app to access your 'profile'
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

// callback route for google to redirect after user logs in
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/list');
});

module.exports = router;