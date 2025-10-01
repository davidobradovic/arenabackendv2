const mongoose = require("mongoose");

const zalihaScheme = new mongoose.Schema({
    datum: {
        type: String,
        required: false,
    },
    idBroj: {
        type: String,
        required: false,
    },
    brojKljuceva: {
        type: String,
        required: false,
    },
    dostupnost: {
        type: String,
        required: false,
    },
    tablice: {
        type: String,
        required: false,
    },
    dosleUzVozilo: {
        type: String,
        required: false,
    },
    vozilo: {
        type: String,
        required: false,
    },
    godiste: {
        type: String,
        required: false,
    },
    vrstaMotora: {
        type: String,
        required: false,
    },
    snaga: {
        type: String,
        required: false,
    },
    kilometraza: {
        type: String,
        required: false,
    },
    mjenjac: {
        type: String,
        required: false,
    },
    brojSasije: {
        type: String,
        required: false,
    },
    boja: {
        type: String,
        required: false,
    },
    ogasenaCijenaVozila: {
        type: String,
        required: false,
    },
    olxLink: {
        type: String,
        required: false,
    },
    datumObjave: {
        type: String,
        required: false,
    },
    registrovanDo: {
        type: String,
        required: false,
    },
    zadnjiServisKmDatum: {
        type: String,
        required: false,
    },
    brojDanaOdKadaJeVoziloNaPlacu: {
        type: String,
        required: false,
    },
    velikiservis: {
        type: String,
        required: false,
    },
    servisnaistorija: {
        type: String,
        required: false,
    },
    gume: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Zaliha", zalihaScheme);
