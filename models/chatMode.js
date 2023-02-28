const mongoose = require('mongoose')
const chatSchema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user" 
        }]
})
chat = mongoose.model('chat',chatSchema)
exports.Chat = chat