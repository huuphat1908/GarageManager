exports.initInventoryReportDetail = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Repair Vote Detail Schema
    const InventoryReportDetailSchema = new Schema({
        inventoryReport: { type: Schema.Types.ObjectId, ref: 'InventoryReport' },
        accessory: { type: Schema.Types.ObjectId, ref: 'Accessory'},
        openingStock: { type: Number},
        endingStock: { type: Number },
        arising: { type: Number }
    });

    // Create Repair Vote Detail Model
    const InventoryReportDetail = mongoose.model('InventoryReportDetail', InventoryReportDetailSchema);

    return InventoryReportDetail;
}