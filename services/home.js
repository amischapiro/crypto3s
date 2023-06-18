
const config = require('../config')
const apiKey =  config.coinKey
const baseUrl = 'https://rest.coinapi.io/v1';

async function fetchExchangeRate(assetIdBase, assetIdQuote) {
    const currentRateUrl = `${baseUrl}/exchangerate/${assetIdBase}/${assetIdQuote}`;
    const twentyFourHourChangeUrl = `${baseUrl}/ohlcv/${assetIdBase}/${assetIdQuote}/history?period_id=1DAY&limit=2`;
    const sixMonthChangeUrl = `${baseUrl}/ohlcv/${assetIdBase}/${assetIdQuote}/history?period_id=1MTH&limit=2`;
  
    // Set headers with API key
    const headers = {
      'X-CoinAPI-Key': apiKey
    };
  
    try {
      // Make API requests concurrently
      const [currentRateResponse, twentyFourHourChangeResponse, sixMonthChangeResponse] = await Promise.all([
        axios.get(currentRateUrl, { headers }),
        axios.get(twentyFourHourChangeUrl, { headers }),
        axios.get(sixMonthChangeUrl, { headers })
      ]);
  
      // Extract relevant data from the API responses
      const currentRate = currentRateResponse.data.rate;
      const twentyFourHourChange = calculateChange(twentyFourHourChangeResponse.data);
      const sixMonthChange = calculateChange(sixMonthChangeResponse.data);
  
      // Output the results
      console.log('Current Rate:', currentRate);
      console.log('24-Hour Change:', twentyFourHourChange);
      console.log('6-Month Change:', sixMonthChange);
    } catch (error) {
        console.error('Error:', error.message);
    }
  }
  
  // Helper function to calculate the percentage change
  function calculateChange(data) {
    const firstValue = data[0].price_close;
    const lastValue = data[1].price_close;
    const change = lastValue - firstValue;
    const percentageChange = (change / firstValue) * 100;
    return percentageChange.toFixed(2);
  }

  module.exports = fetchExchangeRate
