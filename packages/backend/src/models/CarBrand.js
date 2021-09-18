exports.initCarBrand = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Car Brand Schema
    const CarBrandSchema = new Schema({
        name: String
    })

    // Create Car Brand Model
    const CarBrand = mongoose.model('CarBrand', CarBrandSchema);

    return CarBrand;
}