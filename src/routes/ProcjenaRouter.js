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
        const result = await Procjena.find().populate('images');
        res.send(result)
        io.emit('newNotification', { message: 'Novi izvjestaj je postavljen' });  // Emit the event here
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/procjena/:procjenaId', async (req, res) => {
    const { procjenaId } = req.params
    try {
        const result = await Procjena.findById(procjenaId).populate('images');
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.post('/postavi-procjenu', upload.array('images'), async (req, res) => {
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
        } = req.body
        const filesToUpdate = req.files || [];

        const procjena = new Procjena({
            zamjenaZaVozilo,
            vozilo,
            godiste,
            sasija,
            kilometraza,
            realnoStanjeKM,
            brojKljuceva,
            registrovanDo,
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
        });

        const images = await Promise.all(filesToUpdate.map(async (file, index) => {
            let result;

            result = await cloudinary.uploader.upload(file.path, {
                format: 'jpeg',
                public_id: uuidv4(),
            });

            return {
                url: result.secure_url,
                procjena: procjena._id,
            };
        }));

        const createdImages = await ProcjenaImages.create(images);

        procjena.images.push(...createdImages.map(img => img._id))

        await procjena.save();

        res.status(200).json(procjena)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

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