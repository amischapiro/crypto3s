$(document).ready(function () {
  const currUserName = getCookie('currUserName');
  $('#curr-user-name').text(currUserName);
  fetchCoinData();
  setInterval(fetchCoinData,10000)
});

function getCookie(name) {
  const cookies = document.cookie
  let k;
  for(let i =0;i<cookies.length;i++){
    if(cookies[i]=='='){
      k=i;
    }
  }
  let curr = cookies.slice(k+1,cookies.length)
  return curr;
}

function updateTableData(coinData) {
    coinData.forEach(coin => { 
    const coinSymbol = coin.symbol;
    const coinPrice = parseFloat(coin.rate).toFixed(2).toLocaleString();
    const coinChange = coin.change_24h.toFixed(2);
    const coinVolume = coin.volume_24h.toLocaleString();

    // Update table data for each coin
    $('#' + coinSymbol + '-sym').text(coinSymbol);
    $('#' + coinSymbol + '-rate').text('$' + coinPrice);
    $('#' + coinSymbol + '-vol').text('$' + coinVolume);

    // Update change percentage and color
    const changeElement = $('#' + coinSymbol + '-change');
    if (coinChange > 0) {
      changeElement.css('color', 'green');
      changeElement.text('+' + coinChange + '%');
    } else {
      changeElement.css('color', 'red');
      changeElement.text(coinChange + '%');
    }
  });
}

function fetchCoinData() {  
  $.ajax({
    url: '/coin-rates',
    method: 'GET',
    success: function (response) {
      const coinData = Object.values(response);
      
      updateTableData(coinData);
    },
    error: function (error) {
      console.log('Error:', error);
    }
  });
}







// $(document).ready(function() {
//   var socket = io();

//   socket.on('coinRates', function(coinRates) {
//     updateCoinRates(coinRates);
//   });

//   // Socket event: disconnect
//   socket.on('disconnect', function() {
//     console.log('Disconnected from server');
//   });

//   function updateCoinRates(coinRates) {
//     const coins = coinRates; 
//     const btcSym = coins.bitcoin.symbol;
//     const ethSym = coins.ethereum.symbol;
//     const dogSym = coins.dogecoin.symbol;
//     const solSym = coins.solana.symbol;
//     const bnbSym = coins.binancecoin.symbol;
//     const adaSym = coins.cardano.symbol;
//     const xrpSym = coins.ripple.symbol;
      
//     const btcPrice = parseFloat(coins.bitcoin.rate).toFixed(2).toLocaleString();
//     const ethPrice = parseFloat(coins.ethereum.rate).toFixed(2).toLocaleString();
//     const dogPrice = parseFloat(coins.dogecoin.rate).toFixed(2).toLocaleString();
//     const solPrice = parseFloat(coins.solana.rate).toFixed(2).toLocaleString();
//     const bnbPrice = parseFloat(coins.binancecoin.rate).toFixed(2).toLocaleString();
//     const adaPrice = parseFloat(coins.cardano.rate).toFixed(2).toLocaleString();
//     const xrpPrice = parseFloat(coins.ripple.rate).toFixed(2).toLocaleString();
      
//     const btcChange = coins.bitcoin.change_24h.toFixed(2);
//     const ethChange = coins.ethereum.change_24h.toFixed(2);
//     const dogChange = coins.dogecoin.change_24h.toFixed(2);
//     const solChange = coins.solana.change_24h.toFixed(2);
//     const bnbChange = coins.binancecoin.change_24h.toFixed(2);
//     const adaChange = coins.cardano.change_24h.toFixed(2);
//     const xrpChange = coins.ripple.change_24h.toFixed(2);
      
//     const btcVol = coins.bitcoin.volume_24h.toLocaleString();
//     const ethVol = coins.ethereum.volume_24h.toLocaleString();
//     const dogVol = coins.dogecoin.volume_24h.toLocaleString();
//     const solVol = coins.solana.volume_24h.toLocaleString();
//     const bnbVol = coins.binancecoin.volume_24h.toLocaleString();
//     const adaVol = coins.cardano.volume_24h.toLocaleString();
//     const xrpVol = coins.ripple.volume_24h.toLocaleString();
      
