const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const port = 3000;
const userId = '648597c62d69a1b4375d2953' ////////////
const config = require('./config')
const googleKey = config.googleKey


const {default:mongoose}= require("mongoose")
const Product = require('./models/product')
const User = require('./models/user')
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

app.get('/', (req, res) => {
    res.render('home', { title: 'Home',googleKey });
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

app.post('/cart/add/:productId', (req, res) => {
  const productId = req.params.productId;
  const quantity = req.body.quantity;
  
  
  
  // Add the product to the user's cart
  User.findById(userId)
    .then(user => {
      if (user) {
        // Check if the product already exists in the cart
        const existingProduct = user.cart.find(item => item.productId == productId);          
        if (existingProduct) {
          // If the product already exists, increase the quantity
          existingProduct.quantity += parseInt(quantity) ;
        } else {
          // If the product doesn't exist, add it to the cart
          user.cart.push({ productId, quantity });
          
        }
        
        return user.save();
      } else {
        throw new Error('User not found');
      }
    })
    .then(updatedUser => {
      // console.log('Product added to cart:', updatedUser);
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Error adding product to cart:', error);
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
  // gets info from addProduct form
})

// app.get('/btc-rate', (req, res) => {
//   const coinAPIKey = config.coinKey; 
  
//   axios
//     .get('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
//       headers: {
//         'X-CoinAPI-Key': coinAPIKey,
//       },
//     })
//     .then(response => {
//       const btcRate = response.data.rate;
//       // res.send(btcRate);
//       res.status(200).send(btcRate.toString());
//     })
//     .catch(error => {
//       console.log('Error:', error.message);
//       res.status(500).send('Error fetching BTC rate');
//     });
// });
app.get('/coin-rates', (req, res) => {
  const btcRatePromise = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const ethRatePromise = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const dogeRatePromise = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd');

  Promise.all([btcRatePromise, ethRatePromise, dogeRatePromise])
    .then(([btcResponse, ethResponse, dogeResponse]) => {
      const btcRate = btcResponse.data.bitcoin.usd;
      const ethRate = ethResponse.data.ethereum.usd;
      const dogeRate = dogeResponse.data.dogecoin.usd;

      const coinRates = {
        bitcoin: btcRate,
        ethereum: ethRate,
        doge:dogeRate
      };

      res.json(coinRates);
    })
    .catch(error => {
      console.log('Error:', error);
      res.status(500).send('Failed to fetch coin rates');
    });
});



// app.get('/cart', (req, res) => {
//   User.find({ username: 'user1' })
//   .then(user => {
//     if (user) {
//       // let cartItems = user[0].cart;
//       user = user[0];
//       let cartItems = []
//       for(let i = 0;i<user.cart.length;i++){
//         let currItem ={
//           product:Product.findById(user.cart[i]._id),
//           quantity:user.cart[i].quantity
//         }
//         cartItems.push(currItem)
//       }
//       console.log('cartItems:', cartItems);
      
//       res.render('cart', { title: 'Cart Page', user });
//     } else {
//       console.log('User not found');
//     }
//   })
//   .catch(error => {
//     console.error('Error fetching user:', error);
//   });
// });
app.get('/cart', async (req, res) => {
  try {
    const user = await User.findOne({ username: 'user1' });
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
      
      res.render('cart', { title: 'Cart Page', cartItems });
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
  User.findById(userId)
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
  User.findById(userId)
    .then(user => {
      if (user) {
        // Find the index of the item with the given itemId in the cart
        const itemIndex = user.cart.findIndex(item => item.productId.toString() === itemId);
        if (itemIndex !== -1) {
          // Remove the item from the cart
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
