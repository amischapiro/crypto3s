const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    }
})

const Product = mongoose.model('products',productSchema)
// module.exports = Product
module.exports = mongoose.model('Product', productSchema);

