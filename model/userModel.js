const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const userModel = new Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    }
})

const User = mongoose.model('User', userModel)

module.exports = User