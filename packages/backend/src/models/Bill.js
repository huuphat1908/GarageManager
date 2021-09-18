exports.initBill = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Bill Schema
    const BillSchema = new Schema({
        car: { type: Schema.Types.ObjectId, ref: 'Car' },
        collectionDate: { type: Date, default: Date.now },
        amount: Number
    })

    // Create Bill Model
    const Bill = mongoose.model('Bill', BillSchema);

    return Bill;
}