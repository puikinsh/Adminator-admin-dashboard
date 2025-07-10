/**
 * Vector Maps Implementation with TypeScript
 * Interactive world map using JSVectorMap with theme support
 */

import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/jsvectormap.css';
import 'jsvectormap/dist/maps/world.js';
import { debounce } from 'lodash';
import { ThemeManager } from '../utils/theme';
import type { ComponentInterface } from '../../types';

// Type definitions for Vector Maps
export interface VectorMapMarker {
  name: string;
  coords: [number, number];
  data?: any;
}

export interface VectorMapColors {
  backgroundColor: string;
  regionColor: string;
  borderColor: string;
  hoverColor: string;
  selectedColor: string;
  markerFill: string;
  markerStroke: string;
  scaleStart: string;
  scaleEnd: string;
  textColor: string;
}

export interface VectorMapOptions {
  selector: string;
  map: string;
  backgroundColor?: string;
  regionStyle?: {
    initial?: Record<string, any>;
    hover?: Record<string, any>;
    selected?: Record<string, any>;
  };
  markerStyle?: {
    initial?: Record<string, any>;
    hover?: Record<string, any>;
  };
  markers?: VectorMapMarker[];
  series?: {
    regions?: Array<{
      attribute: string;
      scale: [string, string];
      normalizeFunction?: string;
      values: Record<string, number>;
    }>;
  };
  zoomOnScroll?: boolean;
  zoomButtons?: boolean;
  onMarkerTooltipShow?: (event: Event, tooltip: any, index: number) => void;
  onRegionTooltipShow?: (event: Event, tooltip: any, code: string) => void;
  onLoaded?: (map: any) => void;
}

export interface VectorMapInstance {
  destroy(): void;
  updateSeries(type: string, config: any): void;
  markers?: VectorMapMarker[];
  mapData?: any;
  series?: any;
}

declare global {
  interface HTMLElement {
    mapInstance?: VectorMapInstance;
  }
}

// Enhanced Vector Map implementation
export class VectorMapComponent implements ComponentInterface {
  public name: string = 'VectorMapComponent';
  public element: HTMLElement;
  public options: VectorMapOptions;
  public isInitialized: boolean = false;

  private mapInstance: VectorMapInstance | null = null;
  private container: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private themeChangeHandler: (() => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private themeManager: typeof ThemeManager;

  constructor(element: HTMLElement, options: Partial<VectorMapOptions> = {}) {
    this.element = element;
    this.options = {
      selector: '#vmap',
      map: 'world',
      backgroundColor: 'transparent',
      zoomOnScroll: false,
      zoomButtons: false,
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
      ...options,
    };

    this.themeManager = ThemeManager;
    this.init();
  }

  public init(): void {
    this.setupContainer();
    this.setupEventHandlers();
    this.createMap();
    this.isInitialized = true;
  }

  public destroy(): void {
    this.cleanup();
    this.isInitialized = false;
  }

  private setupContainer(): void {
    // Remove existing map
    const existingMap = document.getElementById('vmap');
    if (existingMap) {
      existingMap.remove();
    }

    // Create new map container
    this.container = document.createElement('div');
    this.container.id = 'vmap';
    this.container.style.height = '490px';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.borderRadius = '8px';
    this.container.style.border = '1px solid var(--c-border, #d3d9e3)';
    this.container.style.backgroundColor = 'var(--c-bkg-card, #f9fafb)';

    this.element.appendChild(this.container);
  }

  private setupEventHandlers(): void {
    // Theme change handler
    this.themeChangeHandler = debounce(this.updateMapTheme.bind(this), 150);
    window.addEventListener('adminator:themeChanged', this.themeChangeHandler);

    // Resize handler
    this.resizeHandler = debounce(this.handleResize.bind(this), 300);
    window.addEventListener('resize', this.resizeHandler);

    // Setup ResizeObserver if available
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(
        debounce(() => {
          if (this.mapInstance) {
            this.handleResize();
          }
        }, 300)
      );
      this.resizeObserver.observe(this.element);
    }
  }

  private createMap(): void {
    if (!this.container) return;

    // Destroy existing map instance
    this.destroyMapInstance();

    const colors = this.getThemeColors();
    const mapConfig = this.buildMapConfig(colors);

    try {
      this.mapInstance = jsVectorMap(mapConfig);
      this.element.mapInstance = this.mapInstance;
    } catch (error) {
      console.error('VectorMap: Failed to initialize map', error);
      this.showFallbackContent(colors);
    }
  }

  private getThemeColors(): VectorMapColors {
    const isDark = this.themeManager.current() === 'dark';
    
    return {
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
  }

  private buildMapConfig(colors: VectorMapColors): VectorMapOptions {
    return {
      selector: '#vmap',
      map: 'world',
      backgroundColor: this.options.backgroundColor || 'transparent',
      
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
        ...this.options.regionStyle,
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
        ...this.options.markerStyle,
      },
      
      // Markers data
      markers: this.options.markers || [],
      
      // Series configuration
      series: this.options.series,
      
      // Interaction options
      zoomOnScroll: this.options.zoomOnScroll || false,
      zoomButtons: this.options.zoomButtons || false,
      
      // Event handlers
      onMarkerTooltipShow: this.handleMarkerTooltip.bind(this),
      onRegionTooltipShow: this.handleRegionTooltip.bind(this),
      onLoaded: this.handleMapLoaded.bind(this),
    };
  }

