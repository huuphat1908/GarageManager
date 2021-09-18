var express = require('express');
var router = express.Router();
const { create, find, findOne } = require('../controllers/ReceivingForm');

/* POST send new receiving form */
router.post('/', create);

/* GET find cars list */
router.get('/:id', findOne);

/* GET find cars list */
router.get('/', find);

module.exports = router;