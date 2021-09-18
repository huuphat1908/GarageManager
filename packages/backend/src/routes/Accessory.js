var express = require('express');
var router = express.Router();
const { find, create, findOne, deleteOne, searchName, update } = require('../controllers/Accessory');

/* GET to find accessory base on name */
router.get('/search', searchName);

/* GET find accessories list */
router.get('/:id', findOne);

/* PUT edit one accessory by id */
router.put('/:id', update);

/* DELETE to delete one accessory */
router.delete('/:id', deleteOne);

/* GET find accessories list */
router.get('/', find);

/* POST create new accessory */
router.post('/', create);


module.exports = router;