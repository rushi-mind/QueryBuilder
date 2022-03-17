require('dotenv').config();
const router = require('express').Router()
const createTable = require('../controllers/createTableController');

router.post('/api/create-table', createTable);

module.exports = router;