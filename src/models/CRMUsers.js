const mongoose = require("mongoose");

const crmUserScheme = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    workerName: {
        type: String,
        required: true,
    },
    visitDate: {
        type: String,
        required: true,
    },
    vehicle: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("CRMUser", crmUserScheme);
