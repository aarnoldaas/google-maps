let map;
let tooltips;
let markers = [];

window.onmessage = (event = {data: {properties: [{lat: 54, lng: 25, description: 'Description 1'}, {lat: 54.5, lng: 25.5, description: 'Description 2'}]}}) => {
  event.data.properties.forEach((property) => {
    addMarker(property);
  });
};

function addMarker(property) {
  let marker  = new google.maps.Marker({
    position: { lat: property.lat, lng: property.lng },
    map,
    title: property.title
  });
  let tooltip = getTooltip(property);
  google.maps.event.addListener(marker, 'mouseover', () => {
    tooltip.open(map, marker);
  });
  google.maps.event.addListener(marker, 'mouseout', () => {
    tooltip.close(map, marker);
  });
  google.maps.event.addListener(marker, 'click', () => {
    window.parent.postMessage('Message');
  });
  markers.push(marker);
}

function removeMarkers() {
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}

function getTooltip(property) {
  const content = `<div id="tooltip-content" class="red-background">${property.description}</div>`;
  return new google.maps.InfoWindow({
    content
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 54.397, lng: 25.644},
    scrollwheel: true,
    zoom: 8
  });
  onmessage();
}
