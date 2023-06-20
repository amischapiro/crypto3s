const express = require('express');
const app = express();
const axios = require('axios');
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 3000;
const config = require('./config')
const coinFetch = require('./services/home')
const googleKey = config.googleKey
let userId;
const {default:mongoose}= require("mongoose")
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

// io.on('connection', (socket) => {
//   console.log('A user connected');


//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  const currUserName = req.cookies.currUserName;
    res.render('home', { title: 'Home',googleKey,currUserName});
  });
app.get('/login', (req, res) => {
  let isusername = false
  let isuserpassword = false
  res.render('login', { title: 'Login Page',isusername,isuserpassword });
});
app.get('/signup', (req, res) => {
  let isuser = false
  res.render('signup', { title: 'signup Page',isuser});
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

app.post('/cart/add/:productId', (req, res) => {
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

app.delete('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  Product.deleteOne({ _id: productId })
    .then(result => {
      if (result.deletedCount === 1) {
        console.log('Product deleted successfully');
        res.sendStatus(200);
      } else {
        throw new Error('Product not found');
      }
    })
    .catch(error => {
      console.error('Error deleting product:', error);
      res.sendStatus(500);
    });
});

app.post('/products', (req, res) => {
  const { name,description, symbol, price, change, volume } = req.body;
  const newProduct = new Product({
    name: name,
    description:description,
    symbol: symbol,
    price: price,
    change: change,
    volume: volume
  });
  newProduct.save()
    .then(savedProduct => {
      console.log('Product created successfully:', savedProduct);
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Error creating product:', error);
      res.sendStatus(500);
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
})



app.get('/coin-rates', (req, res) => {
  const coins = ['bitcoin', 'ethereum', 'dogecoin', 'solana', 'binancecoin', 'cardano', 'ripple', 'shiba-inu', 'tron', 'stellar'];
  const vsCurrency = 'usd';
  
  const url = `https://api.coingecko.com/api/v3/coins/markets?ids=${coins.join(',')}&vs_currency=${vsCurrency}&include_24hr_change=true`;

  axios.get(url)
    .then(response => {
      const coinData = response.data.map(coin => {
        return {
          id: coin.id,
          symbol: coin.symbol,
          rate: coin.current_price,
          volume_24h: coin.total_volume,
          change_24h: coin.price_change_percentage_24h
        };
      });

      const coinRates = {};
      coinData.forEach(coin => {
        coinRates[coin.id] = {
          rate: coin.rate,
          symbol: coin.symbol,
          volume_24h: coin.volume_24h,
          change_24h: coin.change_24h
        };
      });

      // io.emit('coinRates', coinRates);
      res.json(coinRates);
    })

   

    .catch(error => {
      console.log('Error:', error);
      res.status(500).send('Failed to fetch coin rates');
    });

});


app.get('/cart', async (req, res) => {
  try {
    
    const currUserName = req.cookies.username    
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
  } catch (error) {
    console.error('Error fetching user:', error);
  }
});

app.put('/cart/:itemId', (req, res) => {
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


app.delete('/cart/:itemId', (req, res) => {
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


app.post('/checkout', async (req, res) => {
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







app.get('/order-history', async (req, res) => {
  try {
    const currUserName = req.cookies.username;
    const user = await User.findOne({ username: currUserName });
    if (user) {
      const allOrders = await Order.find({user:user._id}).populate('products.product');
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
      const orderHistory = orders

      res.render('order-history', { title: 'Order History Page', orderHistory });
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error fetching order history:', error);
  }
});




app.post('/login',async (req, res) => {
      const { username, password } = req.body;
      let issignup;
      let isusername;
      let isuserpassword;
      try {
        const foundUser = await User.findOne({ username: username,password: password});
        if (foundUser)
         {
          issignup = true;
          userId = foundUser._id
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



  app.post('/signup', async (req, res) => {
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


  app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/login');
  });
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
