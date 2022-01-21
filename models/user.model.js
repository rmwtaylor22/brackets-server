const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        choices: { type: Array, required: true },
        points: { type: String, required: true },
        date: { type: Date }
    },
    { collection: 'picks' }
)

const model = mongoose.model('Picks', User)

module.exports = model