const express = require("express")
const router = express.Router();

const Task = require("../models/TaskSchema")
const Korisnik = require("../models/UserSchema");
const Notifikacija = require("../models/NotificationsScheme")
const Sektor = require("../models/SektorSchema")
const { server, io } = require('../socket/socket');
const VoziloScheme = require("../models/VoziloScheme");

router.get('/svi-zadaci', async (req, res) => {
    try {

        const user = await Task.find();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/postavi-zadatak/:userId/:sektor', async (req, res) => {
    try {
        // Extract task details from the request body
        const { title, description, status, importantLever } = req.body;
        const { userId, sektor } = req.params;

        const user = await Korisnik.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const task = new Task({
            title,
            description,
            user: userId, // Assign the user's ObjectId to the task's user field
            status,
            sektor,
            importantLever
        });

        if (!task) {
            return res.status(400).json({ error: 'GRESKA PRILIKOM KREIRANJA ZADATKA' });
        }

        const notifikacija = new Notifikacija({
            title: `Dobili ste novi zadatak: ${title}`,
            description: description,
            user: userId,
        })

        user.tasks.push(task._id);
        user.notifications.push(notifikacija._id);

        await user.save();
        await task.save();
        await notifikacija.save();

        io.emit('zadatak', { message: `Dobili ste novi zadatak`, user: userId });

        res.status(201).json(task);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/postavi-zadatak-za-vozilo/:userId/:sektor/:voziloId', async (req, res) => {
    try {
        // Extract task details from the request body
        const { title, description, status } = req.body;
        const { userId, sektor, voziloId } = req.params;

        const user = await Korisnik.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const task = new Task({
            title,
            description,
            user: userId, // Assign the user's ObjectId to the task's user field
            status,
            sektor,
            vozilo: voziloId
        });

        if (!task) {
            return res.status(400).json({ error: 'GRESKA PRILIKOM KREIRANJA ZADATKA' });
        }

        const vozilo = await VoziloScheme.findById(voziloId);

        const notifikacija = new Notifikacija({
            title: `Dobili ste novi zadatak: ${title}`,
            description: description,
            user: userId,
        })

        user.tasks.push(task._id);
        user.notifications.push(notifikacija._id);
        vozilo.tasks.push(task._id);

        await user.save();
        await task.save();
        await vozilo.save();
        await notifikacija.save();

        io.emit('zadatak', { message: `Dobili ste novi zadatak`, user: userId });

        res.status(201).json(task);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/zavrsi-zadatak/:zadatakId', async (req, res) => {
    try {
    
        const { zadatakId } = req.params;

        const zadatak = await Task.findById(zadatakId);

        if (!zadatak) {
            return res.status(404).json({ error: 'Zadatak not found' });
        }

        zadatak.status = 'Završeno';

        await zadatak.save();

        io.emit('zadatak', { message: `Zadatak završen`, user: zadatak.user });

        res.status(201).json(zadatak);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router