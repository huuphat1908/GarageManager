module.exports = function(Model) {
    const services = require('./service.template.config')(Model);
    return {
        create: async (req, res) => {
            let input = req.body;
            
            // If input is null, return 400 Error
            if(!input) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Your input is null/empty'
                });
            }
        
            // If input is not null, create new car brand
            try {
                let newDocument = await services.create(input);
                return res.status(201).json(newDocument);
            } catch (err) {
                return res.status(500).json({
                    statusCode: 500,
                    message: err.message || `Some errors occur while creating new ${Model}`
                });
            }
        },
        find: async (req, res) => {
            try {
                let objList = await services.find();
                return res.status(200).json(objList);
            } catch(err) {
                return res.status(500).json({
                    statusCode: 500,
                    message: err.message || `Some errors occur while finding ${Model} list`
                });
            }
        },
        findOne: async (req, res) => {
            let id = req.params.id;
            try {
                let document = await services.findOne(id);
                return res.status(200).json(document);
            } catch(err) {
                return res.status(500).json({
                    statusCode: 500,
                    message: err.message || `Some errors occur while finding ${Model} with ID ${id}`
                });
            }
        },
        update: async (req, res) => {
            let id = req.params.id;
            let updateContent = req.body;

            try {
                await services.update(id, updateContent);
                return res.status(200).json({
                    statusCode: 200,
                    message: `Update ${Model} with ID ${id} successfully`
                });
            } catch(err) {
                return res.status(500).json({
                    statusCode: 500,
                    message: err.message || `Some errors occur while updating ${Model} with ID ${id}`
                });
            }
        },
        deleteOne: async (req, res) => {
            let id = req.params.id;
            try {
                let document = await services.deleteOne(id);
                return res.status(200).json(document);
            } catch(err) {
                return res.status(500).json({
                    statusCode: 500,
                    message: err.message || `Some errors occur while deleting ${Model} with ID ${id}`
                });
            }
        },
    }
}