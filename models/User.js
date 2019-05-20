const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String
    },
    ok: {
        type: Number,
        default: 0
    },
    no: {
        type: Number,
        default: 0
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

mongoose.model('User', userSchema);