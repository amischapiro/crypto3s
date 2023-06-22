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