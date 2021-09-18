exports.initParameter = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Customer Schema
    const ParameterSchema = new Schema({
        numberOfCarBrand: { type: Number, default: 10 },
        maxNumberOfReceivedCarInDay: { type: Number, default: 30 },
        numberOfAccessory: { type: Number, default: 200 },
        numberOfKindOfWage: { type: Number, default: 100},
    });

    // Create Customer Model
    const Parameter = mongoose.model('Parameter', ParameterSchema);

    return Parameter;
}