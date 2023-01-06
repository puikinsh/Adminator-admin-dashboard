import * as $ from 'jquery';
import 'jvectormap';
import 'jvectormap/jquery-jvectormap.css';
import './jquery-jvectormap-world-mill.js';
import { debounce } from 'lodash';
import countries from './countries';

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

      $('#vmap').vectorMap({
        map: 'world_mill',
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderOpacity: 0.25,
        borderWidth: 0,
        color: '#e6e6e6',
        regionStyle: {
          initial: {
            fill: '#e4ecef',
          },
        },
        onRegionTipShow: (e, el, code) => {
          el.html(countries.find((c) => c.code == code).name_fa);
        },
        markerStyle: {
          initial: {
            r: 7,
            'fill': '#fff',
            'fill-opacity': 1,
            'stroke': '#000',
            'stroke-width': 2,
            'stroke-opacity': 0.4,
          },
        },

        markers: [
          {
            latLng: [21.0, 78.0],
            name: 'هند : ۳۵۰',
          },
          {
            latLng: [-33.0, 151.0],
            name: 'استرالیا : ۲۵۰',
          },
          {
            latLng: [36.77, -119.41],
            name: 'آمریکا : ۲۵۰',
          },
          {
            latLng: [55.37, -3.41],
            name: 'بریتانیا   : ۲۵۰',
          },
          {
            latLng: [25.2, 55.27],
            name: 'امارات متحده عربی : ۲۵۰',
          },
        ],
        series: {
          regions: [
            {
              values: {
                'US': 298,
                'SA': 200,
                'AU': 760,
                'IN': 200,
                'GB': 120,
              },
              scale: ['#03a9f3', '#02a7f1'],
              normalizeFunction: 'polynomial',
            },
          ],
        },
        hoverOpacity: null,
        normalizeFunction: 'linear',
        zoomOnScroll: false,
        scaleColors: ['#b6d6ff', '#005ace'],
        selectedColor: '#c9dfaf',
        selectedRegions: [],
        enableZoom: false,
        hoverColor: '#fff',
      });
    }
  };

  vectorMapInit();
  $(window).resize(debounce(vectorMapInit, 150));
})();
