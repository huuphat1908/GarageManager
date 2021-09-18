const { Customer, Car, CarBrand, ReceivingForm, Parameter } = require('../models');

/* `````````````````````````````````` */
// Put your custom services code below this line
exports.create = async formInput => {
    // Max number of car in day
    const { maxNumberOfReceivedCarInDay } = await Parameter.findOne({});

    // Check number of received is less than setting or not
    const today = (new Date()).toISOString().slice(0, 10);
    const receivingForms = await ReceivingForm.find({receivingDate: {$gte: today}});
    if(receivingForms.length >= maxNumberOfReceivedCarInDay)
        throw new Error(`Garaga chỉ tiếp nhận tối đa ${maxNumberOfReceivedCarInDay} xe mỗi ngày!!!`)

    // If phone number has already existed, find its owner
    let customer = await Customer.findOne({
        phoneNumber: formInput.phoneNumber
    });

    // If phone number has not existed, create new customer
    if (!customer) {
        customer = await new Customer({
            name: formInput.name,
            phoneNumber: formInput.phoneNumber,
            address: formInput.address,
            email: formInput.email
        }).save();
    }

    // If car has already existed, find it
    let car = await Car.findOne({
        licensePlate: formInput.licensePlate
    });


    // If car has not existed, create new car
    if (!car) {
        let carBrand = await CarBrand.findOne({
            name: formInput.carBrand
        });
        
        car = await new Car({
            licensePlate: formInput.licensePlate,
            carOwner: customer._id,
            carBrand: carBrand._id,
        }).save();

    } else {
        if (car.carOwner.toString() !== customer._id.toString()) {
            throw new Error(`Customer is not car owner`);
        }
    }

    car.status = true;
    await car.save();
 
    // Create new receiving form
    let receivingForm = await new ReceivingForm({
        car: car._id,
        isDone: false,
        receivingDate: new Date(formInput.receivingDate),
    });

    await receivingForm.save();
    
    return receivingForm;
}

exports.find = () => {
    return ReceivingForm.find({}).populate({ 
        path: 'car',
        populate: [
            {
            path: 'carOwner',
            model: 'Customer'
            },
            {
                path: 'carBrand',
                model: 'CarBrand'
            }
        ]
     });
}

exports.findOne = (id) => {
    return ReceivingForm.findOne({ _id: id }).populate({ 
        path: 'car',
        populate: [
            {
            path: 'carOwner',
            model: 'Customer'
            },
            {
                path: 'carBrand',
                model: 'CarBrand'
            }
        ]
     });
}
/* `````````````````````````````````` */

