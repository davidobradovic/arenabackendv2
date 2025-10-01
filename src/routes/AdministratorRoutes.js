const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Korisnik = require("../models/UserSchema");
const Sektor = require('../models/SektorSchema');
const Task = require('../models/TaskSchema');
const Procjena = require('../models/ProcjenaSchema')
const Channel = require('../models/ChannelScheme');
const Vehicle = require('../models/VoziloScheme')
const VehicleImage = require('../models/VehicleImages')
const { v4: uuidv4 } = require('uuid');
const Pneumatici = require("../models/PneumaticiScheme");
const CRMUser = require('../models/CRMUsers');
const EvidencijaUplata = require("../models/EvidencijaUplataScheme");
const EvidencijaBudget = require("../models/EvidencijaBudget");

const { server, io } = require("../socket/socket");
var sql = require("mssql");
// config for your database
var config = {
    user: 'sa',
    password: 'Bites001$',
    server: 'dcsarajevo.ddns.net',
    port: 5001,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};


const cloudinary = require('cloudinary').v2
const multer = require('multer');
const ZalihaScheme = require("../models/ZalihaScheme");
const ObavjestenjeScheme = require("../models/ObavjestenjeScheme");
const DnevnaEvidencijaScheme = require("../models/DnevnaEvidencijaScheme");
const PoliranjeScheme = require("../models/PoliranjeScheme");
const ServisScheme = require("../models/ServisScheme");
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

