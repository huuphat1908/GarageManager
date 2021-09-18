exports.initSession = function(mongoose) {
    const Schema = mongoose.Schema;

    // Create Account Schema
    const SessionSchema = new Schema({
        sessionId: String,
        role: String,
        userId: String,
    });

    // Create Account Model
    const Session = mongoose.model('Session', SessionSchema);

    return Session;
}