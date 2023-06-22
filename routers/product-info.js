const express = require('express');
const app = express();
const router = express.Router()
const config = require('../config')
const {default:mongoose}= require("mongoose")
const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());





router.get('/:productId', (req, res) => {
    const productId = req.params.productId;
    const currUserName = req.cookies.username;
    if(!currUserName){
      res.send('<h1>you must log in to visit this site</h1>')
    }else{
    Product.findOne({ _id: productId })
    .then(product => {
      if (product) {
        res.render('product-info', { title: 'Product Info Page',product});
      } else {
        console.log('Product not found');
      }
    })
    .catch(error => {
      console.error('Error fetching product:', error);
    });
  }
});



module.exports = router