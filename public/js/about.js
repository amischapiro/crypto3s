
let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const response = await fetch("/about/locations");
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