//     $('#btc-sym').text(btcSym);
//     $('#eth-sym').text(ethSym);
//     $('#dog-sym').text(dogSym);
//     $('#sol-sym').text(solSym);
//     $('#bnb-sym').text(bnbSym);
//     $('#ada-sym').text(adaSym);
//     $('#xrp-sym').text(xrpSym);
      
//     $('#btc-rate').text('$' + btcPrice);
//     $('#eth-rate').text('$' + ethPrice);
//     $('#dog-rate').text('$' + dogPrice);
//     $('#sol-rate').text('$' + solPrice);
//     $('#bnb-rate').text('$' + bnbPrice);
//     $('#ada-rate').text('$' + adaPrice);
//     $('#xrp-rate').text('$' + xrpPrice);
      
//     $('#btc-vol').text('$' + btcVol);
//     $('#eth-vol').text('$' + ethVol);
//     $('#dog-vol').text('$' + dogVol);
//     $('#sol-vol').text('$' + solVol);
//     $('#bnb-vol').text('$' + bnbVol);
//     $('#ada-vol').text('$' + adaVol);
//     $('#xrp-vol').text('$' + xrpVol);
      
//     if (btcChange > 0) {
//       $('#btc-change').text('+' + btcChange + '%');
//       $('#btc-change').css('color', 'green');
//     } else {
//       $('#btc-change').css('color', 'red');
//       $('#btc-change').text(btcChange + '%');
//     }
      
//     if (ethChange > 0) {
//       $('#eth-change').css('color', 'green');
//       $('#eth-change').text('+' + ethChange + '%');
//     } else {
//       $('#eth-change').css('color', 'red');
//       $('#eth-change').text(ethChange + '%');
//     }
      
//     if (dogChange > 0) {
//       $('#dog-change').css('color', 'green');
//       $('#dog-change').text('+' + dogChange + '%');
//     } else {
//       $('#dog-change').css('color', 'red');
//       $('#dog-change').text(dogChange + '%');
//     }
      
//     if (solChange > 0) {
//       $('#sol-change').css('color', 'green');
//       $('#sol-change').text('+' + solChange + '%');
//     } else {
//       $('#sol-change').css('color', 'red');
//       $('#sol-change').text(solChange + '%');
//     }
      
//     if (bnbChange > 0) {
//       $('#bnb-change').css('color', 'green');
//       $('#bnb-change').text('+' + bnbChange + '%');
//     } else {
//       $('#bnb-change').css('color', 'red');
//       $('#bnb-change').text(bnbChange + '%');
//     }
      
//     if (adaChange > 0) {
//       $('#ada-change').css('color', 'green');
//       $('#ada-change').text('+' + adaChange + '%');
//     } else {
//       $('#ada-change').css('color', 'red');
//       $('#ada-change').text(adaChange + '%');
//     }
      
//     if (xrpChange > 0) {
//       $('#xrp-change').css('color', 'green');
//       $('#xrp-change').text('+' + xrpChange + '%');
//     } else {
//       $('#xrp-change').css('color', 'red');
//       $('#xrp-change').text(xrpChange + '%');
//     }
//   }

//   $.ajax({
//     url: '/coin-rates',
//     method: 'GET',
//     success: function(response) {
//       updateCoinRates(response);
//     },
//     error: function(error) {
//       console.log('Error:', error);
//     }
//   });
// });






let map;
  
async function initMap() {
  const position = { lat: 32.467151, lng: 34.952718 };
  const position2 = { lat: 32.059327, lng: 34.827765 };
  const position3 = { lat: 32.136827, lng: 34.898346 };
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  const marker1 = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Ami-home",
  });
  const marker2 = new AdvancedMarkerElement({
    map: map,
    position: position2,
    title: "Roy-home",
  });
  const marker3 = new AdvancedMarkerElement({
    map: map,
    position: position3,
    title: "Shaked-home",
  });
  const infoWindow1 = new google.maps.InfoWindow({
    content: "Ami's home",
  });

  const infoWindow2 = new google.maps.InfoWindow({
    content: "Roy's home",
  });
  const infoWindow3 = new google.maps.InfoWindow({
    content: "Shaked's home",
  });

  infoWindow1.open(map, marker1);
  infoWindow2.open(map, marker2);
  infoWindow3.open(map, marker3);
  
}

initMap();