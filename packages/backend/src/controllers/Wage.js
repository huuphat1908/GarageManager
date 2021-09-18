const { Wage, Parameter } = require('../models');
const { find, findOne, update } = require('../configs/controller.template.config')(Wage);
const WageService = require('../configs/service.template.config')(Wage);

/* ````````````Declare your custom controller here `````````````````````*/

const searchName = async (req, res) => {
    let query = req.query;
    try {
        let wages = await Wage.find({});
        if(query.name)
            wages = wages.filter(wage => {
                return nonAccentVietnamese(wage.name.toLowerCase()).indexOf(nonAccentVietnamese(query.name.toLowerCase())) !== -1;
            })
       
        return res.status(200).json(wages);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors happened when finding wage`
        });
    }
}

const create = async (req, res) => {
    let input = req.body;

    // create new accessory
    try {
        await WageService.create(input);
        // update parameter
        let parameter = await Parameter.findOne({});
        parameter.numberOfKindOfWage += 1;
        await Parameter.update({}, parameter);

        res.status(201).json({
            statusCode: 201,
            message: 'Create new wage successfully'
        })
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors happened when creating wage`
        });
    }
}

const deleteOne = async (req, res) => {
    let id = req.params.id;
    try {
        let document = await WageService.deleteOne(id);

        // update parameter
        let parameter = await Parameter.findOne({});
        parameter.numberOfKindOfWage -= 1;
        await Parameter.update({}, parameter);

        return res.status(200).json(document);
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            message: err.message || `Some errors occur while deleting ${Model} with ID ${id}`
        });
    }
}

/* `````````````````````````````````````````````````````````````````````*/


module.exports = {
    find,
    findOne,
    create,
    deleteOne,
    searchName,
    update
}


// ======================================

function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}