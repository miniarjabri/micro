const mongoose = require('mongoose');

// schema for a user item for mongodb
const UserSchema = mongoose.Schema({
    username: String,
    googleId: String
});

module.exports = mongoose.model('User', UserSchema);