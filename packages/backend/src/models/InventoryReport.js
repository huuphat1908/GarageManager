exports.initInventoryReport = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Repair Vote Schema
    const InventoryReportSchema = new Schema({
        reportDate: { type: Date, default: Date.now},
        reportDetails: [{ type: Schema.Types.ObjectId, ref: 'InventoryReportDetail' }] 
    });

    // Create Repair Vote Model
    const InventoryReport = mongoose.model('InventoryReport', InventoryReportSchema);

    return InventoryReport;
}