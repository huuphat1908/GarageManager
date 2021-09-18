const { ReceivingForm, Car } = require('../models');
const ReceivingFormService = require('../services/ReceivingForm');

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

    // Check car is in garage or not
    const car = await Car.findOne({ licensePlate: formInput.licensePlate, status: true });
    if (car) {
        return res.status(400).json({
            statusCode: 400,
            message: `Xe ${formInput.licensePlate} đã ở trong garage!!!`
        })
    }

    // If input is not null
    try {
        await ReceivingFormService.create(formInput);
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
        let objList = await ReceivingFormService.find();
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
        let objList = await ReceivingFormService.findOne(id);
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

