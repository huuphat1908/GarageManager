const { InventoryReport, InventoryReportDetail, Accessory, AccessoryImportForm } = require('../models');
const InventoryReportService = require('../services/InventoryReport');
const InventoryReportDetailService = require('../configs/service.template.config')(InventoryReportDetail);
const RepairVoteService = require('../services/RepairVote');
const AccessoryService = require('../configs/service.template.config')(Accessory);
const AccessoryImportFormService = require('../configs/service.template.config')(AccessoryImportForm);


/* ````````````Declare your custom controller here `````````````````````*/

const create = async (req, res) => {
    let input = req.body;
    // validation month
    if (input.month < 1 || input.month > 12)
        res.status(400).json({
            statusCode: 400,
            error: 'Invalid month'
        });
    input.month -= 1;
    input.reportDetails = [];

    // Find repair vote in this month/year
    let repairVoteList = await RepairVoteService.find().lean();
    let repairVoteListInThisMonth = repairVoteList.filter(repairVote => {
        return (repairVote.repairDate.getMonth() == input.month)
            && (repairVote.repairDate.getFullYear() == input.year);
    })

    // check if no repair happened this month / year
    if (repairVoteListInThisMonth.length == 0)
        return res.status(400).json({
            statusCode: 400,
            message: 'Không có dữ liệu vì không đủ dữ liệu trong thời gian này!!!'
        });

    let repairVoteDetailList = [];
    repairVoteListInThisMonth.forEach( repairVote => {
        repairVote.details.forEach( repairVoteDetail => {
            repairVoteDetailList.push(repairVoteDetail);
        })
    })

    // Find all accessory import form in this month / year
    let accessoryImportList = await AccessoryImportFormService.find().lean();
    let accessoryImportListInThisMonth = accessoryImportList.filter(accessoryImport => {
        return (accessoryImport.date.getMonth() == input.month)
            && (accessoryImport.date.getFullYear() == input.year);
    })

    // Find report date
    input.reportDate = new Date(input.year, input.month, new Date().getDate());
    delete input["month"];
    delete input["year"];

    // Save inventory report temporarily
    let inventoryReportId;
    try {
        let InventoryReport = await InventoryReportService.create(input)
            .then(newInventoryReport => { inventoryReportId = newInventoryReport._id });
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || 'Some errors occur while creating new inventory report'
        });
    }

    // Create inventory report detail for each accessory
    let accessoryList = await AccessoryService.find().lean();
    let newInventoryReportDetailObjList = [];
    accessoryList.forEach(accessory => {
        let numberOfProductSold = 0;
        let newInventoryReportDetailObj = {
            inventoryReport: inventoryReportId,
            accessory: accessory._id,
            openingStock: 0,
            endingStock: accessory.remaining,
            arising: 0,
        };
        repairVoteDetailList.forEach(repairVoteDetail => {
            if (JSON.stringify(repairVoteDetail.accessory) === JSON.stringify(accessory._id)) {
                numberOfProductSold += repairVoteDetail.quantity;
            }
        });
        accessoryImportListInThisMonth.forEach(accessoryImport => {
            if (JSON.stringify(accessoryImport.accessoryId) === JSON.stringify(accessory._id)) {
                newInventoryReportDetailObj.arising += accessoryImport.amount;
            }
        });
        newInventoryReportDetailObj.openingStock = newInventoryReportDetailObj.endingStock + numberOfProductSold - newInventoryReportDetailObj.arising;
        newInventoryReportDetailObjList.push(newInventoryReportDetailObj);
    })
    
    // save inventory report details and update inventory report
    for (let i = 0; i < newInventoryReportDetailObjList.length; i++) {
        await InventoryReportDetailService.create(newInventoryReportDetailObjList[i])
            .then(newInventoryReportDetail => {
                input.reportDetails.push(newInventoryReportDetail._id);
            })
            .catch(err => {
                if (err)
                    res.status(500).json({
                        statusCode: 500,
                        message: err.message || 'Some errors occur while creating new inventory report detail'
                    })
            });
    }
    await InventoryReport.updateOne({ _id: inventoryReportId }, input);

    // Return api
    let inventoryReport = await InventoryReportService.findOne(inventoryReportId).populate({
        path: "reportDetails",
        populate: {
            path: "accessory",
            model: "Accessory"
        }
    });
    res.status(200).json(inventoryReport);
}

const find = async (req, res) => {
    try {
        let objList = await InventoryReportService.find();
        return res.status(200).json(objList);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding repair votes list`
        });
    }
}

const findOne = async (req, res) => {
    try {
        const id = req.params.id;
        let objList = await InventoryReportService.findOne(id);
        return res.status(200).json(objList);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding inventory report list`
        });
    }
}

const deleteOne = async (req, res) => {
    let id = req.params.id;
    try {
        await InventoryReportService.deleteOne(id);
        return res.status(200).json({
            message: 'Delete inventory report successfully'
        })
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while deleting inventory report`
        });
    }
}

/* `````````````````````````````````````````````````````````````````````*/

module.exports = {
    find,
    findOne,
    create,
    deleteOne
}