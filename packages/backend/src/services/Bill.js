const { Car, Bill, Customer } = require('../models');

/* `````````````````````````````````` */
// Put your custom services code below this line
exports.create = async input => {
    
    // Create bill base on input
    let newBill = await new Bill({
        ...input
    });
    await newBill.save();

    return newBill;
}

exports.find = () =>{
    return Bill.find({}).populate({
        path: 'car',
        populate: [
            {
                path: 'carBrand',
                model: 'CarBrand'
            },
            {
                path: 'carOwner',
                model: 'Customer'
            },
        ]
    });
}

exports.findOne = (id) =>{
    return Bill.findById(id).populate({
        path: 'car',
        populate: [
            {
                path: 'carBrand',
                model: 'carBrand'
            },
            {
                path: 'carOwner',
                model: 'Customer'
            },
        ]
    });
}

/* `````````````````````````````````` */
