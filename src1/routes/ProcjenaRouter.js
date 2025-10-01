const express = require("express")
const router = express.Router();

const Procjena = require("../models/ProcjenaSchema")
const { server, io } = require('../socket/socket');

const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2
const multer = require('multer');
const ProcjenaImages = require("../models/ProcjenaImages");
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
        const result = await Procjena.find();
        res.send(result)
        io.emit('newNotification', { message: 'Novi izvjestaj je postavljen' });  // Emit the event here
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.post('/postavi-procjenu', async (req, res) => {
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
            carVertical,
            alarm,
            servisnaKnjiga,
            servisnaKnjigaContent,
            drugiSetTockova,
            drugiSetTockovaContent,
            motorImjenjacUlaganja,
            trapUlaganja,
            limarijaUlaganja,
            lakiranjeUlaganja,
            poliranjeUlaganja,
            dubinskoUlaganja,
            presvlacenjeUlaganja,
            felgeIgumeUlaganja,
            ostalaUlaganja,
            ukupnoUlaganja,
        } = req.body

        const procjena = new Procjena({
            zamjenaZaVozilo,
            vozilo,
            godiste,
            sasija,
            kilometraza,
            realnoStanjeKM,
            brojKljuceva,
            registrovanDo,
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
            carVertical,
            alarm,
            servisnaKnjiga,
            servisnaKnjigaContent,
            drugiSetTockova,
            drugiSetTockovaContent,
            motorImjenjacUlaganja,
            trapUlaganja,
            limarijaUlaganja,
            lakiranjeUlaganja,
            poliranjeUlaganja,
            dubinskoUlaganja,
            presvlacenjeUlaganja,
            felgeIgumeUlaganja,
            ostalaUlaganja,
            ukupnoUlaganja,
        });

        // procjena.images.push(...createdImages.map(img => img._id))

        await procjena.save();

        res.status(200).json(procjena)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})


module.exports = router