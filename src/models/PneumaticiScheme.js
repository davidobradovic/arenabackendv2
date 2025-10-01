const mongoose = require('mongoose');

const pneumaticiSchema = new mongoose.Schema({
    lotBroj: {
        type: String,
        required: false
    },
    tip: {
        type: String,
        required: false
    },
    brojKomada: {
        type: String,
        required: false
    },
    brend: {
        type: String,
        required: false
    },
    vozilo: {
        type: String,
        required: false
    },
    velicina: {
        type: String,
        required: false
    },
    rasponSarafa: {
        type: String,
        required: false
    },
    etJotFelgi: {
        type: String,
        required: false
    },
    centralnaRupa: {
        type: String,
        required: false
    },
    markaTipGuma: {
        type: String,
        required: false
    },
    sezonaGuma: {
        type: String,
        required: false
    },
    dimenzija: {
        type: String,
        required: false
    },
    dot: {
        type: String,
        required: false
    },
    dubinaSare: {
        type: String,
        required: false
    },
    ekseri: {
        type: String,
        required: false
    },
    skladiste: {
        type: String,
        required: false
    },
    napomena: {
        type: String,
        required: false
    },
    dostupnost: {
        type: String,
        required: false
    },
});

const Pneumatici = mongoose.model('Pneumatici', pneumaticiSchema);

module.exports = Pneumatici;
