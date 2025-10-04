const express = require("express")
const router = express.Router();

const Procjena = require("../models/ProcjenaSchema")
const { server, io } = require('../socket/socket');

const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const ProcjenaImages = require("../models/ProcjenaImages");

const cloudinary = require('cloudinary').v2

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


router.get('/sve-procjene', async (req, res) => {
    try {
        // Pagination params
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.per_page) || 10;

        // Total broj izvještaja
        const total = await Procjena.countDocuments();

        // Fetch sa paginacijom
        const result = await Procjena.find()
            .skip((page - 1) * perPage)
            .sort({ createdAt: -1 })
            .limit(perPage)
            .sort({ createdAt: -1 }) // najnoviji prvi (ako postoji createdAt polje)
            .lean();

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Nema izvještaja' });
        }

        res.status(200).json({
            data: result,
            meta: {
                total,
                page,
                per_page: perPage,
                last_page: Math.ceil(total / perPage)
            }
        });

    } catch (e) {
        console.error("Greška pri izvlacenju podataka:", e);
        return res.status(500).json({ error: 'Greška pri izvlacenju podataka' });
    }
});

router.get('/procjena/:procjenaId', async (req, res) => {
    const { procjenaId } = req.params
    try {
        const result = await Procjena.findById(procjenaId).populate('images');
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.post(
    "/procjene/postavi-procjenu",
    upload.array("images", 10), // prima max 10 fajlova pod imenom "images"
    async (req, res) => {
        try {
            const procjena = await Procjena.create(req.body);

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

            procjena.images = procjena.images.concat(uploadedImages);

            await procjena.save();

            res.status(200).json(procjena);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Greška prilikom postavljanja procjene" });
        }
    }
);

router.put('/edit-procjena/:procjenaId', async (req, res) => {
    try {
        const {
            zamjenaZaVozilo,
            vozilo,
            godiste,
            sasija,
            kilometraza,
            realnoStanjeKM,
            brojKljuceva,
            registrovanDo,
            odgovornaOsoba,
            uVlasnistvu,
            kupljen,
            zadnjaZabKM,
            desnaStranicaLakirano,
            desnaStranicaUlaganje,
            desnaStranaStokLakirano,
            desnaStranaStokUlaganje,
            desnaStranaZadnjaVrataLakirano,
            desnaStranaZadnjaVrataUlaganje,
            desnaStranaPrednjaVrataLakirano,
            desnaStranaPrednjaVrataUlaganje,
            desnaStranaDesniBlatobranLakirano,
            desnaStranaDesniBlatobranUlaganje,
            lijevaStranicaLakirano,
            lijevaStranicaUlaganje,
            lijevaStranaStokLakirano,
            lijevaStranaStokUlaganje,
            lijevaStranaZadnjaVrataLakirano,
            lijevaStranaZadnjaVrataUlaganje,
            lijevaStranaPrednjaVrataLakirano,
            lijevaStranaPrednjaVrataUlaganje,
            lijevaStranaLijeviBlatobranLakirano,
            lijevaStranaLijeviBlatobranUlaganje,
            lijevaStranaPragUlaganje,
            lijevaStranaPragLakirano,
            desnaStranaPragLakirano,
            desnaStranaPragUlaganje,
            prenjiBranikLakirano,
            prenjiBranikUlaganje,
            haubaLakirano,
            haubaUlaganje,
            gepekLakirano,
            gepekUlaganje,
            zadnjiBranikLakirano,
            zadnjiBranikUlaganje,
            krovLakirano,
            krovUlaganje,
            pdrUdubljena,
            ccaPrice,
            alarm,
            servisnaKnjiga,
            servisnaKnjigaContent,
            drugiSetTockova,
            drugiSetTockovaContent,
            motor,
            motorContent,
            mjenjac,
            mjenjacContent,
            kvacilo,
            kvaciloContent,
            ovijes,
            ovijesContent,
            kocnice,
            kocnicePart,
            kocniceContent,
            limarija,
            limarijaContent,
            lakiranje,
            lakiranjeContent,
            poliranje,
            poliranjeContent,
            dubinsko,
            dubinskoContent,
            presvlacenje,
            presvlacenjeContent,
            felgeIgume,
            felgeIgumeContent,
            ostalaUlaganja,
            ostalaUlaganjaContent,
            ukupnoUlaganja,
            imeIprezime,
            brojTelefona,
            izvrsenaOnlineProvjera,
            cijenaVlasnika,
            trzisnaCijena,
            otkupnaCijena,
            prodajnaCijena,
            procjenaCijena,
            createdAt,
            images
        } = req.body;
        const { procjenaId } = req.params;

        console.log(req.body)

        const procjena = await Procjena.findById(procjenaId);

        if (!procjena) {
            return res.status(404).json({ error: 'Zadatak not found' });
        }

        procjena.zamjenaZaVozilo = zamjenaZaVozilo,
            procjena.vozilo = vozilo,
            procjena.godiste = godiste,
            procjena.sasija = sasija,
            procjena.odgovornaOsoba = odgovornaOsoba,
            procjena.kilometraza = kilometraza,
            procjena.realnoStanjeKM = realnoStanjeKM,
            procjena.brojKljuceva = brojKljuceva,
            procjena.registrovanDo = registrovanDo,
            procjena.uVlasnistvu = uVlasnistvu,
            procjena.kupljen = kupljen,
            procjena.zadnjaZabKM = zadnjaZabKM,
            procjena.desnaStranicaLakirano = desnaStranicaLakirano,
            procjena.desnaStranicaUlaganje = desnaStranicaUlaganje,
            procjena.desnaStranaStokLakirano = desnaStranaStokLakirano,
            procjena.desnaStranaStokUlaganje = desnaStranaStokUlaganje,
            procjena.desnaStranaZadnjaVrataLakirano = desnaStranaZadnjaVrataLakirano,
            procjena.desnaStranaZadnjaVrataUlaganje = desnaStranaZadnjaVrataUlaganje,
            procjena.desnaStranaPrednjaVrataLakirano = desnaStranaPrednjaVrataLakirano,
            procjena.desnaStranaPrednjaVrataUlaganje = desnaStranaPrednjaVrataUlaganje,
            procjena.desnaStranaDesniBlatobranLakirano = desnaStranaDesniBlatobranLakirano,
            procjena.desnaStranaDesniBlatobranUlaganje = desnaStranaDesniBlatobranUlaganje,
            procjena.lijevaStranicaLakirano = lijevaStranicaLakirano,
            procjena.lijevaStranicaUlaganje = lijevaStranicaUlaganje,
            procjena.lijevaStranaStokLakirano = lijevaStranaStokLakirano,
            procjena.lijevaStranaStokUlaganje = lijevaStranaStokUlaganje,
            procjena.lijevaStranaZadnjaVrataLakirano = lijevaStranaZadnjaVrataLakirano,
            procjena.lijevaStranaZadnjaVrataUlaganje = lijevaStranaZadnjaVrataUlaganje,
            procjena.lijevaStranaPrednjaVrataLakirano = lijevaStranaPrednjaVrataLakirano,
            procjena.lijevaStranaPrednjaVrataUlaganje = lijevaStranaPrednjaVrataUlaganje,
            procjena.lijevaStranaLijeviBlatobranLakirano = lijevaStranaLijeviBlatobranLakirano,
            procjena.lijevaStranaLijeviBlatobranUlaganje = lijevaStranaLijeviBlatobranUlaganje,
            procjena.lijevaStranaPragUlaganje = lijevaStranaPragUlaganje,
            procjena.lijevaStranaPragLakirano = lijevaStranaPragLakirano,
            procjena.desnaStranaPragLakirano = desnaStranaPragLakirano,
            procjena.desnaStranaPragUlaganje = desnaStranaPragUlaganje,
            procjena.prenjiBranikLakirano = prenjiBranikLakirano,
            procjena.prenjiBranikUlaganje = prenjiBranikUlaganje,
            procjena.haubaLakirano = haubaLakirano,
            procjena.haubaUlaganje = haubaUlaganje,
            procjena.gepekLakirano = gepekLakirano,
            procjena.gepekUlaganje = gepekUlaganje,
            procjena.zadnjiBranikLakirano = zadnjiBranikLakirano,
            procjena.zadnjiBranikUlaganje = zadnjiBranikUlaganje,
            procjena.krovLakirano = krovLakirano,
            procjena.krovUlaganje = krovUlaganje,
            procjena.pdrUdubljena = pdrUdubljena,
            procjena.ccaPrice = ccaPrice,
            procjena.alarm = alarm,
            procjena.servisnaKnjiga = servisnaKnjiga,
            procjena.servisnaKnjigaContent = servisnaKnjigaContent,
            procjena.drugiSetTockova = drugiSetTockova,
            procjena.drugiSetTockovaContent = drugiSetTockovaContent,
            procjena.motor = motor,
            procjena.motorContent = motorContent,
            procjena.mjenjac = mjenjac,
            procjena.mjenjacContent = mjenjacContent,
            procjena.kvacilo = kvacilo,
            procjena.kvaciloContent = kvaciloContent,
            procjena.ovijes = ovijes,
            procjena.ovijesContent = ovijesContent,
            procjena.kocnice = kocnice,
            procjena.kocnicePart = kocnicePart,
            procjena.kocniceContent = kocniceContent,
            procjena.limarija = limarija,
            procjena.limarijaContent = limarijaContent,
            procjena.lakiranje = lakiranje,
            procjena.lakiranjeContent = lakiranjeContent,
            procjena.poliranje = poliranje,
            procjena.poliranjeContent = poliranjeContent,
            procjena.dubinsko = dubinsko,
            procjena.dubinskoContent = dubinskoContent,
            procjena.presvlacenje = presvlacenje,
            procjena.presvlacenjeContent = presvlacenjeContent,
            procjena.felgeIgume = felgeIgume,
            procjena.felgeIgumeContent = felgeIgumeContent,
            procjena.ostalaUlaganja = ostalaUlaganja,
            procjena.ostalaUlaganjaContent = ostalaUlaganjaContent,
            procjena.ukupnoUlaganja = ukupnoUlaganja,
            procjena.imeIprezime = imeIprezime,
            procjena.brojTelefona = brojTelefona,
            procjena.izvrsenaOnlineProvjera = izvrsenaOnlineProvjera,
            procjena.cijenaVlasnika = cijenaVlasnika,
            procjena.trzisnaCijena = trzisnaCijena,
            procjena.otkupnaCijena = otkupnaCijena,
            procjena.prodajnaCijena = prodajnaCijena,
            procjena.procjenaCijena = procjenaCijena,
            procjena.createdAt = createdAt,
            procjena.images = images

        await procjena.save();

        res.status(200).json(procjena);

    } catch (error) {
        console.error('Error editing task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/postavi-slike/:procjenaId', upload.array('images'), async (req, res) => {
    try {
        const procjenaId = req.params.procjenaId;
        const procjena = await Procjena.findById(procjenaId);

        if (!procjena) {
            return res.status(404).json({ error: 'Procjena not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        // Respond immediately
        res.status(200).json({ message: 'Slike se postavljaju' });

        // Asynchronous processing of uploads
        (async () => {
            try {
                const uploadPromises = req.files.map(file =>
                    cloudinary.uploader.upload(file.path, {
                        public_id: `${uuidv4()}_procjena`,
                        width: 600,
                        height: 490,
                        crop: "scale"
                    })
                );

                const uploadedImages = await Promise.all(uploadPromises);
                const imageUrls = uploadedImages.map(result => result.url);

                procjena.images = procjena.images.concat(imageUrls);
                await procjena.save();

                console.log('All files uploaded successfully:', imageUrls);
            } catch (error) {
                console.error('Error uploading files:', error);
                // Optionally handle the error, e.g., log it, retry, etc.
            }
        })();

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/obrisi-procjenu/:procjenaId', async (req, res) => {
    try {

        const { procjenaId } = req.params;

        const procjena = await Procjena.deleteOne({
            _id: procjenaId
        })

        if (!procjena) {
            return res.status(404).json({ error: 'Procjena not found' });
        }

        res.status(201).json(procjena);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



module.exports = router