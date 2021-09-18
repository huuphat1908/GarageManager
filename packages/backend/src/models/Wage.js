exports.initWage = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Wage Schema
    const WageSchema = new Schema({
        name: String,
        price: Number
    })

    // Create Wage Model
    const Wage = mongoose.model('Wage', WageSchema);

    return Wage;
}