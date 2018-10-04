const mongoose = require('mongoose');

const drillSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    tags: [
        {
            type: String
        }
    ],
    minParticipants: {type: Number, default: 1, required: true},
    maxParticipants: Number,
});

module.exports = mongoose.model('Drill', drillSchema);