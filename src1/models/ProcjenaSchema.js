const mongoose = require("mongoose")

const procjenaSchema = new mongoose.Schema({
    zamjenaZaVozilo: {
        type: String
    },
    vozilo: {
        type: String
    },
    godiste: {
        type: Number
    },
    sasija: {
        type: String
    },
    kilometraza: {
        type: Number
    },
    realnoStanjeKM: {
        type: Boolean,
        default: false
    },
    brojKljuceva: {
        type: Number
    },
    registrovanDo: {
        type: String
    },
    desnaStranicaLakirano: {
        type: Boolean,
        default: false
    },
    desnaStranicaUlaganje: {
        type: Boolean,
        default: false
    },
    desnaStranaStokLakirano: {
        type: Boolean,
        default: false
    },
    desnaStranaStokUlaganje: {
        type: Boolean,
        default: false
    },
    desnaStranaZadnjaVrataLakirano: {
        type: Boolean,
        default: false
    },
    desnaStranaZadnjaVrataUlaganje: {
        type: Boolean,
        default: false
    },
    desnaStranaPrednjaVrataLakirano: {
        type: Boolean,
        default: false
    },
    desnaStranaPrednjaVrataUlaganje: {
        type: Boolean,
        default: false
    },
    desnaStranaDesniBlatobranLakirano: {
        type: Boolean,
        default: false
    },
    desnaStranaDesniBlatobranUlaganje: {
        type: Boolean,
        default: false
    },
    lijevaStranicaLakirano: {
        type: Boolean,
        default: false
    },
    lijevaStranicaUlaganje: {
        type: Boolean,
        default: false
    },
    lijevaStranaStokLakirano: {
        type: Boolean,
        default: false
    },
    lijevaStranaStokUlaganje: {
        type: Boolean,
        default: false
    },
    lijevaStranaZadnjaVrataLakirano: {
        type: Boolean,
        default: false
    },
    lijevaStranaZadnjaVrataUlaganje: {
        type: Boolean,
        default: false
    },
    lijevaStranaPrednjaVrataLakirano: {
        type: Boolean,
        default: false
    },
    lijevaStranaPrednjaVrataUlaganje: {
        type: Boolean,
        default: false
    },
    lijevaStranaLijeviBlatobranLakirano: {
        type: Boolean,
        default: false
    },
    lijevaStranaLijeviBlatobranUlaganje: {
        type: Boolean,
        default: false
    },
    prenjiBranikLakirano: {
        type: Boolean,
        default: false
    },
    prenjiBranikUlaganje: {
        type: Boolean,
        default: false
    },
    haubaLakirano: {
        type: Boolean,
        default: false
    },
    haubaUlaganje: {
        type: Boolean,
        default: false
    },
    gepekLakirano: {
        type: Boolean,
        default: false
    },
    gepekUlaganje: {
        type: Boolean,
        default: false
    },
    zadnjiBranikLakirano: {
        type: Boolean,
        default: false
    },
    zadnjiBranikUlaganje: {
        type: Boolean,
        default: false
    },
    krovLakirano: {
        type: Boolean,
        default: false
    },
    krovUlaganje: {
        type: Boolean,
        default: false
    },
    pdrUdubljena: {
        type: Boolean,
        default: false
    },
    ccaPrice: {
        type: Number
    },
    carVertical: {
        type: Boolean,
        default: false
    },
    alarm: {
        type: String,
        required: false
    },
    servisnaKnjiga: {
        type: Boolean,
        default: false,
        required: false
    },
    servisnaKnjigaContent: {
        type: String,
        required: false
    },
    drugiSetTockova: {
        type: Boolean,
        default: false,
        required: false
    },
    drugiSetTockovaContent: {
        type: String,
        required: false
    },
    motorImjenjacUlaganja: {
        type: Number,
        default: 0
    },
    trapUlaganja: {
        type: Number,
        default: 0
    },
    limarijaUlaganja: {
        type: Number,
        default: 0
    },
    lakiranjeUlaganja: {
        type: Number,
        default: 0
    },
    poliranjeUlaganja: {
        type: Number,
        default: 0
    },
    dubinskoUlaganja: {
        type: Number,
        default: 0
    },
    presvlacenjeUlaganja: {
        type: Number,
        default: 0
    },
    felgeIgumeUlaganja: {
        type: Number,
        default: 0
    },
    ostalaUlaganja: {
        type: Number,
        default: 0
    },
    ukupnoUlaganja: {
        type: Number,
        default: 0
    },
    isAllowed: {
        type: Boolean,
        default: false
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProcjenaImage',
        required: false
    }]
})

module.exports = mongoose.model("ProcjenaVozla", procjenaSchema)