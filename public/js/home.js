
// Initialize and add the map
$(document).ready(function() {
    $.ajax({
      url: '/coin-rates',
      method: 'GET',
      success: function(response) {
        const btcPrice = response.bitcoin.toFixed(2);
        const ethPrice = response.ethereum.toFixed(2);
        const dogPrice = response.doge.toFixed(2);
        $('#btc-rate').text('$'+btcPrice);
        $('#eth-rate').text('$'+ethPrice);
        $('#dog-rate').text('$'+dogPrice);
      },
      error: function(error) {
        console.log('Error:', error);
      }
    });
  });
  


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