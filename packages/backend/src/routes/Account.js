var express = require('express');
var router = express.Router();
const { create, login, logOut, sendRole, changePassword, getUserId } = require('../controllers/Account');

/* POST create new accessary */
router.post('/', create);

/* GET get all user id */
router.get('/', getUserId);

/* POST for login and receive sessionId */
router.post('/login', login);

/* GET to log out */
router.get('/log-out', logOut);

/* POST to receive role of current user */
router.post('/role', sendRole);

/* PUT to change password */
router.put('/change-password', changePassword);

module.exports = router;