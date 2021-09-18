exports.initRepairVote = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Repair Vote Schema
    const RepairVoteSchema = new Schema({
        receivingForm: { type: Schema.Types.ObjectId, ref: 'ReceivingForm' },
        details: [{ type: Schema.Types.ObjectId, ref: 'RepairVoteDetail' }],
        repairDate: { type: Date, default: Date.now },
        totalPrice: { type: Number, default: 0 }
    });

    // Create Repair Vote Model
    const RepairVote = mongoose.model('RepairVote', RepairVoteSchema);

    return RepairVote;
}