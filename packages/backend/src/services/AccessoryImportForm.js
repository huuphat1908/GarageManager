const { AccessoryImportForm, Accessory, Parameter } = require('../models');

/* `````````````````````````````````` */
// Put your custom services code below this line
exports.create = async formInput => {
    // update accessory
    let accessory = await Accessory.findById(formInput.accessoryId);
    let newRemaining = parseInt(formInput.amount) + accessory.remaining; 
    await Accessory.updateOne({ _id: formInput.accessoryId} , { remaining: newRemaining });

    // Create new accessory import form
    let newAccessoryImportForm = await new AccessoryImportForm({
        ...formInput
    });

    await newAccessoryImportForm.save();
    
    return newAccessoryImportForm;
}

exports.find = () => {
    return AccessoryImportForm.find({}).populate('accessoryId');
}

exports.findOne = (id) => {
    return AccessoryImportForm.findOne({ _id: id }).populate('accessoryId');
}
/* `````````````````````````````````` */

