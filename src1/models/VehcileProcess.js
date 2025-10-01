const mongoose = require("mongoose")

const voziloProcessScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    vozilo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proces'
    },
    spremnoZaProdaju: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("VoziloSaProcesima", voziloProcessScheme)