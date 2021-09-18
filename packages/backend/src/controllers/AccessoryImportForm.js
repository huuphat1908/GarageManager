const { AccessoryImportForm, Car } = require('../models');
const AccessoryImportFormFormService = require('../services/AccessoryImportForm');

/* ````````````Declare your custom controller here `````````````````````*/
const create = async (req, res) => {
    let formInput = req.body;

    // If input is null, return 400 Error
    if (!formInput) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Your input is null/empty'
        });
    }

    if (formInput.amount <= 0){
        return res.status(400).json({
            statusCode: 400,
            message: 'Number of accessories must be greater than zero'
        });
    }

    // If input is not null
    try {
        await AccessoryImportFormFormService.create(formInput);
        return res.status(201).json({
            statusCode: 201,
            message: 'Receiving your form succesfully'
        });
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || 'Some errors occur while receiving your form'
        });
    }
}

const find = async (req, res) => {
    try {
        let objList = await AccessoryImportFormFormService.find();
        return res.status(200).json(objList);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding receiving forms list`
        });
    }
}

const findOne = async (req, res) => {
    try {
        let id = req.params.id;
        let objList = await AccessoryImportFormFormService.findOne(id);
        return res.status(200).json(objList);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding receiving forms list`
        });
    }
}
/* `````````````````````````````````````````````````````````````````````*/

module.exports = {
    find,
    findOne,
    create,
}

