const mongoose = require('mongoose');

//creating a schema for invoice
const invoiceSchema = new mongoose.Schema({
    file_name: {
        type:String,
        required:true,
    },
    cust_name: {
        type:String,
        required:true,
    },
    mob_number: {
        type:Number,
        required:true,
    },    
    ref_doctor: {
        type:String,
        required:true,
    },
    pdf_content: {
        type:String,
        required:true,
    }
});


//now we need to create a collection for invoice
const Invoice = new mongoose.model('Invoice',invoiceSchema);
module.exports = Invoice;