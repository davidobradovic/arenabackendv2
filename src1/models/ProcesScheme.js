const mongoose = require("mongoose")

const procesScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    zavrsioGa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'korisnici'
    },
    importantLevel: {
        type: Number,
        default: 0
    },
    vozilo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VoziloSaProcesima'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Proces", procesScheme)