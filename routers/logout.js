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
    res.clearCookie('username');
    res.redirect('/login');
  });
  


module.exports = router