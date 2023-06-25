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
    let isusername = false
    let isuserpassword = false
    res.render('login', { title: 'Login Page',isusername,isuserpassword });
  });

  
router.post('/',async (req, res) => {
    const { username, password } = req.body;
    let issignup;
    let isusername;
    let isuserpassword;
    try {
      const foundUser = await User.findOne({ username: username,password: password});
      if (foundUser)
       {
        issignup = true;
        // currUserName = foundUser.username
        res.cookie('username',foundUser.username);
        res.redirect('/');
       }
       else
     {
        const foundUserName = await User.findOne({ username: username });
       if (!foundUserName)
      {
        isusername = true;
        res.render('login', { title: 'login Page', isusername,username,isuserpassword });
      }
      else 
      {
        isuserpassword = true;
        res.render('login', { title: 'login Page', isuserpassword,username,isusername });
      }
     } 
     }
    catch (error) {
      console.error(error);
      res.redirect('/error');
    }
  });





module.exports = router