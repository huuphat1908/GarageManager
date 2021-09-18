exports.initSale = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Customer Schema
    const SaleSchema = new Schema({
        reportDate: { type: Date, default: Date.now },
        totalSale: { type: Number },
        saleDetails: [{ type: Schema.Types.ObjectId, ref: 'SaleDetail' }]
    });

    // Create Customer Model
    const Sale = mongoose.model('Sale', SaleSchema);

    return Sale;
}