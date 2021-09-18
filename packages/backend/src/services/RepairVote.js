const { RepairVote, RepairVoteDetail, Wage, Accessory, ReceivingForm, Car } = require('../models');

/* `````````````````````````````````` */
// Put your custom services code below this line
exports.create = async input => {
    let totalPrice = 0;
    let details = [];

    // Check if exist receivingForm
    let receivingForm = await ReceivingForm.findById(input.receivingForm);
    if(!receivingForm)
        throw new Error(`Not exist the receiving form with id ${input.receivingForm}`)

    // Create repair vote details
    for(let i = 0; i < input.details.length; i++) {
        let wage = await Wage.findById(input.details[i].wage);
        let accessory = await Accessory.findById(input.details[i].accessory);
        accessory.remaining -= input.details[i].quantity;
        await accessory.save();
        input.details[i].price = wage.price + accessory.unitPrice * input.details[i].quantity;

        let newRepairVoteDetail = new RepairVoteDetail({
            ...input.details[i]
        });
        await newRepairVoteDetail.save();

        totalPrice += newRepairVoteDetail.price;
        details.push(newRepairVoteDetail._id)
    }

    input.totalPrice = totalPrice;
    input.details = details;

    let car = await Car.findById(receivingForm.car);
    car.debt += totalPrice;
    car.save();
    
    // Create repair vote base on input
    let newRepairVotes = await new RepairVote({
        ...input
    });
    await newRepairVotes.save();

    // Set receiving form isDone to true
    receivingForm.isDone = true;
    await receivingForm.save();

    return newRepairVotes;
}

exports.find = () =>{
    return RepairVote.find({}).populate({
        path: 'receivingForm',
        populate: {
            path: 'car',
            model: 'Car'
        }
    }).populate('details');
}

exports.findOne = (id) =>{
    return RepairVote.findById(id).populate({
        path: 'receivingForm',
        populate: {
            path: 'car',
            model: 'Car'
        }
    }).populate('details');
}

/* `````````````````````````````````` */
