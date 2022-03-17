require('dotenv').config();
const router = require('express').Router()
const main = require('../controllers/mainController');

router.get('/api', main);

module.exports = router;