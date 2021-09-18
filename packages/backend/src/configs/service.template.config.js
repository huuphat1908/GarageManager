module.exports = function(Model) {
    return {
        create: input => {
            let newDocument = new Model({
                ...input
            });
            return newDocument.save();
        },
        find: () => {
            return Model.find({});
        },
        findOne: (Id) => {
            return Model.findById(Id);
        },
        update: (id, updateContent) => {
            return Model.findByIdAndUpdate(id, {...updateContent});
        },
        deleteOne: (Id) => {
            return Model.deleteOne({ _id: Id });
        },
    }
}