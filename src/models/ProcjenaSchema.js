const mongoose = require("mongoose")

const procjenaSchema = new mongoose.Schema({
    zamjenaZaVozilo: {
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
    sasija: {
        type: String,
        required: false,
    },
    odgovornaOsoba: {
        type: String,
        required: false,
    },
    kilometraza: {
        type: String,
        required: false,
    },
    realnoStanjeKM: {
        type: Boolean,
        default: false,
    },
    brojKljuceva: {
        type: String,
        required: false,
    },
    registrovanDo: {
        type: String,
        required: false,
    },
    uVlasnistvu: {
        type: String,
        required: false,
    },
    kupljen: {
        type: String,
        required: false,
    },
    zadnjaZabKM: {
        type: String,
        required: false,
    },
    desnaStranicaLakirano: {
        type: Boolean,
        default: false,
    },
    desnaStranicaUlaganje: {
        type: Boolean,
        default: false,
    },
    desnaStranaStokLakirano: {
        type: Boolean,
        default: false,
    },
    desnaStranaStokUlaganje: {
        type: Boolean,
        default: false,
    },
    desnaStranaZadnjaVrataLakirano: {
        type: Boolean,
        default: false,
    },
    desnaStranaZadnjaVrataUlaganje: {
        type: Boolean,
        default: false,
    },
    desnaStranaPrednjaVrataLakirano: {
        type: Boolean,
        default: false,
    },
    desnaStranaPrednjaVrataUlaganje: {
        type: Boolean,
        default: false,
    },
    desnaStranaDesniBlatobranLakirano: {
        type: Boolean,
        default: false,
    },
    desnaStranaDesniBlatobranUlaganje: {
        type: Boolean,
        default: false,
    },
    lijevaStranicaLakirano: {
        type: Boolean,
        default: false,
    },
    lijevaStranicaUlaganje: {
        type: Boolean,
        default: false,
    },
    lijevaStranaStokLakirano: {
        type: Boolean,
        default: false,
    },
    lijevaStranaStokUlaganje: {
        type: Boolean,
        default: false,
    },
    lijevaStranaZadnjaVrataLakirano: {
        type: Boolean,
        default: false,
    },
    lijevaStranaZadnjaVrataUlaganje: {
        type: Boolean,
        default: false,
    },
    lijevaStranaPrednjaVrataLakirano: {
        type: Boolean,
        default: false,
    },
    lijevaStranaPrednjaVrataUlaganje: {
        type: Boolean,
        default: false,
    },
    lijevaStranaLijeviBlatobranLakirano: {
        type: Boolean,
        default: false,
    },
    lijevaStranaLijeviBlatobranUlaganje: {
        type: Boolean,
        default: false,
    },
    lijevaStranaPragUlaganje: {
        type: Boolean,
        default: false,
    },
    lijevaStranaPragLakirano: {
        type: Boolean,
        default: false,
    },
    desnaStranaPragLakirano: {
        type: Boolean,
        default: false,
    },
    desnaStranaPragUlaganje: {
        type: Boolean,
        default: false,
    },
    prenjiBranikLakirano: {
        type: Boolean,
        default: false,
    },
    prenjiBranikUlaganje: {
        type: Boolean,
        default: false,
    },
    haubaLakirano: {
        type: Boolean,
        default: false,
    },
    haubaUlaganje: {
        type: Boolean,
        default: false,
    },
    gepekLakirano: {
        type: Boolean,
        default: false,
    },
    gepekUlaganje: {
        type: Boolean,
        default: false,
    },
    zadnjiBranikLakirano: {
        type: Boolean,
        default: false,
    },
    zadnjiBranikUlaganje: {
        type: Boolean,
        default: false,
    },
    krovLakirano: {
        type: Boolean,
        default: false,
    },
    krovUlaganje: {
        type: Boolean,
        default: false,
    },
    pdrUdubljena: {
        type: Boolean,
        default: false,
    },
    ccaPrice: {
        type: String,
        required: false,
    },
    alarm: {
        type: String,
        required: false,
    },
    servisnaKnjiga: {
        type: Boolean,
        default: false,
    },
    servisnaKnjigaContent: {
        type: String,
        required: false,
    },
    drugiSetTockova: {
        type: Boolean,
        default: false,
    },
    drugiSetTockovaContent: {
        type: String,
        required: false,
    },
    motor: {
        type: String,
        required: false,
    },
    motorContent: {
        type: String,
        required: false,
    },
    mjenjac: {
        type: String,
        required: false,
    },
    mjenjacContent: {
        type: String,
        required: false,
    },
    kvacilo: {
        type: String,
        required: false,
    },
    kvaciloContent: {
        type: String,
        required: false,
    },
    ovijes: {
        type: String,
        required: false,
    },
    ovijesContent: {
        type: String,
        required: false,
    },
    kocnice: {
        type: String,
        required: false,
    },
    kocnicePart: {
        type: String,
        required: false,
    },
    kocniceContent: {
        type: String,
        required: false,
    },
    limarija: {
        type: String,
        required: false,
    },
    limarijaContent: {
        type: String,
        required: false,
    },
    lakiranje: {
        type: String,
        required: false,
    },
    lakiranjeContent: {
        type: String,
        required: false,
    },
    poliranje: {
        type: String,
        required: false,
    },
    poliranjeContent: {
        type: String,
        required: false,
    },
    dubinsko: {
        type: String,
        required: false,
    },
    dubinskoContent: {
        type: String,
        required: false,
    },
    presvlacenje: {
        type: String,
        required: false,
    },
    presvlacenjeContent: {
        type: String,
        required: false,
    },
    felgeIgume: {
        type: String,
        required: false,
    },
    felgeIgumeContent: {
        type: String,
        required: false,
    },
    ostalaUlaganja: {
        type: String,
        required: false,
    },
    ostalaUlaganjaContent: {
        type: String,
        required: false,
    },
    ukupnoUlaganja: {
        type: String,
        required: false,
    },
    imeIprezime: {
        type: String,
        required: false,
    },
    brojTelefona: {
        type: String,
        required: false,
    },
    izvrsenaOnlineProvjera: {
        type: Boolean,
        default: false,
    },
    cijenaVlasnika: {
        type: String,
        required: false,
    },
    trzisnaCijena: {
        type: String,
        required: false,
    },
    otkupnaCijena: {
        type: String,
        required: false,
    },
    prodajnaCijena: {
        type: String,
        required: false,
    },
    procjenaCijena: {
        type: String,
        required: false,
    },
    images: [{ type: String, required: false }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: false,
    },
})

module.exports = mongoose.model("ProcjenaVozla", procjenaSchema)