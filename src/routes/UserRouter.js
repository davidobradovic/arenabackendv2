
const express = require("express")
const router = express.Router();

const Task = require("../models/TaskSchema")
const User = require("../models/UserSchema")
const { server, io } = require('../socket/socket');
const Notifikacija = require("../models/NotificationsScheme");

router.get('/svi-korisnici', async (req, res) => {
    try {

        const user = await User.find();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/korisnik/:korisnikId', async (req, res) => {
    try {
        const { korisnikId } = req.params;

        const user = await User.findById(korisnikId).populate('tasks', 'sektors');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/kreiraj-korisnika', async (req, res) => {
    try {
        // Extract task details from the request body
        const { email, password, name, role } = req.body;

        // Create a new task
        const user = new User({
            email,
            password,
            name,
            role
        });


        if (!user) {
            return res.status(404).json({ error: 'User dont created' });
        }

        await user.save();

        res.status(201).json({ message: 'User created succesfuly', user });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/postavi-notifikacioni-kod/:userID', async (req, res) => {
    try {

        const { userID } = req.params;
        const { pushCode } = req.body;

	console.log(userID);
	console.log(pushCode);

        const user = await User.findById(userID);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.pushNotification = pushCode;

        await user.save();

        res.status(201).json(user);
    } catch(error) {
        console.error('Error while puting push code:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/notifications/:userId', async (req, res) => {
    try {

        const { userId } = req.params;

        const user = await Notifikacija.find({
            user: userId
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router