// Code copied from: https://developers.google.com/maps/documentation/javascript/adding-a-google-map#maps_add_map-javascript
// Initialize and add the map
function initializeMap() {
  // The location of Xin Chao Coffee
  const xinChaoCoordinates = { lat: 51.07246, long: -113.98987 },
    // The map, centered at Xin Chao Coffee
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: xinChaoCoordinates,
    }),
    // The marker, positioned at Uluru
    marker = new google.maps.Marker({
      position: xinChaoCoordinates,
      map: map,
    })
}

window.initializeMap = initializeMap
