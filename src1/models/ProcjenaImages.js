const mongoose = require("mongoose");

const procjenaImagesScheme = new mongoose.Schema({
    procjena: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProcjenaVozla',
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("ProcjenaImage", procjenaImagesScheme);
