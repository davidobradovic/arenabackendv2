const mongoose = require("mongoose");

const poliranjeScheme = new mongoose.Schema({
    vozilo: {
        type: String,
        required: true,
    },
    vrstaPoliranja: {
        type: String,
        required: false,
    },
    tackanje: {
        type: Boolean,
        default: false,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Poliranje", poliranjeScheme);
