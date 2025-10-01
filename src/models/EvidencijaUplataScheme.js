const mongoose = require('mongoose');

const evidencijaUplataScheme = new mongoose.Schema({
    redniBroj: {
        type: String,
        required: true
    },
    datum: {
        type: String,
        required: false
    },
    nazivKupca: {
        type: String,
        required: false
    },
    brojRacuna: {
        type: String,
        required: false
    },
    vozilo: {
        type: String,
        required: false
    },
    iznisRacuna: {
        type: String,
        required: false
    },
    virman: {
        type: String,
        required: false
    },
    kes: {
        type: String,
        required: false
    },
    ukupno: {
        type: String,
        required: false
    },
    napomena: {
        type: String,
        required: false
    },
});

const EvidencijaUplata = mongoose.model('EvidencijaUplata', evidencijaUplataScheme);

module.exports = EvidencijaUplata;
