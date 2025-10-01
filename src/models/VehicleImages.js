const mongoose = require("mongoose");

const vehicleImageScheme = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("VehcileImage", vehicleImageScheme);
