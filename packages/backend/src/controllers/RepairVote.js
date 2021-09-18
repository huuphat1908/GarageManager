const { RepairVote } = require('../models');
const RepairVoteServices = require('../services/RepairVote');

/* ````````````Declare your custom controller here `````````````````````*/

const create = async (req, res) => {
    let input = req.body;

    console.log(input);
    // If input is null, return 400 Error
    if(!input) {
        return res.status(400).json({
            statusCode: 400,
            message: 'Your input is null/empty'
        });
    }

    // If input is not null, create new car brand
    try {
        let RepairVote = await RepairVoteServices.create(input);
        return res.status(201).json(RepairVote);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            statusCode: 500,
            message: err.message || 'Some errors occur while creating new repair vote'
        });
    }
}

const find = async (req, res) => {
    try { 
        let objList = await RepairVoteServices.find();
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
        let objList = await RepairVoteServices.findOne(id);
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