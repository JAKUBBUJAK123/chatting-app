const mongose = require('mongoose');

const messageSchema = new mongose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    content : {
        type: String,
        required: true,
        trim: true
    },
    timestamp : {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

module.exports = mongose.model('Message', messageSchema);