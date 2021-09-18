exports.initRepairVoteDetail = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Repair Vote Detail Schema
    const RepairVoteDetailSchema = new Schema({
        content: String,
        accessory: { type: Schema.Types.ObjectId, ref: 'Accessory' },
        quantity: Number,
        wage: { type: Schema.Types.ObjectId, ref: 'Wage' },
        price: Number,
        repairVote: { type: Schema.Types.ObjectId, ref: 'RepairVote'}
    });

    // Create Repair Vote Detail Model
    const RepairVoteDetail = mongoose.model('RepairVoteDetail', RepairVoteDetailSchema);

    return RepairVoteDetail;
}