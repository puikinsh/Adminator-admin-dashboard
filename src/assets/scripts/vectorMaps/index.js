import * as $ from 'jquery';
import 'jvectormap';
import 'jvectormap/jquery-jvectormap.css';
import './jquery-jvectormap-world-mill.js';
import { debounce } from 'lodash';
import Theme from '../utils/theme.js';

export default (function () {
  const vectorMapInit = () => {
    if ($('#world-map-marker').length > 0) {
      // This is a hack, as the .empty() did not do the work
      $('#vmap').remove();

      // we recreate (after removing it) the container div, to reset all the data of the map
      $('#world-map-marker').append(`
        <div
          id="vmap"
          style="
            height: 490px;
            position: relative;
            overflow: hidden;
            background-color: transparent;
          "
        >
        </div>
      `);

      // Get current theme colors
      const colors = Theme.getVectorMapColors();

      $('#vmap').vectorMap({
        map: 'world_mill',
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderOpacity: 0.25,
        borderWidth: 0,
        color: colors.regionColor,
        regionStyle : {
          initial : {
            fill : colors.regionColor,
          },
        },

        markerStyle: {
          initial: {
            r: 7,
            'fill': colors.markerFill,
            'fill-opacity':1,
            'stroke': colors.markerStroke,
            'stroke-width' : 2,
            'stroke-opacity': 0.4,
          },
        },

        markers : [{
          latLng : [21.00, 78.00],
          name : 'INDIA : 350',
        }, {
          latLng : [-33.00, 151.00],
          name : 'Australia : 250',
        }, {
          latLng : [36.77, -119.41],
          name : 'USA : 250',
        }, {
          latLng : [55.37, -3.41],
          name : 'UK   : 250',
        }, {
          latLng : [25.20, 55.27],
          name : 'UAE : 250',
        }],
        series: {
          regions: [{
            values: {
              'US': 298,
              'SA': 200,
              'AU': 760,
              'IN': 200,
              'GB': 120,
            },
            scale: [colors.scaleStart, colors.scaleEnd],
            normalizeFunction: 'polynomial',
          }],
        },
        hoverOpacity: null,
        normalizeFunction: 'linear',
        zoomOnScroll: false,
        scaleColors: [colors.scaleLight, colors.scaleDark],
        selectedColor: colors.selectedColor,
        selectedRegions: [],
        enableZoom: false,
        hoverColor: colors.hoverColor,
      });
    }
  };

  vectorMapInit();
  $(window).resize(debounce(vectorMapInit, 150));
  
  // Listen for theme changes and reinitialize the vector map
  window.addEventListener('adminator:themeChanged', debounce(vectorMapInit, 150));
})();
