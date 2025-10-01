const mongoose = require("mongoose");

const taksImagesScheme = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("TaskImage", taksImagesScheme);
