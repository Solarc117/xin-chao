// Code copied from: https://developers.google.com/maps/documentation/javascript/adding-a-google-map#maps_add_map-javascript
function initMap() {
  const xinChaoCoordinates = { lat: 51.07246, lng: -113.98987 },
    // @ts-ignore
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: xinChaoCoordinates,
    }),
    // @ts-ignore
    marker = new google.maps.Marker({
      position: xinChaoCoordinates,
      map,
    })
}

window.initMap = initMap
