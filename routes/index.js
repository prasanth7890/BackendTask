const express = require('express');
const router = express.Router();

const {searchItems} = require('../controller/SearchController');

const productRoute = require('./ProductRoute');
const vairentRoute = require('./VarientRoute');

router.route('/search').get(searchItems);

router.use('/products', productRoute);
router.use('/varients', vairentRoute);

module.exports = router;