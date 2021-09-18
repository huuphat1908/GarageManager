var express = require('express');
var router = express.Router();
const { create, find, findOne, searchName, update, deleteOne } = require('../controllers/CarBrand');

/* GET search car brands by name */
router.get('/search', searchName);

/* GET find car brand by id */
router.get('/:id', findOne);

/* PUT update car brand by id */
router.put('/:id', update);

/* DELETE delete car brand by id */
router.delete('/:id', deleteOne);

/* GET find car brands list */
router.get('/', find);

/* POST create new car brand */
router.post('/', create);


module.exports = router;