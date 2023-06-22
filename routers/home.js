const express = require('express');
const app = express();
const router = express.Router()
const axios = require('axios');
const config = require('../config')
const googleKey = config.googleKey


router.get('/', (req, res) => {
    const currUserName = req.cookies.username;
    if(!currUserName){
      res.send('<h1>you must log in to visit this site</h1>')
    }else{
      res.render('home', { title: 'Home',googleKey,currUserName});
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
      
            res.json(coinRates);
          })
      
         
      
          .catch(error => {
            console.log('Error:', error);
            res.status(500).send('Failed to fetch coin rates');
          });
      
      });

module.exports = router;


