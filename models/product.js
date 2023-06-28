const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    img:{
        type:String,
        require:true
    },
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
    },
    symbol:{
        type:String,
        require:true
    },
    change:{
        type:String,
        require:true
    },
    volume:{
        type:String,
        require:true
    }
})

const Product = mongoose.model('products',productSchema)
// module.exports = Product
module.exports = mongoose.model('Product', productSchema);

