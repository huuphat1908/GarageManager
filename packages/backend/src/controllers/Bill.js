const { Bill, Car, Customer } = require('../models');
const BillService = require('../services/Bill');

/* ````````````Declare your custom controller here `````````````````````*/

const create = async (req, res) => {
    let input = req.body;

    // If input is null, return 400 Error
    if(!input) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Your input is null/empty'
        });
    }

    if(input.amount <= 0) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Value of bill is 0'
        });
    }

    let car = await Car.findById(input.carId);
    // Update mail for carOwner and set debt of car to 0
    await Customer.updateOne({ _id: car.carOwner }, { email: input.email });
    let remainingDebt = car.debt - parseInt(input.amount);
    // check if moneyPaid is larger than debt of car
    if (remainingDebt < 0) {
      return res.status(400).json({
          statusCode: 400,
          message: 'Customer paid more than debt of car'
      })  
    }
    await Car.updateOne({ _id: input.carId}, { debt: remainingDebt });
    input.car = car._id;
    delete input['email'];
    
    // If input is not null, create new car brand
    try {
        let Bill = await BillService.create(input);
        return res.status(201).json(Bill);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || 'Some errors occur while creating new repair vote'
        });
    }
}

const find = async (req, res) => {
    try { 
        let objList = await BillService.find();
        return res.status(200).json(objList);
    } catch(err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding repair votes list`
        });
    }
}

const findOne = async (req, res) => {
    try {
        const id = req.params.id
        let objList = await BillService.findOne(id);
        return res.status(200).json(objList);
    } catch(err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding repair votes list`
        });
    }
}

/* `````````````````````````````````````````````````````````````````````*/

module.exports = {
    find,
    findOne,
    create
}