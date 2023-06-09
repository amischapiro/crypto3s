const express = require('express');
const app = express();
const port = 3000; 

const {default:mongoose}= require("mongoose")
const Product = require('./models/product')
mongoose.connect('mongodb+srv://royschwartz:Aa123456@crypto.tcprfjj.mongodb.net/crypto?retryWrites=true&w=majority')
.then(()=>{
  console.log("mongo is connected");
}).catch(err=>{
  console.log("no connection",err);
})


app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
  });
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login Page' });
});

app.get('/products', (req, res) => {
  Product.find()
  .then(products => {
    res.render('products', { title: 'Products Page',products });
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
});
app.get('/addProduct', (req, res) => {
  Product.find()
  .then(products => {
    res.render('addProduct', { title: 'addProducts Page',products });
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
});
app.get('/product-info/:productId', (req, res) => {
    const productId = req.params.productId;
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
  

});
app.post('/addProduct',(req,res)=>{
  console.log(req.body);
  // gets info from addProduct form
})

app.get('/cart', (req, res) => {
  res.render('cart', { title: 'Cart Page' });
});

app.get('/order-history', (req, res) => {
  res.render('order-history', { title: 'Order History Page' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123') {
      res.redirect('/products');
    } else {
      res.render('login', { title: 'Login Page', error: 'Invalid credentials' });
    }
  });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
