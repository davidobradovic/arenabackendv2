const express = require("express")
const router = express.Router();

const Proces = require("../models/ProcesScheme");
const VoziloProcess = require("../models/VehcileProcess");
const { server, io } = require('../socket/socket');

router.get('/sva-vozila-upp', async (req, res) => {
    try {

        const user = await VoziloProcess.find();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post("/postavi-vozilo", async (req, res) => {
    try {
        const { voziloSaProcesima, proces } = req.body;

        // Create a new VoziloSaProcesima instance
        const newVoziloSaProcesima = new VoziloProcess(voziloSaProcesima);
        const savedVoziloSaProcesima = await newVoziloSaProcesima.save();

        // Create a new Proces instance
        const newProces = new Proces(proces);
        newProces.voziloSaProcesima = savedVoziloSaProcesima._id;
        const savedProces = await newProces.save();

        // Update VoziloSaProcesima with the new Proces ID
        savedVoziloSaProcesima.procesi.push(savedProces._id);
        await savedVoziloSaProcesima.save();

        io.emit('postaviVoziloNaPripremu', { message: 'Dodato je novo vozilo na pripremnu listu' });  // Emit the event here

        res.status(201).json({ voziloSaProcesima: savedVoziloSaProcesima, proces: savedProces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/vozilo-upp/:voziloId', async (req, res) => {
    try {
        const voziloId = req.params.voziloId;

        const vozilo = await VoziloProcess.deleteOne({ _id: voziloId });

        if (!vozilo) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(vozilo);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/postavi-proces/:voziloId", async (req, res) => {
    try {
        const { title, status, zavrsioGa, importantLevel } = req.body;
        const { voziloId } = req.params
        // Create a new Proces instance
        const newProces = new Proces({
            title,
            status,
            zavrsioGa,
            importantLevel,
            vozilo: voziloId
        });

        await newProces.save();

        io.emit('postaviVoziloNaPripremu', { message: 'Dodato je novo vozilo na pripremnu listu' });  // Emit the event here

        res.status(201).json(newProces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router