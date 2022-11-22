const mongoose = require('mongoose');

//creating a schema for client
const customerSchema = new mongoose.Schema({
    customer_name: {
        type:String,
        required:true,
    },
    customer_mobile_number: {
        type:Number,
        required:true,
        unique:true
    },
    reference_doctor: {
        type:String,
        required:true
    },
    customer_type: {
        type:String,
        required:true
    }
});


//now we need to create a collection for client
const Customer = new mongoose.model('Customer',customerSchema);
module.exports = Customer;