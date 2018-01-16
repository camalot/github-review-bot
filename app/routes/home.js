'use strict';
const express = require('express');
const router = express.Router();
const Promise = require('promise');
const config = require('./home.config.js');

/* GET home page. */
router.get('/', (req, res, next) => {
  return res.render('index', { title: config.github.organization });
});

module.exports = router;
