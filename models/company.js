const mongoose = require('mongoose');

//creating a schema for company
const companySchema = new mongoose.Schema({
    manufacturer_name: {
        type:String,
        required:true,
        unique:true
    },
    supplier_name: {
        type:String,
        required:true
    },
    supplier_address: {
        type:String,
        required:true
    },
    supplier_contact_person_name: {
        type:String,
        required:true
    },
    supplier_mobile_number: {
        type:Number,
        required:true
    }
});


//now we need to create a collection for company
const Company = new mongoose.model('Company',companySchema);
module.exports = Company;