const mongoose = require('mongoose');

//creating a schema for sales
const salesSchema = new mongoose.Schema({
    src_customer_name: {
        type:String,
        required:true,
    },
    medicine_name: {
        type:String,
        required:true
    },
    medicine_quantity: {
        type:Number,
        required:true
    },
    medicine_price: {
        type:Number,
        required:true
    },
    sell_quantity: {
        type:Number,
        required:true
    },
    total_amount: {
        type:Number,
        required:true
    }
});


//now we need to create a collection for sales
const Sales = new mongoose.model('Sale',salesSchema);
module.exports = Sales;