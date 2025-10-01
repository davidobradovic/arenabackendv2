const mongoose = require("mongoose");

const dnevnaEvidencijaScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("DnevnaEvidencija", dnevnaEvidencijaScheme);
