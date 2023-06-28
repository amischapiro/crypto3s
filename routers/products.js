
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
const multer = require('multer'); // For handling multipart/form-data (file uploads)
const upload = multer({ dest: 'uploads/' });
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


router.get('/', (req, res) => {
    const currUserName = req.cookies.username
    let ifAdmin = false;
    if(currUserName=='admin'){
      ifAdmin= true
    }
  
    if(!currUserName){
      res.send('<h1>you must log in to visit this site</h1>')
    }else{
      Product.find()
      .then(products => {
        res.render('products', { title: 'Products Page',products,ifAdmin });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  
    }
  });


router.post('/', async (req, res) => {
    const { img,name, description, symbol, price, change, volume } = req.body;
  
    try {
      const existingProduct = await Product.findOne({ name: name });
  
      if (existingProduct) {
        return res.sendStatus(409);
      }
  
      const newProduct = new Product({
        img:img,
        name: name,
        description: description,
        symbol: symbol,
        price: price,
        change: change,
        volume: volume
      });
  
      const savedProduct = await newProduct.save();
      console.log('Product created successfully:', savedProduct);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error creating product:', error);
      res.sendStatus(500);
    }
  });
  



  router.delete('/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
  
      const productDeleteResult = await Product.deleteOne({ _id: productId });
  
      if (productDeleteResult.deletedCount !== 1) {
        throw new Error('Product not found');
      }
  
      const [userUpdateResult, orderUpdateResult] = await Promise.all([
        User.updateMany({ 'cart.productId': productId }, { $pull: { cart: { productId } } }),
        Order.updateMany({ 'products.product': productId }, { $pull: { products: { product: productId } } })
      ]);
  
      const hasUserUpdate = userUpdateResult.modifiedCount > 0;
      const hasOrderUpdate = orderUpdateResult.modifiedCount > 0;
  
      if (hasUserUpdate || hasOrderUpdate) {
        if (hasOrderUpdate) {
          const orders = await Order.find({});
          const deletePromises = [];
  
          orders.forEach(order => {
            if (!order.products || order.products.length === 0) {
              deletePromises.push(Order.deleteOne({ _id: order._id }));
            }
          });
  
          const deletedOrders = await Promise.all(deletePromises);
          console.log(`${deletedOrders.length} orders deleted successfully.`);
        } else {
          console.log('Product deleted successfully from cart');
        }
      } else {
        throw new Error('Product not found in cart and orders');
      }
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting product:', error);
      res.sendStatus(500);
    }
  });


  
router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
  
    const regex = new RegExp(searchQuery, 'i');
    const searchCondition = {
      $or: [
        { name: regex },
        { description: regex },
        { symbol: regex }
      ]
    };
  
    Product.find(searchCondition)
      .then(products => {
        res.json(products);
      })
      .catch(error => {
        console.error('Error searching products:', error);
  
      }
    
      )
  })
  



router.put('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const { img,name, description, symbol, price, change, volume } = req.body;
  
    try {
      const existingProduct = await Product.findOne({ name: name });
  
      if (existingProduct && existingProduct._id != productId) {
        return res.sendStatus(409);
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        img:img,
        name: name,
        description: description,
        symbol: symbol,
        price: price,
        change: change,
        volume: volume
      });
  
      if (updatedProduct) {
        console.log('Product updated successfully:', updatedProduct);
        res.sendStatus(200);
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.sendStatus(500);
    }
  });


  router.get('/all', (req, res) => {
    Product.find({})
      .then(products => {
        res.json({ products });
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  


  

module.exports = router;
