const { Customer } = require('../models');
const customerServices = require('../services/Customer');
const {find, findOne, create } = require('../configs/controller.template.config')(Customer);

/* ````````````Declare your custom controller here `````````````````````*/


/* `````````````````````````````````````````````````````````````````````*/

module.exports = {
    find,
    findOne,
    create
}