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




router.get('/', async (req, res) => {
    try {
      
      const currUserName = req.cookies.username 
      if(!currUserName){
        res.send('<h1>you must log in to visit this site</h1>')
      }else{ 
      const user = await User.findOne({ username: currUserName });
      if (user) {
        const cartItems = [];
        for (const cartItem of user.cart) {
          const product = await Product.findById(cartItem.productId);
          if (product) {
            const currItem = {
              product: product,
              quantity: cartItem.quantity
            };
            cartItems.push(currItem);
          }
        }
        
        res.render('cart', { title: 'Cart Page', cartItems,currUserName });
      } else {
        console.log('User not found');
      }
    }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  
  });

router.post('/add/:productId', (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    
    const currUserName = req.cookies.username    
    User.findOne({username:currUserName})
      .then(user => {
        if (user) {
          const existingProduct = user.cart.find(item => item.productId == productId);          
          if (existingProduct) {
            existingProduct.quantity += parseInt(quantity) ;
          } else {
            user.cart.push({ productId, quantity });
            
          }
          
          return user.save();
        } else {
          throw new Error('User not found');
        }
      })
      .then(updatedUser => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
        res.sendStatus(500);
      });
  });
  

  router.put('/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const quantity = req.body.quantity;
    const currUserName = req.cookies.username    
    User.findOne({username:currUserName})
    .then(user => {
      if (user) {
        
        const cartItem = user.cart.find(item => item.productId.toString() === itemId);
        if (cartItem) {        
          cartItem.quantity = quantity;
        } else {
          throw new Error('Cart item not found');
        }
  
        return user.save();
      } else {
        console.log('User not found');
        throw new Error('User not found');
      }
    })
    .then(updatedUser => {
      console.log('Quantity updated successfully:', updatedUser);
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Error updating quantity:', error);
      res.sendStatus(500);
    });
  });
  
  
  router.delete('/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const currUserName = req.cookies.username    
    User.findOne({username:currUserName})
      .then(user => {
        if (user) {
          const itemIndex = user.cart.findIndex(item => item.productId.toString() === itemId);
          if (itemIndex !== -1) {
            user.cart.splice(itemIndex, 1);
            return user.save();
          } else {
            throw new Error('Item not found in cart');
          }
        } else {
          throw new Error('User not found');
        }
      })
      .then(updatedUser => {
        console.log('Item deleted successfully:', updatedUser);
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error deleting item:', error);
        res.sendStatus(500);
      });
  });







  function calculateTotalAmount(orderItems) {
    let totalAmount = 0;
    orderItems.forEach((orderItem) => {
      const productPrice = orderItem.product.price;
      const quantity = orderItem.quantity;
      totalAmount += productPrice * quantity;
    });
    return totalAmount;
  }
  
  
  router.post('/checkout', async (req, res) => {
    try {
      const currUserName = req.body.username;
  
      const user = await User.findOne({ username: currUserName }).populate('cart.productId');
  
      if (user) {
          const orderItems = user.cart.map(cartItem => ({
          product: cartItem.productId,
          quantity: cartItem.quantity,
        }));
        
        const order = await Order.create({
          user: user._id,
          products: orderItems,
          totalAmount: calculateTotalAmount(orderItems),
        });
  
        user.cart = [];
        await user.save();
  
        user.orderHistory.push(order);
        await user.save();
  
        res.sendStatus(200);
      } else {
        console.log('User not found');
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      res.sendStatus(500);
    }
  });









module.exports = router;