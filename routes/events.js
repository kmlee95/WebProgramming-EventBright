const express = require('express');
const catchErrors = require('../lib/async-error');

const router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

router.get('/', needAuth, (req, res, next) => {
  res.render('events/create');
});

module.exports = router;