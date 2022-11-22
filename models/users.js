const mongoose = require('mongoose');

//creating a schema for users
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        unique:true,
        required: true,
    },
    email: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type: String,
        unique:true,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
});

//now we need to create a collection for users
const Users = new mongoose.model('User',usersSchema);
module.exports = Users;