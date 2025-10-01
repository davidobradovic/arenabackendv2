const mongoose = require("mongoose");

const evidencijaBudget = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("EvidencijaBudget", evidencijaBudget);
