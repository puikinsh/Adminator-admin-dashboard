import loadGoogleMapsAPI  from 'load-google-maps-api';
import Theme from '../utils/theme.js';

export default (function () {
  let map, marker;
  
  const initGoogleMap = () => {
    const googleMapElement = document.getElementById('google-map');
    if (googleMapElement) {
      loadGoogleMapsAPI({
        key: 'AIzaSyDW8td30_gj6sGXjiMU0ALeMu1SDEwUnEA',
      }).then(() => {
        const latitude  = 26.8206;
        const longitude = 30.8025;
        const mapZoom   = 5;
        const { google }    = window;

        const mapOptions = {
          center    : new google.maps.LatLng(latitude, longitude),
          zoom      : mapZoom,
          mapTypeId : google.maps.MapTypeId.ROADMAP,
          styles: [{
            'featureType': 'landscape',
            'stylers': [
              { 'hue'        : Theme.getCSSVar('--gmap-landscape-hue') },
              { 'saturation' : 43.400000000000006 },
              { 'lightness'  : 37.599999999999994 },
              { 'gamma'      : 1 },
            ],
          }, {
            'featureType': 'road.highway',
            'stylers': [
              { 'hue'        : Theme.getCSSVar('--gmap-highway-hue') },
              { 'saturation' : -61.8 },
              { 'lightness'  : 45.599999999999994 },
              { 'gamma'      : 1 },
            ],
          }, {
            'featureType': 'road.arterial',
            'stylers': [
              { 'hue'        : Theme.getCSSVar('--gmap-road-hue') },
              { 'saturation' : -100 },
              { 'lightness'  : 51.19999999999999 },
              { 'gamma'      : 1 },
            ],
          }, {
            'featureType': 'road.local',
            'stylers': [
              { 'hue'        : Theme.getCSSVar('--gmap-road-hue') },
              { 'saturation' : -100 },
              { 'lightness'  : 52 },
              { 'gamma'      : 1 },
            ],
          }, {
            'featureType': 'water',
            'stylers': [
              { 'hue'        : Theme.getCSSVar('--gmap-water-hue') },
              { 'saturation' : -13.200000000000003 },
              { 'lightness'  : 2.4000000000000057 },
              { 'gamma'      : 1 },
            ],
          }, {
            'featureType': 'poi',
            'stylers': [
              { 'hue'        : Theme.getCSSVar('--gmap-poi-hue') },
              { 'saturation' : -1.0989010989011234 },
              { 'lightness'  : 11.200000000000017 },
              { 'gamma'      : 1 },
            ],
          }],
        };

        map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

        if (marker) {
          marker.setMap(null);
        }

        marker = new google.maps.Marker({
          map,
          position : new google.maps.LatLng(latitude, longitude),
          visible  : true,
        });
      });
    }
  };
  
  // Initialize Google Maps
  initGoogleMap();
  
  // Listen for theme changes
  window.addEventListener('adminator:themeChanged', initGoogleMap);
}())
