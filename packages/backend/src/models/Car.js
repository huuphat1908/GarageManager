exports.initCar = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Car Schema
    const CarSchema = new Schema({
        licensePlate: {type: String, unique: true, index: true},
        debt: {type: Number, default: 0},
        carBrand: { type: Schema.Types.ObjectId, ref: 'CarBrand' },
        carOwner: { type: Schema.Types.ObjectId, ref: 'Customer' },
        status: { type: Boolean, default: true} // true is in garage, false is not in garage
    })

    // Create Car Model
    const Car = mongoose.model('Car', CarSchema);

    return Car;
}