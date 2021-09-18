exports.initAccount = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Account Schema
    const AccountSchema = new Schema({
        name: String,
        hashedPassword: String,
        role: { type: String, default: 'Staff' },
    });

    // Create Account Model
    const Account = mongoose.model('Account', AccountSchema);

    return Account;
}