const { Car } = require('../models');
const CarServices = require('../services/Car');
const { findOne, create, update } = require('../configs/controller.template.config')(Car);

/* ````````````Declare your custom controller here `````````````````````*/

const search = async (req, res) => {
    let input = req.body;

    try {
        let car = await CarServices.search(input);
        return res.status(200).json(car);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while find car with license plate ${licensePlate}`
        });
    }
}

const find = async (req, res) => {
    try {
        let objList = await CarServices.find();
        return res.status(200).json(objList);
    } catch(err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding cars list`
        });
    }
};
/* `````````````````````````````````````````````````````````````````````*/

module.exports = {
    search,
    find,
    findOne, 
    create,
    update
}