const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    role: {
        type: String
    },
    avatar: {
        type: String,
        required: false
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }],
    sektors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sektor',
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notifikacija',
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
    }],
    pushNotification: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model("Korisnici", userSchema)