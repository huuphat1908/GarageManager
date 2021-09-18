var express = require('express');
var router = express.Router();
const { create, find, findOne, deleteOne } = require('../controllers/InventoryReport');

/* GET find one inventory report list */
router.get('/:id', findOne);

/* DELTE one inventory report */
router.delete('/:id', deleteOne);

/* GET find inventory report */
router.get('/', find);

/* POST create new inventory report */
router.post('/', create);


module.exports = router;