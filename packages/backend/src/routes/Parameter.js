var express = require('express');
var router = express.Router();
const { find, modify } = require('../controllers/Parameter');

/* GET find parameter list */
router.get('/', find);

/* Modify parameters */
router.put('/', modify);


module.exports = router;