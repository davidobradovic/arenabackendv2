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


const { server, io } = require("../socket/socket");

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


router.get('/svi-sektori', async (req, res) => {
    try {
        const result = await Sektor.find();
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

router.get('/sve-procjene', async (req, res) => {
    try {
        const result = await Procjena.find();
        res.send(result)
    } catch (e) {
        j
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

module.exports = router;