router.get('/svi-crm-korisnici', async (req, res) => {
    try {
        const result = await CRMUser.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})


router.post('/kreiraj-crm', async (req, res) => {
    try {
        const { fullName,
            phoneNumber,
            emailAddress,
            workerName,
            visitDate,
            vehicle, note } = req.body;

        const newCRMUser = new CRMUser({
            fullName,
            phoneNumber,
            emailAddress,
            workerName,
            visitDate,
            vehicle,
	    note
        });

        const savedCRMUser = await newCRMUser.save();

        res.send(savedCRMUser)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri kreiranju CRM korisnika' + e })
    }
})


router.delete('/obrisi-sve-zalihe', async (req, res) => {
    try {
        const result = await ZalihaScheme.deleteMany();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})


router.get('/sve-evidencije', async (req, res) => {
    try {
        const result = await EvidencijaUplata.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/svi-servisi', async (req, res) => {
    try {
        const result = await ServisScheme.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/svi-budzeti', async (req, res) => {
    try {
        const result = await EvidencijaBudget.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/sva-zaliha', async (req, res) => {
    try {
        const result = await ZalihaScheme.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})



router.get('/svi-sektori', async (req, res) => {
    try {
        const result = await Sektor.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})


router.get('/sve-pneumatici', async (req, res) => {
    try {
        const result = await Pneumatici.find();
        res.send(result)
    } catch (e) {
        j
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/sva-obavjestenja', async (req, res) => {
    try {
        const result = await ObavjestenjeScheme.find();
        res.send(result)
    } catch (e) {
        j
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/dnevni-izvjestaji', async (req, res) => {
    try {
        const result = await DnevnaEvidencijaScheme.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.post("/kreiraj-sektor", async (req, res) => {
    try {
        const { title, userIds, creatorId } = req.body;

        // Ensure userIds is an array of MongoDB ObjectId

        // Find users that match the userIds array
        const usersToBeLinked = await Korisnik.find({
            '_id': { $in: userIds }
        });

        // Extract the user IDs that actually exist in the database
        const validUserIds = usersToBeLinked.map(user => user._id);

        // Create Sektor with associated tasks, users that actually exist, and creator
        const sektor = await Sektor.create({
            title,
            users: validUserIds, // Link only valid/existing user IDs
            creator: creatorId
        });

        if (!sektor) {
            return res.status(400).json({ status: 'error', message: 'Greska pri kreiranju sektora' });
        }

        return res.status(200).json({ status: 'success', message: 'Uspijesno kreiran sektor' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/obrisi-sektor/:sektorId", async (req, res) => {
    try {
        const { sektorId } = req.params;

        const sektor = await Sektor.deleteOne({
            _id: sektorId
        })

        if (!sektor) {
            return res.status(400).json({ status: 'error', message: 'Greska pri brisanju sektora' });
        }

        return res.status(200).json({ status: 'success', message: 'Uspijesno obrisan sektor' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add-users-to-sektor/:sektorId', async (req, res) => {
    try {
        const { userIds } = req.body;
        const { sektorId } = req.params;

        // Find the sector asynchronously, assuming Sektor.findById returns a Promise
        const sector = await Sektor.findById(sektorId);

        if (!sector) {
            return res.json({ error: 'Sector not found' });
        }

        // Ensure that sector.users is initialized as an array
        sector.users = sector.users || [];

        // // Check if users already exist in the sector
        // const userExisting = Korisnik.find({
        //     _id: {
        //         $in: userIds
        //     },
        //     sektor: {
        //         $elemMatch: {
        //             sektorId: { $exists: true }
        //         }
        //     }
        // });


        // if (userExisting) {
        //     return res.json({ status: 'error', message: 'Korisnici su već dodati u tom sektoru' });
        // } else {
        // Add the new users to the sector
        sector.users = [...sector.users, ...userIds];

        // Save the updated sector to the database
        await sector.save();

        res.json({ success: true, status: 'success', message: 'Uspijesno ste dodali korisnike u sektor' });
        // }

    } catch (error) {
        console.error('Error adding users to sector:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/remove-user-from-sector/:sectorId/:userId', async (req, res) => {
    const { sectorId, userId } = req.params;

    try {
        // Find the sector by ID
        const sector = await Sektor.findById(sectorId);

        // Check if the sector exists
        if (!sector) {
            return res.json({ status: 'error', message: 'Sektor nije pronadjen' });
        }

        // Check if the user is in the sector
        const index = sector.users.indexOf(userId);
        if (index === -1) {
            return res.json({ status: 'error', message: 'Korisnik nije pronadjen u ovom sektoru' });
        }

        // Remove the user from the sector
        sector.users.splice(index, 1);

        // Save the updated sector to the database
        await sector.save();

        // Respond with success
        return res.json({ status: 'success', message: 'Korisnik je uspiješno izbrisan iz sektora' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/allow-procjena-status/:procjenaId', async (req, res) => {
    const { procjenaId } = req.params;

    try {
        // Find the sector by ID
        const sector = await Procjena.updateOne({
            _id: procjenaId
        }, {
            isAllowed: true
        })

        // Check if the sector exists
        if (!sector) {
            return res.json({ status: 'error', message: 'Procjena nije pronadjena' });
        }

        return res.json({ status: 'success', message: 'Procjena prihvacena' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/disallow-procjena-status/:procjenaId', async (req, res) => {
    const { procjenaId } = req.params;

    try {
        // Find the sector by ID
        const sector = await Procjena.updateOne({
            _id: procjenaId
        }, {
            isAllowed: false
        })

        // Check if the sector exists
        if (!sector) {
            return res.json({ status: 'error', message: 'Procjena nije pronadjena' });
        }

        return res.json({ status: 'success', message: 'Procjena prihvacena' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete("/delete-all-channels", async (req, res) => {
    try {
        // Find the sector by ID
        const sector = await Channel.deleteMany()

        await Korisnik.updateMany({}, { $set: { channels: [] } });

        // Check if the sector exists
        if (!sector) {
            return res.json({ status: 'error', message: 'Greska pri brisanju svih kanala' });
        }

        return res.json({ status: 'success', message: 'Kanali obrisani' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/post-vehicle', upload.array('images'), async (req, res) => {
    try {
        const { name, price, vin } = req.body;
        const filesToUpdate = req.files || [];

        const vehicle = await Vehicle.create({
            name: name,
            price: price,
            vin: vin
        });

        const images = await Promise.all(filesToUpdate.map(async (file, index) => {
            let result;

            result = await cloudinary.uploader.upload(file.path, {
                format: 'jpeg',
                public_id: uuidv4(),
            });

            return {
                url: result.secure_url,
                vehicle: vehicle._id,
            };
        }));

        const createdImages = await VehicleImage.create(images);

        // Push the created image IDs to the vehicle's images array
        vehicle.images.push(...createdImages.map(img => img._id));

        // Save the changes to the vehicle
        await vehicle.save();

        res.status(200).json({ status: 'success', message: 'Uspijesno kreiranje vozila u bazu' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/sva-poliranja', async (req, res) => {
    try {
        const result = await PoliranjeScheme.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/all-vehicles', async (req, res) => {
    try {

        const data = await Vehicle.find().populate('images')

        if (!data) {
            res.status(201).json({ error: `Greška prilikom izvlačenja podataka` });
        }

        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
})

router.post('/pneumatik', async (req, res) => {
    try {
        const { lotBroj,
            tip,
            brojKomada,
            brend,
            vozilo,
            velicina,
            rasponSarafa,
            etJotFelgi,
            centralnaRupa,
            markaTipGuma,
            sezonaGuma,
            dimenzija,
            dot,
            dubinaSare,
            ekseri,
            skladiste,
            napomena,
            dostupnost
        } = req.body;
        const pneumatik = Pneumatici.create({
            tip: tip,
            brojKomada: brojKomada,
            brend: brend,
            vozilo: vozilo,
            velicina: velicina,
            rasponSarafa: rasponSarafa,
            etJotFelgi: etJotFelgi,
            centralnaRupa: centralnaRupa,
            markaTipGuma: markaTipGuma,
            sezonaGuma: sezonaGuma,
            dimenzija: dimenzija,
            dot: dot,
            dubinaSare: dubinaSare,
            ekseri: ekseri,
            skladiste: skladiste,
            napomena: napomena,
            dostupnost: dostupnost
        });
        res.status(201).send(pneumatik);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/pneumatici', async (req, res) => {
    try {
        const pneumatici = req.body;
        const savedPneumatici = await Pneumatici.insertMany(pneumatici);
        res.status(201).send(savedPneumatici);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/evidencija-uplata', async (req, res) => {
    try {
        const evidencijeUplata = req.body;
        const savedEvidencije = await EvidencijaUplata.insertMany(evidencijeUplata);
        res.status(201).send(savedEvidencije);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/zalihe', async (req, res) => {
    try {
        const zaliha = req.body;
        const savedZaliha = await ZalihaScheme.insertMany(zaliha);
        res.status(201).send(savedZaliha);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/kreiraj-zalihu', async (req, res) => {
    try {
        const zaliha = req.body;
        const savedZaliha = await ZalihaScheme.create(zaliha);
        res.status(201).send(savedZaliha);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/uredi-zalihu/:zalihaId', async (req, res) => {
    try {
        const {
            datum,
            idBroj,
            brojKljuceva,
            dostupnost,
            tablice,
            dosleUzVozilo,
            vozilo,
            godiste,
            vrstaMotora,
            snaga,
            kilometraza,
            mjenjac,
            brojSasije,
            boja,
            ogasenaCijenaVozila,
            olxLink,
            datumObjave,
            registrovanDo,
            zadnjiServisKmDatum,
            brojDanaOdKadaJeVoziloNaPlacu,
            velikiservis,
            servisnaistorija,
            gume
        } = req.body;
        const { zalihaId } = req.params;

        console.log(req.params);
        console.log(req.body);

        const zaliha = await ZalihaScheme.findById(zalihaId);

        if (!zaliha) {
            return res.status(404).json({ error: 'Prijem not found' });
        }

        // Update task fields
        zaliha.datum = datum,
        zaliha.idBroj = idBroj,
        zaliha.brojKljuceva = brojKljuceva,
        zaliha.dostupnost = dostupnost,
        zaliha.tablice = tablice,
        zaliha.dosleUzVozilo = dosleUzVozilo,
        zaliha.vozilo = vozilo,
        zaliha.godiste = godiste,
        zaliha.vrstaMotora = vrstaMotora,
        zaliha.snaga = snaga,
        zaliha.kilometraza = kilometraza,
        zaliha.mjenjac = mjenjac,
        zaliha.brojSasije = brojSasije,
        zaliha.boja = boja,
        zaliha.ogasenaCijenaVozila = ogasenaCijenaVozila,
        zaliha.olxLink = olxLink,
        zaliha.datumObjave = datumObjave,
        zaliha.registrovanDo = registrovanDo,
        zaliha.zadnjiServisKmDatum = zadnjiServisKmDatum,
        zaliha.brojDanaOdKadaJeVoziloNaPlacu = brojDanaOdKadaJeVoziloNaPlacu,
        zaliha.velikiservis = velikiservis,
        zaliha.servisnaistorija = servisnaistorija,
        zaliha.gume = gume,

        io.emit('arzuriranZapisnik', `${zaliha.vozilo} je promjenjen`);

        await zaliha.save();

        res.status(200).json(zaliha);

    } catch (error) {
        console.error('Error editing task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/obrisi-zalihu/:zalihaId", async (req, res) => {
    try {
        const { zalihaId } = req.params;

        const zaliha = await ZalihaScheme.deleteOne({
            _id: zalihaId
        })

        if (!zalihaId) {
            return res.status(400).json({ status: 'error', message: 'Greska pri brisanju zalihe' });
        }

        return res.status(200).json({ status: 'success', message: 'Uspijesno obrisana zaliha' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/poliranje', async (req, res) => {
    try {
        const { 
            vozilo,
            vrstaPoliranja,
            tackanje
        } = req.body;

        const poliranje = await PoliranjeScheme.create({
            vozilo: vozilo,
            vrstaPoliranja: vrstaPoliranja,
            tackanje: tackanje
        });

        if (!poliranje) {
            res.status(500).json({ error: 'Greksa prilikom kreiranja' })
        }

        res.status(200).json({ status: 'success', message: 'Uspijesno dodavanje novca u budzet' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/post-obavjestenje', async (req, res) => {
    try {
        const { title } = req.body;

        const obavjest = await ObavjestenjeScheme.create({
            title
        });

        res.status(200).json({ status: 'success', message: 'Uspijesno kreiranje obavjestenja' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/post-dnevna-evidencija', async (req, res) => {
    try {
        const { title, price } = req.body;

        const evidencija = await DnevnaEvidencijaScheme.create({
            title,
            price
        });

        if (!evidencija) {
            res.status(500).json({ error: 'Greksa prilikom kreiranja' })
        }

        res.status(200).json({ status: 'success', message: 'Uspijesno kreiranje evidencije' });

        io.emit('evidencija', { message: `${title} - ${price} BAM` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/update-dnevna-evidencija/:devidencijaId', async (req, res) => {
    try {
        const { devidencijaId } = req.params;
        const { title, price } = req.body;

        const evidencija = await DnevnaEvidencijaScheme.findById(devidencijaId);


        if (!evidencija) {
            res.status(500).json({ error: 'Greksa prilikom nalazenja evidencije' })
        }

        evidencija.title = title;
        evidencija.price = price;

        io.emit('updateEvidencija', "Arzurirana je evidencija");

        await evidencija.save();

        res.status(200).json({ status: 'success', message: 'Uspijesno kreiranje evidencije' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/post-evidencija-budget', async (req, res) => {
    try {
        const { value } = req.body;

        const evidencija = await EvidencijaBudget.create({
            value
        });

        if (!evidencija) {
            res.status(500).json({ error: 'Greksa prilikom kreiranja' })
        }

        res.status(200).json({ status: 'success', message: 'Uspijesno dodavanje novca u budzet' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete("/obrisi-evidencije", async (req, res) => {
    try {

        const zaliha = await DnevnaEvidencijaScheme.deleteMany()
        const budzet = await EvidencijaBudget.deleteMany();

        return res.status(200).json({ status: 'success', message: 'Uspijesno obrisana zaliha' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/post-servis', async (req, res) => {
    try {
        const {
            vozilo,
            sasija,
            velikiServis,
            velikiServisKm,
            velikiServisDatum,
            velikiServisIznos,
            maliServis,
            maliServisKm,
            maliServisDatum,
            maliServisIznos,
            motorContent,
            motorPrice,
            mjenjacContent,
            mjenjacPrice,
            kvaciloContent,
            kvaciloPrice,
            ovijesContent,
            ovijesPrice,
            kocniceContent,
            kocniceSide,
            kocnicePrice,
            ostalaUlaganjaContent,
            ostalaUlaganjaPrice
        } = req.body;

        const servis = await ServisScheme.create({
            vozilo: vozilo,
            sasija: sasija,
            velikiServis: velikiServis,
            velikiServisKm: velikiServisKm,
            velikiServisDatum: velikiServisDatum,
            velikiServisIznos: velikiServisIznos,
            maliServis: maliServis,
            maliServisKm: maliServisKm,
            maliServisDatum: maliServisDatum,
            maliServisIznos: maliServisIznos,
            motorContent: motorContent,
            motorPrice: motorPrice,
            mjenjacContent: mjenjacContent,
            mjenjacPrice: mjenjacPrice,
            kvaciloContent: kvaciloContent,
            kvaciloPrice: kvaciloPrice,
            ovijesContent: ovijesContent,
            ovijesPrice: ovijesPrice,
            kocniceContent: kocniceContent,
            kocniceSide: kocniceSide,
            kocnicePrice: kocnicePrice,
            ostalaUlaganjaContent: ostalaUlaganjaContent,
            ostalaUlaganjaPrice: ostalaUlaganjaPrice
        });

        res.status(200).json(servis);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});



router.get('/zaliha', async (req, res, next) => {
    try {
        const pool = await sql.connect(config);
        const sqlQuery = `use am

        select z.acIdent as 'Sifra artikla', r.acName as 'Naziv artikla',  ltrim(replace(str(z.anstock,10,2),'.',',')) as 'KoliËina na stanju', ltrim(replace(str(z.anLastPrice,10,2),'.',','))  as 'Nabavna cijena', ltrim(replace(str(((case when c.anSalePrice is null then r.anSalePrice else c.anSalePrice end)/1.17),10,2),'.',','))  as 'Prodajna cijena', r.acDescr as 'Opis'
        from tHE_Stock z
        left join tHE_SetItem r on r.acIdent = z.acIdent
        left join tHE_SetItemPriceForWrh c on z.acIdent = c.acIdent and z.acWarehouse = c.acWarehouse
        where z.acWarehouse = 'Arena Motors Skladiste' and z.anStock > '0'
        `;
        const result = await pool.request().query(sqlQuery);
        return res.send(result.recordset);
    } catch (err) {
        throw err;
    }
});

router.get('/prodaja', async (req, res, next) => {
    try {
        const pool = await sql.connect(config);
        const sqlQuery = `use am

SELECT  g.acKey as 'Broj raËuna',g.acIssuer as 'Skladiöte',
convert(varchar(MAX), g.adDate, 104)  as 'Datum RaËuna', g.acReceiver as 'Naziv kupca',
PM.acName as 'NaËin plaÊanja', m.acIdent as 'äifra artikla', m.acName as 'Naziv artikla', ltrim(replace(str(p.anQty,10,2),'.',',')) as 'KoliËina',
ltrim(replace(str((p.anQty * p.anStockPrice),10,2),'.',',')) as 'Nabavna vrijednost',
ltrim(replace(str(p.anPVOCVATBase,10,2),'.',',')) as 'Vrijednost bez pdv-a',
 ltrim(replace(str(p.anPVOCforPay,10,2),'.',',')) as 'Vrijednost sa PDV-om', m.acDescr as 'Opis', m.acCode as 'Broj öasije', g.acDoc1 as 'Dokument'
from tHE_Move g
inner join tHE_MoveItem p on g.ackey = p.acKey
inner join tHE_SetItem m on p.acIdent = m.acIdent
left join vHE_SetSubj r on g.acReceiver = r.acSubject
left join tPA_SetDocType n on g.acDocType = n.acDocType
LEFT JOIN vHE_SetPayMet PM ON G.acPayMethod = PM.acPayMethod
LEFT JOIN vHE_SetDelMet de ON g.acDelivery  =  de.acDelivery
AND G.acDocType in ('3000') WHERE g.acIssuer = 'Arena Motors Skladiste'
        `;
        const result = await pool.request().query(sqlQuery);
        return res.send(result.recordset);
    } catch (err) {
        throw err;
    }
});



module.exports = router;
