const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    pin: {type: String},
    role: {type: String, enum: ['User', 'Admin', 'Head'], default: 'User'},
    queriesTaken: {type: Number, default: 0},
    queriesResolved: {type: Number, default: 0},
}, {timestamps: true});

module.exports = mongoose.model('Member', MemberSchema);