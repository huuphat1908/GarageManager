const { RepairVoteDetail } = require('../models');
const { find, findOne, create } = require('../configs/controller.template.config')(RepairVoteDetail);

/* ````````````Declare your custom controller here `````````````````````*/


/* `````````````````````````````````````````````````````````````````````*/

module.exports = {
    find,
    findOne,
    create
}