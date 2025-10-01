const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'korisnici'
    },
    status: {
        type: String,
        default: 'Nije preuzeto'
    },
    vozilo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VoziloSaProcesima'
    }
})

module.exports = mongoose.model("Tasks", taskSchema)