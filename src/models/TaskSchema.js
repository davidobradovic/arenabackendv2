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
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Korisnici' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Korisnici' },
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
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskFile',
        required: false
    }],
    taskJob: {
        type: String,
        required: false,
    },
    taskWorker: {
        type: String,
        required: false,
    },
    importantLever: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    endedAt: {
        type: Date,
    },
    reminder: {
        type: Date,
    },
    dueDate: {
        type: Date,
    },
    finishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnici'
    },
})

module.exports = mongoose.model("Tasks", taskSchema)