'use strict';
const express = require('express');
const router = express.Router();
const Promise = require('promise');

/* GET home page. */
router.get('/', (req, res, next) => {
  return res.render('index', { title: "HOME" });
});

module.exports = router;
