const mongoose = require("mongoose")

const zapisnikSchema = new mongoose.Schema({
    vozilo: {
        type: String,
        required: false
    },
    sasija: {
        type: String,
        required: false
    },
    kilometraza: {
        type: Number,
        required: false
    },
    zapremina: {
        type: String,
        required: false
    },
    snaga: {
        type: Number,
        required: false
    },
    mjenjac: {
        type: String,
        required: false
    },
    boja: {
        type: String,
        required: false
    },
    godiste: {
        type: Number,
        required: false
    },
    gorivo: {
        type: String,
        required: false
    },
    dobavljac: {
        type: String,
        required: false
    },
    regOznake: {
        type: String,
        required: false
    },
    dosleUzVozilo: {
        type: Boolean, 
        default: false, 
        required: false
    },
    vlasnickaKnjizica: {
        type: Boolean, 
        default: false, 
        required: false
    },
    saobracajnaDozvola: {
        type: Boolean, 
        default: false, 
        required: false
    },
    registrovan: {
        type: Boolean, 
        default: false, 
        required: false
    },
    polisaOsiguranja: {
        type: Boolean, 
        default: false, 
        required: false
    },
    registrovanDo: {
        type: String,
        required: false
    },
    brojKljuceva: {
        type: String,
        required: false
    },
    triOvjerenaOtkupnaUgovora: {
        type: Boolean, 
        default: false, 
        required: false
    },
    fakturaSaFiskalnimRacunom: {
        type: Boolean, 
        default: false, 
        required: false
    },
    odlukaOprodaji: {
        type: Boolean, 
        default: false, 
        required: false
    },
    brendGume: {
        type: String,
        required: false
    },
    dimenzijeGume: {
        type: String,
        required: false
    },
    dot: {
        type: Number,
        required: false
    },
    tockoviZona: {
        type: String,
        required: false
    },
    drugeGume: {
        type: Boolean, 
        default: false, 
        required: false
    },
    brendDrugeGume: {
        type: String,
        required: false,
        required: false
    },
    dimenzijeDrugeGume: {
        type: String,
        required: false,
        required: false
    },
    dotDrugeGume: {
        type: Number,
        required: false,
        required: false
    },
    tockoviZonaDrugeGume: {
        type: String,
        required: false
    },
    prostiraci: {
        type: String,
        required: false
    },
    servisnaKnjizica: {
        type: Boolean, 
        default: false, 
        required: false
    },
    velikiServis: {
        type: Boolean, 
        default: false, 
        required: false
    },
    velikiServisKm: {
        type: Number,
        required: false
    },
    maliServis: {
        type: Boolean, 
        default: false, 
        required: false
    },
    maliServisKm: {
        type: Number,
        required: false
    },
    rezervniTocak: {
        type: Boolean, 
        default: false, 
        required: false
    },
    dizalicaPlusKljuc: {
        type: Boolean, 
        default: false, 
        required: false
    },
    prvaPomoc: {
        type: Boolean, 
        default: false, 
        required: false
    },
    kuka: {
        type: Boolean, 
        default: false, 
        required: false
    },
    lopovSarafi: {
        type: Boolean, 
        default: false, 
        required: false
    },
    lopovNastavak: {
        type: Boolean, 
        default: false, 
        required: false
    },
    policaUgepeku: {
        type: Boolean, 
        default: false, 
        required: false
    },
    alarmVrstaAlarmaLokacija: {
        type: String,
        required: false
    },
    potpisStranke: {
        type: Number,
        required: false
    },
    potrebniRadovi: [
        String
    ],
    statusZapisnik: {
        type: Boolean,
        default: false,
        required: false
    },
    images: [{ type: String, required: false }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    gotoviRadovi: [
   	String 
   ],
   createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnici'
   },
   
})

module.exports = mongoose.model("ZapisnikPrimopredaja", zapisnikSchema)
