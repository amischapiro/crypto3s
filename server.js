const express = require('express');
const app = express();
const port = 3000; 

const products = [
    { id:1,name: 'Product 1', description: 'Description 1', price: 10 },
    { id:2,name: 'Product 2', description: 'Description 2', price: 20 },
    { id:3,name: 'Product 3', description: 'Description 3', price: 30 },
    { id:4,name: 'Product 4', description: 'Description 4', price: 40 },
    { id:5,name: 'Product 5', description: 'Description 5', price: 50 },
];

app.set('view engine', 'ejs');

// app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
  });
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login Page' });
});

app.get('/products', (req, res) => {
  res.render('products', { title: 'Products Page',products });
});
app.get('/product-info/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = products.find((p) => p.id == productId);
  res.render('product-info', { title: 'Product Info Page',product});
});

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
