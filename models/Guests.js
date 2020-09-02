const mongoose = require('mongoose');

const GuestsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allergies: {
        type: String
    },
    attending: {
        type: Boolean,
        required: true
    }
});

module.exports = Guests = mongoose.model('guests', GuestsSchema);