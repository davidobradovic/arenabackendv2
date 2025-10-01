const express = require("express")
const router = express.Router();

const Zapisnik = require("../models/ZapisnikSchema")
const { server, io } = require('../socket/socket');

router.get('/svi-izvjestaji', async (req, res) => {
    try {
        const result = await Zapisnik.find();
        res.send(result)                
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})


router.get('/izvjestaj/:izvjestajId', async (req, res) => {
    const { izvjestajId } = req.params
    try {
        const result = await Zapisnik.findById(izvjestajId);
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.post('/postavi-izvjestaj', async (req, res) => {
    try {
        const result = new Zapisnik({
            vozilo: req.body.vozilo,
            sasija: req.body.sasija,
            kilometraza: req.body.kilometraza,
            zapremina: req.body.zapremina,
            snaga: req.body.snaga,
            mjenjac: req.body.mjenjac,
            boja: req.body.boja,
            godiste: req.body.godiste,
            gorivo: req.body.gorivo,
            dobavljac: req.body.dobavljac,
            regOznake: req.body.regOznake,
            dosleUzVozilo: req.body.dosleUzVozilo,
            vlasnickaKnjizica: req.body.vlasnickaKnjizica,
            saobracajnaDozvola: req.body.saobracajnaDozvola,
            registrovan: req.body.registrovan,
            polisaOsiguranja: req.body.polisaOsiguranja,
            registrovanDo: req.body.registrovanDo,
            brojKljuceva: req.body.brojKljuceva,
            triOvjerenaOtkupnaUgovora: req.body.triOvjerenaOtkupnaUgovora,
            fakturaSaFiskalnimRacunom: req.body.fakturaSaFiskalnimRacunom,
            odlukaOprodaji: req.body.odlukaOprodaji,
            brendGume: req.body.brendGume,
            dimenzijeGume: req.body.dimenzijeGume,
            dot: req.body.dot,
            tockoviZona: req.body.tockoviZona,
            drugeGume: req.body.drugeGume,
            brendDrugeGume: req.body.brendDrugeGume,
            dimenzijeDrugeGume: req.body.dimenzijeDrugeGume,
            dotDrugeGume: req.body.dotDrugeGume,
            tockoviZonaDrugeGume: req.body.tockoviZonaDrugeGume,
            prostiraci: req.body.prostiraci,
            servisnaKnjizica: req.body.servisnaKnjizica,
            velikiServis: req.body.velikiServis,
            velikiServisKm: req.body.velikiServisKm,
            maliServis: req.body.maliServis,
            maliServisKm: req.body.maliServisKm,
            rezervniTocak: req.body.rezervniTocak,
            dizalicaPlusKljuc: req.body.dizalicaPlusKljuc,
            prvaPomoc: req.body.prvaPomoc,
            kuka: req.body.kuka,
            lopovSarafi: req.body.lopovSarafi,
            lopovNastavak: req.body.lopovNastavak,
            policaUgepeku: req.body.policaUgepeku,
            alarmVrstaAlarmaLokacija: req.body.alarmVrstaAlarmaLokacija,
            potpisStranke: req.body.potpisStranke,
            potrebniRadovi: req.body.potrebniRadovi,
        })

        result.save()
            .then(result => {
                res.send(result)
                console.log('USPIJEH')
                io.emit('newNotification', { message: 'Novi izvjestaj je postavljen' });  // Emit the event here
            })
            .catch(e => res.json(e))
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.delete('/obrisi-izvjestaj/:izvjestajId', async (req, res) => {
    const { izvjestajId } = req.params
    try {
        const result = await Zapisnik.findByIdAndDelete(izvjestajId);
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.put('/izmjeni-izvjestaj/:izvjestajId', async (req, res) => {

    try {
        const { izvjestajId } = req.params
        const updates = req.body;

        const result = await Zapisnik.findByIdAndUpdate(izvjestajId, updates)

        result.save()
            .then(result => {
                res.send(result)
            })
            .catch(e => res.json(e))
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

module.exports = router