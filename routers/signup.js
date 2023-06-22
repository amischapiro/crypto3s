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
    let isuser = false
    res.render('signup', { title: 'signup Page',isuser});
  });


  router.post('/', async (req, res) => {
    const { username, password } = req.body;
    let isuser;
    try {
      const foundUser = await User.findOne({ username: username });
  
      if (foundUser) {
        isuser = true;
        res.render('signup', { title: 'signup Page', isuser,username });
      } else {
        const newUser = new User({
          username: username,
          password: password
        });
        await newUser.save();
        res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
      res.redirect('/error');
    }
  });


module.exports = router