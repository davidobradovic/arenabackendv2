const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    vozilo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnici'
    },
    status: {
        type: String,
        default: 'Preuzeto'
    },
    sektor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sektor'
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskImage',
        required: false
    }],
    importantLever: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Tasks", taskSchema)