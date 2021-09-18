var express = require('express');
var router = express.Router();
const { find, create, findOne } = require('../controllers/RepairVote');

/* GET find wages list */
router.get('/:id', findOne);

/* GET find wages list */
router.get('/', find);

/* POST create new wage */
router.post('/', create);


module.exports = router;