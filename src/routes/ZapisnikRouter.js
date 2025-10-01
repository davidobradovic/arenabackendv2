const express = require("express")
const router = express.Router();

const Zapisnik = require("../models/ZapisnikSchema")
const { v4: uuidv4 } = require('uuid');
const { server, io } = require('../socket/socket');

const cloudinary = require('cloudinary').v2
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dxo3z5off',
    api_key: '928131617372864',
    api_secret: '_IsnFVhqA43Bcpy2SKl7x8t60Bk'
});

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

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
	    gotoviRadovi: req.body.gotoviRadovi,
	    createdBy: req.body.createdBy
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

router.post('/postavi-slike/:zapisnikId', upload.array('images'), async (req, res) => {
    try {
        const zapisnikId = req.params.zapisnikId;
        const zapisnik = await Zapisnik.findById(zapisnikId);

        if (!zapisnik) {
            return res.status(404).json({ error: 'Zapisnik not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const uploadedImages = await Promise.all(req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                width: 800,
                height: 600,
                public_id: `${uuidv4()}_prijem`,
            });
            return result.url;
        }));

        zapisnik.images = zapisnik.images.concat(uploadedImages);
        await zapisnik.save();

        res.status(200).json({ message: 'Images uploaded successfully', images: uploadedImages });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/uredi-prijem/:prijemId', async (req, res) => {
    try {
        const { 
	vozilo,
sasija,
kilometraza,
zapremina,
snaga,
mjenjac,
boja,
godiste,
gorivo,
dobavljac,
regOznake,
dosleUzVozilo,
vlasnickaKnjizica,
saobracajnaDozvola,
registrovan,
polisaOsiguranja,
registrovanDo,
brojKljuceva,
triOvjerenaOtkupnaUgovora,
fakturaSaFiskalnimRacunom,
odlukaOprodaji,
brendGume,
dimenzijeGume,
dot,
tockoviZona,
drugeGume,
brendDrugeGume,
dimenzijeDrugeGume,
dotDrugeGume,
tockoviZonaDrugeGume,
prostiraci,
servisnaKnjizica,
velikiServis,
velikiServisKm,
maliServis,
maliServisKm,
rezervniTocak,
dizalicaPlusKljuc,
prvaPomoc,
kuka,
lopovSarafi,
lopovNastavak,
policaUgepeku,
alarmVrstaAlarmaLokacija,
potpisStranke,
potrebniRadovi,
gotoviRadovi,
createdBy
	} = req.body;
        const { prijemId } = req.params;

	console.log(req.params);
	console.log(req.body);

	const zapisnik = await Zapisnik.findById(prijemId);

        if (!zapisnik) {
            return res.status(404).json({ error: 'Prijem not found' });
        }

        // Update task fields
zapisnik.vozilo = vozilo,
zapisnik.sasija = sasija,
zapisnik.kilometraza = kilometraza,
zapisnik.zapremina = zapremina,
zapisnik.snaga = snaga,
zapisnik.mjenjac = mjenjac,
zapisnik.boja = boja,
zapisnik.godiste = godiste,
zapisnik.gorivo = gorivo,
zapisnik.dobavljac = dobavljac,
zapisnik.regOznake = regOznake,
zapisnik.dosleUzVozilo = dosleUzVozilo,
zapisnik.vlasnickaKnjizica = vlasnickaKnjizica,
zapisnik.saobracajnaDozvola = saobracajnaDozvola,
zapisnik.registrovan = registrovan,
zapisnik.polisaOsiguranja = polisaOsiguranja,
zapisnik.registrovanDo = registrovanDo,
zapisnik.brojKljuceva = brojKljuceva,
zapisnik.triOvjerenaOtkupnaUgovora = triOvjerenaOtkupnaUgovora,
zapisnik.fakturaSaFiskalnimRacunom = fakturaSaFiskalnimRacunom,
zapisnik.odlukaOprodaji = odlukaOprodaji,
zapisnik.brendGume = brendGume,
zapisnik.dimenzijeGume = dimenzijeGume,
zapisnik.dot = dot,
zapisnik.tockoviZona = tockoviZona,
zapisnik.drugeGume = drugeGume,
zapisnik.brendDrugeGume = brendDrugeGume,
zapisnik.dimenzijeDrugeGume = dimenzijeDrugeGume,
zapisnik.dotDrugeGume = dotDrugeGume,
zapisnik.tockoviZonaDrugeGume = tockoviZonaDrugeGume,
zapisnik.prostiraci = prostiraci,
zapisnik.servisnaKnjizica = servisnaKnjizica,
zapisnik.velikiServis = velikiServis,
zapisnik.velikiServisKm = velikiServisKm,
zapisnik.maliServis = maliServis,
zapisnik.maliServisKm = maliServisKm,
zapisnik.rezervniTocak = rezervniTocak,
zapisnik.dizalicaPlusKljuc = dizalicaPlusKljuc,
zapisnik.prvaPomoc = prvaPomoc,
zapisnik.kuka = kuka,
zapisnik.lopovSarafi = lopovSarafi,
zapisnik.lopovNastavak = lopovNastavak,
zapisnik.policaUgepeku = policaUgepeku,
zapisnik.alarmVrstaAlarmaLokacija = alarmVrstaAlarmaLokacija,
zapisnik.potpisStranke = potpisStranke,
zapisnik.potrebniRadovi = potrebniRadovi,
            zapisnik.gotoviRadovi = gotoviRadovi,
            zapisnik.createdBy = createdBy

        io.emit('arzuriranZapisnik', `${zapisnik.vozilo} je promjenjen`);

        await zapisnik.save();

        res.status(200).json(zapisnik);

    } catch (error) {
        console.error('Error editing task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


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
