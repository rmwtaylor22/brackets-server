const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    points: { type: Number, default: 0 }
},
{collection: 'users'}
)

const model = mongoose.model('user', User)

module.exports = model