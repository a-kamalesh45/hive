const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    issue: {type: String, required: true},
    askedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true},
    status: {type: String, enum: ['Unassigned', 'Assigned', 'Resolved', 'Dismantled'], default: 'Unassigned'},
    reply: {type: String, default: ''},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null},
}, {timestamps: true});

module.exports = mongoose.model('Query', QuerySchema);