  private handleMarkerTooltip(event: Event, tooltip: any, index: number): void {
    try {
      const marker = this.mapInstance?.markers?.[index];
      const markerName = marker?.name || `Marker ${index + 1}`;
      tooltip.text(markerName);
    } catch (error) {
      console.warn('VectorMap: Error in marker tooltip', error);
    }

    // Call custom handler if provided
    if (this.options.onMarkerTooltipShow) {
      this.options.onMarkerTooltipShow(event, tooltip, index);
    }
  }

  private handleRegionTooltip(event: Event, tooltip: any, code: string): void {
    try {
      const mapData = this.mapInstance?.mapData;
      const regionName = mapData?.paths?.[code]?.name || code;
      const series = this.mapInstance?.series?.regions?.[0];
      const value = series?.values?.[code];
      
      const text = value ? `${regionName}: ${value}` : regionName;
      tooltip.text(text);
    } catch (error) {
      console.warn('VectorMap: Error in region tooltip', error);
      tooltip.text(code);
    }

    // Call custom handler if provided
    if (this.options.onRegionTooltipShow) {
      this.options.onRegionTooltipShow(event, tooltip, code);
    }
  }

  private handleMapLoaded(map: any): void {
    console.log('VectorMap: Map loaded successfully');
    
    // Call custom handler if provided
    if (this.options.onLoaded) {
      this.options.onLoaded(map);
    }
  }

  private showFallbackContent(colors: VectorMapColors): void {
    if (!this.container) return;

    this.container.innerHTML = `
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
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 32px; margin-bottom: 12px;">🗺️</div>
          <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">World Map</div>
          <div style="font-size: 12px; opacity: 0.7;">Interactive map will load here</div>
        </div>
      </div>
    `;
  }

  private updateMapTheme(): void {
    if (!this.mapInstance || !this.container) {
      this.createMap();
      return;
    }

    const colors = this.getThemeColors();

    try {
      // Update container background
      this.container.style.backgroundColor = colors.backgroundColor;
      this.container.style.borderColor = colors.borderColor;

      // Update series if available
      if (this.mapInstance.series?.regions?.[0]) {
        this.mapInstance.updateSeries('regions', {
          attribute: 'fill',
          scale: [colors.scaleStart, colors.scaleEnd],
          values: this.mapInstance.series.regions[0].values || {},
        });
      }
    } catch (error) {
      console.warn('VectorMap: Theme update failed, reinitializing', error);
      this.createMap();
    }
  }

  private handleResize(): void {
    if (this.mapInstance && this.container) {
      // Force a re-render by recreating the map
      this.createMap();
    }
  }

  private destroyMapInstance(): void {
    if (this.mapInstance) {
      try {
        this.mapInstance.destroy();
      } catch (error) {
        console.warn('VectorMap: Error destroying map instance', error);
      }
      this.mapInstance = null;
    }
  }

  private cleanup(): void {
    this.destroyMapInstance();

    // Remove event listeners
    if (this.themeChangeHandler) {
      window.removeEventListener('adminator:themeChanged', this.themeChangeHandler);
      this.themeChangeHandler = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    // Disconnect ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Clear container
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  // Public API methods
  public updateMarkers(markers: VectorMapMarker[]): void {
    this.options.markers = markers;
    this.createMap();
  }

  public updateSeries(type: string, config: any): void {
    if (this.mapInstance) {
      try {
        this.mapInstance.updateSeries(type, config);
      } catch (error) {
        console.warn('VectorMap: Error updating series', error);
      }
    }
  }

  public getMapInstance(): VectorMapInstance | null {
    return this.mapInstance;
  }

  public refresh(): void {
    this.createMap();
  }

  public updateOptions(newOptions: Partial<VectorMapOptions>): void {
    this.options = { ...this.options, ...newOptions };
    this.createMap();
  }
}

// Vector Map Manager
export class VectorMapManager {
  private instances: Map<string, VectorMapComponent> = new Map();

  public initialize(selector: string = '#world-map-marker', options: Partial<VectorMapOptions> = {}): VectorMapComponent | null {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      // Silently return null if element doesn't exist (normal for pages without maps)
      return null;
    }

    // Clean up existing instance
    const existingInstance = this.instances.get(selector);
    if (existingInstance) {
      existingInstance.destroy();
    }

    // Create new instance
    const vectorMap = new VectorMapComponent(element, options);
    this.instances.set(selector, vectorMap);

    return vectorMap;
  }

  public getInstance(selector: string): VectorMapComponent | undefined {
    return this.instances.get(selector);
  }

  public destroyInstance(selector: string): void {
    const instance = this.instances.get(selector);
    if (instance) {
      instance.destroy();
      this.instances.delete(selector);
    }
  }

  public destroyAll(): void {
    this.instances.forEach((instance) => {
      instance.destroy();
    });
    this.instances.clear();
  }
}

// Create singleton manager
const vectorMapManager = new VectorMapManager();

// Main initialization function
const vectorMapInit = (): void => {
  // Only initialize if the map container exists
  if (document.querySelector('#world-map-marker')) {
    vectorMapManager.initialize('#world-map-marker', {
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
    });
  }
};

// Initialize map
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', vectorMapInit);
} else {
  vectorMapInit();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  vectorMapManager.destroyAll();
});

// Export default for compatibility
export default {
  init: vectorMapInit,
  manager: vectorMapManager,
  VectorMapComponent,
  VectorMapManager,
};