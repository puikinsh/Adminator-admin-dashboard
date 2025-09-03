import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/jsvectormap.css';
import 'jsvectormap/dist/maps/world.js';
import { debounce } from 'lodash';
import Theme from '../utils/theme.js';

export default (function () {
  
  // Store map instance for cleanup
  let mapInstance = null;
  
  // Main initialization function
  const vectorMapInit = () => {
    const worldMapContainer = document.getElementById('world-map-marker');
    if (!worldMapContainer) return;
    
    // Remove existing map
    const existingMap = document.getElementById('vmap');
    if (existingMap) {
      existingMap.remove();
    }
    
    // Destroy existing map instance
    if (mapInstance) {
      try {
        mapInstance.destroy();
      } catch {
        // Map instance cleanup
      }
      mapInstance = null;
    }
    
    // Get current theme colors - using template colors directly
    const isDark = Theme.current() === 'dark';
    const colors = {
      backgroundColor: isDark ? '#313644' : '#f9fafb',
      regionColor: isDark ? '#565a5c' : '#e6eaf0',
      borderColor: isDark ? '#72777a' : '#d3d9e3',
      hoverColor: isDark ? '#7774e7' : '#0f9aee',
      selectedColor: isDark ? '#37c936' : '#7774e7',
      markerFill: isDark ? '#0f9aee' : '#7774e7',
      markerStroke: isDark ? '#37c936' : '#0f9aee',
      scaleStart: isDark ? '#b9c2d0' : '#e6eaf0',
      scaleEnd: isDark ? '#0f9aee' : '#007bff',
      textColor: isDark ? '#99abb4' : '#72777a',
    };
    
    // Create new map container
    const mapContainer = document.createElement('div');
    mapContainer.id = 'vmap';
    mapContainer.style.height = '490px';
    mapContainer.style.position = 'relative';
    mapContainer.style.overflow = 'hidden';
    mapContainer.style.backgroundColor = colors.backgroundColor;
    mapContainer.style.borderRadius = '8px';
    mapContainer.style.border = `1px solid ${colors.borderColor}`;
    
    worldMapContainer.appendChild(mapContainer);
    
    // Initialize JSVectorMap
    try {
      mapInstance = jsVectorMap({
        selector: '#vmap',
        map: 'world',
        
        // Styling options
        backgroundColor: 'transparent',
        
        // Region styling
        regionStyle: {
          initial: {
            fill: colors.regionColor,
            stroke: colors.borderColor,
            'stroke-width': 1,
            'stroke-opacity': 0.4,
          },
          hover: {
            fill: colors.hoverColor,
            cursor: 'pointer',
          },
          selected: {
            fill: colors.selectedColor,
          },
        },
        
        // Marker styling
        markerStyle: {
          initial: {
            r: 7,
            fill: colors.markerFill,
            stroke: colors.markerStroke,
            'stroke-width': 2,
            'stroke-opacity': 0.4,
          },
          hover: {
            r: 10,
            fill: colors.hoverColor,
            'stroke-opacity': 0.8,
            cursor: 'pointer',
          },
        },
        
        // Markers data
        markers: [
          {
            name: 'INDIA : 350',
            coords: [21.00, 78.00],
          },
          {
            name: 'Australia : 250',
            coords: [-33.00, 151.00],
          },
          {
            name: 'USA : 250',
            coords: [36.77, -119.41],
          },
          {
            name: 'UK : 250',
            coords: [55.37, -3.41],
          },
          {
            name: 'UAE : 250',
            coords: [25.20, 55.27],
          },
        ],
        
        // Simplified approach - remove series for now to test base colors
        // series: {
        //   regions: [
        //     {
        //       attribute: 'fill',
        //       scale: [colors.scaleStart, colors.scaleEnd],
        //       normalizeFunction: 'polynomial',
        //       values: {
        //         'US': 50,
        //         'SA': 30,
        //         'AU': 70,
        //         'IN': 40,
        //         'GB': 60,
        //         'LV': 80,
        //       },
        //     },
        //   ],
        // },
        
        // Interaction options
        zoomOnScroll: false,
        zoomButtons: false,
        
        // Event handlers
        onMarkerTooltipShow(event, tooltip, index) {
          // Safe access to marker data
          const marker = this.markers && this.markers[index];
          const markerName = marker ? marker.name : `Marker ${index + 1}`;
          tooltip.text(markerName);
        },
        
        onRegionTooltipShow(event, tooltip, code) {
          // Safe access to region data
          const regionName = (this.mapData && this.mapData.paths && this.mapData.paths[code]) 
            ? this.mapData.paths[code].name || code 
            : code;
          const value = (this.series && this.series.regions && this.series.regions[0] && this.series.regions[0].values) 
            ? this.series.regions[0].values[code] 
            : null;
          tooltip.text(`${regionName}${value ? `: ${  value}` : ''}`);
        },
        
        onLoaded() {
          // Map loaded successfully
        },
      });
      
      // Store instance for theme updates
      worldMapContainer.mapInstance = mapInstance;
      
    } catch {
      // Error initializing JSVectorMap
      
      // Fallback: show a simple message
      mapContainer.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: ${colors.backgroundColor};
          border: 1px solid ${colors.borderColor};
          border-radius: 8px;
          color: ${colors.textColor};
          font-size: 14px;
        ">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
            <div>World Map</div>
            <div style="font-size: 12px; margin-top: 4px;">Interactive map will load here</div>
          </div>
        </div>
      `;
    }
  };
  
  // Theme update function
  const updateMapTheme = () => {
    if (mapInstance) {
      const isDark = Theme.current() === 'dark';
      const colors = {
        backgroundColor: isDark ? '#313644' : '#f9fafb',
        regionColor: isDark ? '#565a5c' : '#e6eaf0',
        borderColor: isDark ? '#72777a' : '#d3d9e3',
        hoverColor: isDark ? '#7774e7' : '#0f9aee',
        selectedColor: isDark ? '#37c936' : '#7774e7',
        markerFill: isDark ? '#0f9aee' : '#7774e7',
        markerStroke: isDark ? '#37c936' : '#0f9aee',
        scaleStart: isDark ? '#b9c2d0' : '#e6eaf0',
        scaleEnd: isDark ? '#0f9aee' : '#007bff',
        textColor: isDark ? '#99abb4' : '#72777a',
      };
      
      try {
        // Update region styles - commented out series for now
        // mapInstance.updateSeries('regions', {
        //   attribute: 'fill',
        //   scale: [colors.scaleStart, colors.scaleEnd],
        //   values: {
        //     'US': 50,
        //     'SA': 30,
        //     'AU': 70,
        //     'IN': 40,
        //     'GB': 60,
        //     'LV': 80,
        //   },
        // });
        
        // Update container background
        const container = document.getElementById('vmap');
        if (container) {
          container.style.backgroundColor = colors.backgroundColor;
        }
        
      } catch {
        // Theme update failed, reinitializing map
        vectorMapInit();
      }
    } else {
      vectorMapInit();
    }
  };
  
  // Initialize map
  vectorMapInit();
  
  // Reinitialize on window resize
  window.addEventListener('resize', debounce(vectorMapInit, 300));
  
  // Listen for theme changes
  window.addEventListener('adminator:themeChanged', debounce(updateMapTheme, 150));
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (mapInstance) {
      try {
        mapInstance.destroy();
      } catch {
        // Map cleanup on unload
      }
      mapInstance = null;
    }
  });
  
  // Return public API
  return {
    init: vectorMapInit,
    updateTheme: updateMapTheme,
    getInstance: () => mapInstance,
  };
}());