const mongoose = require("mongoose");

const vehicleScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: false
    },
    vin: {
        type: String,
        required: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehcileImage',
        required: false,
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        required: false
    }],
    procesi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VoziloSaProcesima',
        required: false
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Vehicle", vehicleScheme);
