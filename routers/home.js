const express = require('express');
const app = express();
const router = express.Router()
const axios = require('axios');
const config = require('../config')
const googleKey = config.googleKey
const Location = require('../models/location')



router.get('/', (req, res) => {
    const currUserName = req.cookies.username;
    let ifAdmin = false;
    if(currUserName=='admin'){
      ifAdmin= true
    }
    if(!currUserName){
      res.send('<h1>you must log in to visit this site</h1>')
    }else{
      res.render('home', { title: 'Home',googleKey,currUserName,ifAdmin});
    }
    });






    router.get('/coin-rates', (req, res) => {
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
                change_24h: coin.price_change_percentage_24h,
                image:coin.image
              };
            });
      
            const coinRates = {};
            coinData.forEach(coin => {
              coinRates[coin.id] = {
                rate: coin.rate,
                symbol: coin.symbol,
                volume_24h: coin.volume_24h,
                change_24h: coin.change_24h,
                image:coin.image
              };
            });
                        
            res.json(coinRates);
          })
      
         
      
          .catch(error => {
            console.log('Error:', error);
            res.status(500).send('Failed to fetch coin rates');
          });
      
    });
      
      router.post('/create-post', async (req, res) => {
        const pageAccessToken = config.FBkey;
        const pageId = '112159501922363';
        const message = req.body.message; // Assuming the client sends the message in the request body
      
        try {
          const url = `https://graph.facebook.com/${pageId}/feed`;
          const params = {
            message: message,
            access_token: pageAccessToken,
          };
      
          const response = await axios.post(url, params);
      
          if (response.status === 200) {
            const postId = response.data.id;
            console.log('Text post created successfully!');
            console.log('Post ID:', postId);
            res.status(200).json({ success: true, postId: postId });
          } else {
            const errorMessage = response.data.error.message;
            console.log('Error creating text post:', errorMessage);
            res.status(400).json({ success: false, error: errorMessage });
          }
        } catch (error) {
          console.log('An error occurred:', error.message);
          res.status(500).json({ success: false, error: 'An error occurred' });
        }
      });




module.exports = router;


