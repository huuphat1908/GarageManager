const { Parameter } = require('../models');
const parameterServices = require('../services/Parameter');
const { find } = require('../configs/controller.template.config')(Parameter);

/* ````````````Declare your custom controller here `````````````````````*/

const modify = async (req, res) => {
    try {
        let input = req.body;
        await Parameter.update({}, input)
        return res.status(200).json('Update successfully');
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while updating parameters`
        });
    }
}

/* `````````````````````````````````````````````````````````````````````*/

module.exports = {
    find,
    modify
}