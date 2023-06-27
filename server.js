const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 3000;
const config = require('./config')
const googleKey = config.googleKey
const {default:mongoose}= require("mongoose")
const { Query } = require('mongoose');
const Product = require('./models/product')
const User = require('./models/user')
const Order = require('./models/order')
const mongoKey = config.mongoKey
mongoose.connect(mongoKey)
.then(()=>{
  console.log("mongo is connected");
}).catch(err=>{
  console.log("no connection",err);
})


app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


const homeRoutes = require('./routers/home')
app.use('/',homeRoutes);

const productsRoutes = require('./routers/products')
app.use('/products',productsRoutes);

const cartRoutes = require('./routers/cart')
app.use('/cart',cartRoutes);

const loginRoutes = require('./routers/login')
app.use('/login',loginRoutes);

const signupRoutes = require('./routers/signup')
app.use('/signup',signupRoutes);

const orderHistoryRoutes = require('./routers/order-history')
app.use('/order-history',orderHistoryRoutes);

const logoutRoutes = require('./routers/logout')
app.use('/logout',logoutRoutes);

const productInfoRoutes = require('./routers/product-info')
app.use('/product-info',productInfoRoutes);

const usersRoutes = require('./routers/users')
app.use('/users',usersRoutes);



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
