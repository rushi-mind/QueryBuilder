require('dotenv').config();
const router = require('express').Router()
const createTable = require('../controllers/createTableController');
const bodyParser = require('body-parser');

router.post('/api/create-table', [ bodyParser.json() ], createTable);

module.exports = router;