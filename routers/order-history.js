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




// router.get('/', async (req, res) => {
//     try {
//       const currUserName = req.cookies.username;
//       if(!currUserName){
//         res.send('<h1>you must log in to visit this site</h1>')
//       }else{
//         if (currUserName ==='admin') {
//             const allOrders = await Order.find().populate('products.product');
//         let orders = [];

//         allOrders.forEach(order => {
//           const products = order.products.map(product => ({
//             _id: product.product._id,
//             name: product.product.name,
//             price: product.product.price,
//             quantity: product.quantity
//           }));
//           orders.push({
//             _id: order._id,
//             user: order.user,
//             products,
//             totalAmount: order.totalAmount,
//             orderDate: order.orderDate
//           });
//         });
//         const orderHistory = orders;

//         res.render('order-history', { title: 'Order History Page', orderHistory });
//         } else {
            
        
//       const user = await User.findOne({ username: currUserName });
//       if (user) {
//         const allOrders = await Order.find({user:user._id}).populate('products.product');
//         let orders = [];
        
//           allOrders.forEach(order => {            
//             const products = order.products.map(product => ({
//               _id: product.product._id,
//               name: product.product.name,
//               price: product.product.price,
//               quantity: product.quantity
//             }));
//             orders.push({
//               _id: order._id,
//               user: order.user,
//               products,
//               totalAmount: order.totalAmount,
//               orderDate: order.orderDate
//             });
//           });
//         const orderHistory = orders
    
//         res.render('order-history', { title: 'Order History Page', orderHistory });
//       } else {
//         console.log('User not found');
//       }
//     }
// }
//     } catch (error) {
//       console.error('Error fetching order history:', error);
//     }
//   });
  
  





router.get('/', async (req, res) => {
    try {
      const currUserName = req.cookies.username;
      if (!currUserName) {
        res.send('<h1>You must log in to visit this site</h1>');
      } else {
        if (currUserName === 'admin') {
        //   const allOrders = await Order.find().populate('user').populate('products.product')
        const allOrders = await Order.find();

        const populatedOrders = await Promise.all(
          allOrders.map(async (order) => {
            // Populate the user field
            const populatedUser = await User.findById(order.user);
        
            // Populate the products field
            const populatedProducts = await Promise.all(
              order.products.map(async (product) => {
                const populatedProduct = await Product.findById(product.product);
                return {
                  _id: populatedProduct._id,
                  name: populatedProduct.name,
                  price: populatedProduct.price,
                  quantity: product.quantity
                };
              })
            );
        
            // Return the populated order
            return {
              _id: order._id,
              user: populatedUser.username, // Show the username of the user who made the order
              products: populatedProducts,
              totalAmount: order.totalAmount,
              orderDate: order.orderDate
            };
          })
        );
        
        const orderHistory = populatedOrders;
        
        res.render('order-history', { title: 'Order History Page', orderHistory,isAdmin:true });
        
        } else {
          const user = await User.findOne({ username: currUserName });
          if (user) {
            const allOrders = await Order.find({ user: user._id }).populate('products.product');
            let orders = [];
  
            allOrders.forEach(order => {
              const products = order.products.map(product => ({
                _id: product.product._id,
                name: product.product.name,
                price: product.product.price,
                quantity: product.quantity
              }));
              orders.push({
                _id: order._id,
                user: order.user,
                products,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate
              });
            });
            const orderHistory = orders;
  
            res.render('order-history', { title: 'Order History Page', orderHistory,isAdmin:false });
          } else {
            console.log('User not found');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  });
  



module.exports = router