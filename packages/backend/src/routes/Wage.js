var express = require('express');
var router = express.Router();
const { find, create, findOne, deleteOne, searchName, update } = require('../controllers/Wage');

/* search one wage base on name */
router.get('/search', searchName);

/* GET find wages list */
router.get('/:id', findOne);

/* PUT one wage by id */
router.put('/:id', update);

/* DELETE one wage */
router.delete('/:id', deleteOne);

/* GET find wages list */
router.get('/', find);

/* POST create new wage */
router.post('/', create);


module.exports = router;