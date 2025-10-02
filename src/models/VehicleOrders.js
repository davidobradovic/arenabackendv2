const mongoose = require("mongoose");

const vehicleOrderSchema = new mongoose.Schema({
    // Customer Information
    name: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },

    // Vehicle Details
    vehicleTitle: {
        type: String,
    },
    // Budget
    budget: {
        type: String,
    },

    // Mileage
    mileage: {
        type: String,
    },

    // Fuel Type, Transmission, KW/KS
    fuelType: {
        type: String,
    },

    transmission: {
        type: String, // e.g., "Dizel"
    },

    enginePower: {
        ccm: {
            type: Number,
        },
        kwks: {
            type: Number,
        },
    },

    // Gearbox and Drive Type
    gearbox: {
        type: String, // M/T, A/T, 2WD, AWD (4x4)
        enum: ['M/T', 'A/T', '2WD', 'AWD'],
    },

    // Colors
    vehicleColor: {
        type: String,
    },
    interiorColor: {
        type: String,
    },

    // Equipment (Oprema) - Array of objects with label, value, and status
    equipment: [{
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['obavezno', 'poželjno', 'nije bitno'],
            required: true,
        },
    }],

    notes: {
        type: String,
    },
    // Seller and Date
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnici'
    },

    status: {
        type: String,
        default: 'Novo',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("VehicleOrder", vehicleOrderSchema);