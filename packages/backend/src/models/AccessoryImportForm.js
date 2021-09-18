exports.initAccessoryImportForm = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Accessory Schema
    const AccessoryImportFormSchema = new Schema({
        amount: Number,
        date: { type: Date, default: Date.now},
        accessoryId: { type: Schema.Types.ObjectId, ref: 'Accessory'}
    })

    // Create Accessory Model
    const AccessoryImportForm = mongoose.model('AccessoryImportForm', AccessoryImportFormSchema);

    return AccessoryImportForm;
}