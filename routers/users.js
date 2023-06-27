
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

router.get('/', (req, res) => {
    const currUserName = req.cookies.username
    let ifAdmin = false;
    if(currUserName=='admin'){
      ifAdmin= true
    }
    if(!currUserName){
      res.send('<h1>you must log in to visit this site</h1>')
    }else{
      User.find()
      .then(users => {
        res.render('users', { title: 'users Page',users,ifAdmin });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const currid = req.params.id;
      // Delete the user
      const userDeleteResult = await User.deleteOne({ _id:currid });
  
      if (userDeleteResult.deletedCount !== 1) {
        throw new Error('User not found');
      }
  
      // Delete user's orders
      const orderDeleteResult = await Order.deleteMany({ user: currid });
      console.log(`${orderDeleteResult.deletedCount} orders deleted successfully.`);
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting user and orders:', error);
      res.sendStatus(500);
    }
  });
  






module.exports = router;