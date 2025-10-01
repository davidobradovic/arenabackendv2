const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Korisnik = require("../models/UserSchema");
const { server, io } = require("../socket/socket");

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Korisnik.findOne({ email });

        if (user) {
            if (user.password === password) {
                const token = jwt.sign({ userId: user._id, email: user.email }, 'arena123', { expiresIn: '1h' });
                Korisnik.findByIdAndUpdate(user._id, { isActive: true })
                io.emit('kolegaPrijavljen', { message: `${user.name} se upravo prijavio na sistem. U slučaju da ste mu pisali neke poruke ili ima neke zadatke sada će to moći vidjeti.` });  // Emit the event here
                res.status(200).json({ token, message: 'Uspjesno', user: user._id });
            } else {
                res.status(401).json({ error: 'Pogresni podaci' });
            }
        } else {
            res.status(404).json({ error: 'Korisnik nije pronadjen' });
        }
    } catch (error) {
        console.error('Serverska greska:', error);
        res.status(500).json({ error: 'Serverska greska' });
    }
});

module.exports = router;
