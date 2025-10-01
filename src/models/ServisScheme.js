const mongoose = require("mongoose");

const servisScheme = new mongoose.Schema({
    vozilo: {
        type: String,
        required: false
    },
    sasija: {
        type: String,
        required: false
    },
    velikiServis: {
        type: Boolean,
        default: false,
        required: false
    },
    velikiServisKm: {
        type: String,
        required: false
    },
    velikiServisDatum: {
        type: String,
        required: false
    },
    velikiServisIznos: {
        type: String,
        required: false
    },
    maliServis: {
        type: Boolean,
        default: false,
        required: false
    },
    maliServisKm: {
        type: String,
        required: false
    },
    maliServisDatum: {
        type: String,
        required: false
    },
    maliServisIznos: {
        type: String,
        required: false
    },
    motorContent: {
        type: String,
        required: false
    },
    motorPrice: {
        type: String,
        required: false
    },
    mjenjacContent: {
        type: String,
        required: false
    },
    mjenjacPrice: {
        type: String,
        required: false
    },
    kvaciloContent: {
        type: String,
        required: false
    },
    kvaciloPrice: {
        type: String,
        required: false
    },
    ovijesContent: {
        type: String,
        required: false
    },
    ovijesPrice: {
        type: String,
        required: false
    },
    kocniceContent: {
        type: String,
        required: false
    },
    kocniceSide: {
        type: String,
        required: false
    },
    kocnicePrice: {
        type: String,
        required: false
    },
    ostalaUlaganjaContent: {
        type: String,
        required: false
    },
    ostalaUlaganjaPrice: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Servis", servisScheme);
