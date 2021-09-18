exports.initSaleDetail = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Customer Schema
    const SaleDetailSchema = new Schema({
        carBrand: { type: Schema.Types.ObjectId, ref: 'CarBrand' },
        numberOfRepairs: { type: Number, default: 0 },
        ratio: { type: Number },
        totalSale: { type: Number, default: 0 },
        sale: { type: Schema.Types.ObjectId, ref: 'Sale' }
    });

    // Create Customer Model
    const SaleDetail = mongoose.model('SaleDetail', SaleDetailSchema);

    return SaleDetail;
}