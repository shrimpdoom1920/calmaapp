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
    }
});

mongoose.model('User', userSchema);