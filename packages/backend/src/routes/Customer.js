var express = require('express');
var router = express.Router();
const { find, create, findOne } = require('../controllers/Customer');

/* GET find accessaries list */
router.get('/:id', findOne);

/* GET find accessaries list */
router.get('/', find);

/* POST create new accessary */
router.post('/', create);


module.exports = router;