const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StateSchema = new Schema({
    name: {type: String, required: true},
    clicks: {type: Number, required: true},
})

// Export model
module.exports = mongoose.model("State", StateSchema);