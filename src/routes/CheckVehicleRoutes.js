const express = require("express")
const router = express.Router();

const Procjena = require("../models/ProcjenaSchema")

router.get('/info-vehicle/:vehVin', async (req, res) => {
    const { vehVin } = req.params
    try {
        const result = await Procjena.findById(vehVin).populate('images');
        res.send(result)
    } catch (e) {
        return res.status(500).json({ error: 'Greska pri izvlacenju podataka' + e })
    }
})

module.exports = router