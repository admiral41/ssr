// routes.js
const express = require('express');
const htmlManipulator = require('../htmlManipulator');
const router = express.Router();

router.get('/blog/:slug', htmlManipulator.BlogDetailsPage);

module.exports = router;
