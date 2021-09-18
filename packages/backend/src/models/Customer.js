exports.initCustomer = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Customer Schema
    const CustomerSchema = new Schema({
        name: String,
        phoneNumber: String,
        address: String,
        email: String
    });

    // Create Customer Model
    const Customer = mongoose.model('Customer', CustomerSchema);

    return Customer;
}