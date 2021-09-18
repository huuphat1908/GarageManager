const { InventoryReport } = require('../models');

/* `````````````````````````````````` */
// Put your custom services code below this line
exports.create = async input => {
    
    
    // Create sale base on input
    let newInventoryReport = await new InventoryReport({
        ...input
    });
    await newInventoryReport.save();

    return newInventoryReport;
}

exports.find = () =>{
    return InventoryReport.find({})
        .populate('reportDetails')
        .populate({
            path: 'reportDetails',
            populate: 'accessory'
        });
}

exports.findOne = (id) =>{
    return InventoryReport.findById(id).populate('reportDetails');
}

exports.deleteOne = (id) => {
    return InventoryReport.deleteOne({ _id: id })
}

/* `````````````````````````````````` */
