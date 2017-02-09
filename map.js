const ZOOM_LEVEL_TO_PROPERTY = 15;
const DEFAULT_MAP_ZOOM = 8;
let wixCodeInitialized = false;

let map;
let markers = [];

window.onmessage = (event) => {
  wixCodeInitialized = true;
  removeMarkers();
  if (event.data.properties) {
    event.data.properties.forEach((property) => {
      addMarker(property);
    });
  }
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
    console.log(property);
  });
  markers.push(marker);
  zoomToAllProperties();
}

function zoomToProperty(property) {
  map.panTo({lat: property.lat, lng: property.lng});
  map.setZoom(ZOOM_LEVEL_TO_PROPERTY);
}

function zoomToAllProperties() {
  let bounds = new google.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(marker.getPosition());
  });
  map.fitBounds(bounds);
}

function removeMarkers() {
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}

function getTooltip(property) {
  const content = `<div>${property.area}</div>`;
  return new google.maps.InfoWindow({
    content
  });
}

function notifyWixCodeAboutLoad() {
  if (!wixCodeInitialized) {
    setTimeout(() => {
      console.log('labas');
      !wixCodeInitialized && window.parent.postMessage('MAP_LOADED', '*') && notifyWixCodeAboutLoad();
    }, 500);
  }
}

function initMap() {
  let styledMapType = new google.maps.StyledMapType(mapStyle, 'greyMap');

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 54.397, lng: 25.644},
    scrollwheel: false,
    zoom: DEFAULT_MAP_ZOOM,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        'greyMap']
    }
  });
  map.mapTypes.set('greyMap', styledMapType);
  map.setMapTypeId('greyMap');
  notifyWixCodeAboutLoad();
}

let mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];
