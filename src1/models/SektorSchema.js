const mongoose = require("mongoose")

const sektorSchema = new mongoose.Schema({
    title: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks', required: false }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'korisnici' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'korisnici' }
})

module.exports = mongoose.model("Sektor", sektorSchema)