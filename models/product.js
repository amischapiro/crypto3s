const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    total:{
        type:Number,
        require:true
    }
})

const Product = mongoose.model('products',productSchema)
module.exports = Product
