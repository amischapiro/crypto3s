const mongoose = require("mongoose")
const Product = require('./order');
const adminSchema = new mongoose.Schema({
    _id:{

    },
    adminname: {
        type: String,
        required: true
    },
    adminpassword: {
        type: String,
        required: true
    },
    admincart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        adminquantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
   
    adminorderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});


const Admin = mongoose.model('admin',adminSchema)
module.exports = Admin