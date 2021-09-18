const { Sale, SaleDetail, CarBrand } = require('../models');
const SaleService = require('../services/Sale');
const RepairVoteService = require('../services/RepairVote');
const SaleDetailService = require('../configs/service.template.config')(SaleDetail)
const CarBrandService = require('../configs/service.template.config')(CarBrand)

/* ````````````Declare your custom controller here `````````````````````*/

const create = async (req, res) => {
    let input = req.body;
    // validation month
    if (input.month < 1 || input.month > 12)
        return res.status(400).json({
            statusCode: 400,
            message: 'Invalid month'
        });
    input.month -= 1;
    input.saleDetails = [];

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
            message: 'Không có dữ liệu vì không có sửa chữa nào xảy ra trong thời gian này!!!'
        });

    // Find total sale and report date
    let totalSale = 0;
    input.reportDate = new Date(input.year, input.month, new Date().getDate());
    delete input["month"];
    delete input["year"];
    repairVoteListInThisMonth.forEach(repairVote => {
        totalSale += repairVote.totalPrice;
    })
    input.totalSale = totalSale;

    // Save sale temporarily
    let saleId;
    try {
        let Sale = await SaleService.create(input)
            .then(newSale => { saleId = newSale._id })
            .catch(err => {
                if (err)
                    throw new Error(err);
            });
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || 'Some errors occur while creating new sale'
        });
    }

    // Create sale detail for each car brand
    let carBrandList = await CarBrandService.find().lean();
    let newSaleDetailObjList = [];
    carBrandList.forEach(carBrand => {
        let newSaleDetailObj = {
            carBrand: carBrand._id,
            numberOfRepairs: 0,
            ratio: 0,
            totalSale: 0,
            sale: saleId,
        };
        repairVoteListInThisMonth.forEach(repairVote => {
            if (JSON.stringify(repairVote.receivingForm.car.carBrand) === JSON.stringify(carBrand._id)) {
                newSaleDetailObj.numberOfRepairs++;
                newSaleDetailObj.totalSale += repairVote.totalPrice;
            }
        });
        if (newSaleDetailObj.totalSale > 0)
            newSaleDetailObj.ratio =  newSaleDetailObj.totalSale / totalSale;
        newSaleDetailObjList.push(newSaleDetailObj);
    })
    for (let i = 0; i < newSaleDetailObjList.length; i++) {
        await SaleDetailService.create(newSaleDetailObjList[i])
            .then(newSaleDetail => {
                input.saleDetails.push(newSaleDetail._id);
            })
            .catch(err => {
                if (err)
                return res.status(500).json({
                        statusCode: 500,
                        message: err.message || 'Some errors occur while creating new sale detail'
                    })
            });
    }
    await Sale.updateOne({ _id: saleId }, input);

    // Return api
    let saleReport = await SaleService.findOne(saleId).populate({
        path: "saleDetails",
        populate: {
            path: "carBrand",
            model: "CarBrand"
        }
    });
    return res.status(200).json(saleReport);
}

const find = async (req, res) => {
    try {
        let objList = await SaleService.find();
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
        const id = req.params.id
        let objList = await SaleService.findOne(id);
        return res.status(200).json(objList);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while finding repair votes list`
        });
    }
}

const deleteOne = async (req, res) => {
    let id = req.params.id;
    try {
        await SaleService.deleteOne(id);
        return res.status(200).json({
            message: 'Delete sale report successfully'
        })
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while deleting sale report`
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