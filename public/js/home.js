$(document).ready(function () {
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
    let coinSymbol = coin.symbol;
    let coinPrice = coin.rate
    if(coin.rate<1){
      coinPrice = parseFloat(coin.rate).toFixed(8)
    }else{
      coinPrice = parseInt(coin.rate).toLocaleString();
    }
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



let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const response = await fetch("/locations");
  const locations = await response.json();
  console.log('locations:', locations);
  

  map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: locations[0],
    mapId: "DEMO_MAP_ID",
  });

  locations.forEach(location => {
    const marker = new AdvancedMarkerElement({
      map: map,
      position: location,
      title: location.title,
    });
    const infoWindow = new google.maps.InfoWindow({
      content: location.title,
    });
    infoWindow.open(map, marker);
  });
}

initMap();



function createTextPost() {
  const message = document.getElementById('fb-msg').value; 
  if(!message){
    return
  }
  fetch('/create-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: message }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Text post created successfully!');
        console.log('Post ID:', data.postId);
      } else {
        console.log('Error creating text post:', data.error);
      }
    })
    .catch(error => {
      console.log('An error occurred:', error.message);
    });
}