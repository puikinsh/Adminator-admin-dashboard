/**
 * Modern Chart Component with TypeScript
 * Replaces jQuery Sparkline with Chart.js
 */

import { Chart, ChartConfiguration, registerables, ChartType as ChartJSType } from 'chart.js';
import type { ComponentInterface } from '../../../types';
import { COLORS } from '../constants/colors';

// Register Chart.js components
Chart.register(...registerables);

export interface SparklineConfig {
  id: string;
  data: number[];
  color: string;
}

export interface ChartComponentOptions {
  enableResize?: boolean;
  resizeDebounceMs?: number;
  enableAnimation?: boolean;
}

export interface ChartDimensions {
  width: number;
  height: number;
}

export type ChartElementType = 'sparkline' | 'sparkbar' | 'sparktri' | 'sparkdisc' | 'sparkbull' | 'sparkbox' | 'easypie';

export class ChartComponent implements ComponentInterface {
  public name: string = 'ChartComponent';
  public element: HTMLElement;
  public options: ChartComponentOptions;
  public isInitialized: boolean = false;

  private charts: Map<string, Chart> = new Map();
  private debounceTimer: number | null = null;

  constructor(element?: HTMLElement, options: ChartComponentOptions = {}) {
    this.element = element || document.body;
    this.options = {
      enableResize: true,
      resizeDebounceMs: 150,
      enableAnimation: true,
      ...options,
    };

    this.init();
  }

  /**
   * Initialize the chart component
   */
  public init(): void {
    // Only disable resizing for small sparkline charts
    this.createSparklines();
    this.createOtherCharts();
    
    if (this.options.enableResize) {
      this.setupResizeHandler();
    }

    this.isInitialized = true;
  }

  /**
   * Destroy the chart component
   */
  public destroy(): void {
    this.charts.forEach(chart => {
      chart.destroy();
    });
    this.charts.clear();
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.isInitialized = false;
  }

  /**
   * Create sparklines (only for dashboard page)
   */
  private createSparklines(): void {
    // Only create sparklines if we're on a page that has them
    const sparklineExists = document.getElementById('sparklinedash');
    if (!sparklineExists) {
      return;
    }

    const sparklineConfigs: SparklineConfig[] = [
      {
        id: 'sparklinedash',
        data: [0, 5, 6, 10, 9, 12, 4, 9],
        color: '#4caf50',
      },
      {
        id: 'sparklinedash2',
        data: [0, 5, 6, 10, 9, 12, 4, 9],
        color: '#9675ce',
      },
      {
        id: 'sparklinedash3',
        data: [0, 5, 6, 10, 9, 12, 4, 9],
        color: '#03a9f3',
      },
      {
        id: 'sparklinedash4',
        data: [0, 5, 6, 10, 9, 12, 4, 9],
        color: '#f96262',
      },
    ];

    sparklineConfigs.forEach(config => {
      // Only create if the target element exists
      if (document.getElementById(config.id)) {
        this.createSparklineChart(config);
      }
    });
  }

  /**
   * Create sparkline chart from configuration
   */
  private createSparklineChart(config: SparklineConfig): void {
    let canvas = document.getElementById(config.id) as HTMLCanvasElement;
    
    // Only proceed if we have a valid target element
    if (!canvas) {
      return;
    }
    
    // If element exists but isn't a canvas, replace it with canvas
    if (canvas.tagName !== 'CANVAS') {
      const parent = canvas.parentNode;
      if (!parent) {
        return;
      }
      
      // Create new canvas element
      const newCanvas = document.createElement('canvas');
      newCanvas.id = config.id;
      this.setCanvasDimensions(newCanvas, { width: 100, height: 20 });
      
      // Replace the span with canvas
      parent.replaceChild(newCanvas, canvas);
      canvas = newCanvas;
    } else {
      // Set canvas dimensions to match original sparkline
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: config.data.map((_, i) => i.toString()),
        datasets: [{
          data: config.data,
          backgroundColor: config.color,
          borderColor: config.color,
          borderWidth: 0,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: this.options.enableAnimation ? {} : false,
        events: [],
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        elements: {
          bar: {
            borderRadius: 1,
          },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(config.id, chart);
  }

  /**
   * Set canvas dimensions
   */
  private setCanvasDimensions(canvas: HTMLCanvasElement, dimensions: ChartDimensions): void {
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
  }

  /**
   * Create other chart types (only if they exist on the page)
   */
  private createOtherCharts(): void {
    // Determine if we're on the dashboard or charts page
    const isChartsPage = document.getElementById('area-chart') !== null;
    const isDashboard = !isChartsPage && document.getElementById('line-chart') !== null;
    
    // Create Monthly Stats chart with enhanced dual-line data (dashboard only)
    if (isDashboard) {
      this.createMonthlyStatsChart();
    }
    
    // Charts page specific charts (only on charts page)
    if (isChartsPage) {
      this.createChartsPageCharts();
    }
    
    // Only create charts if their target elements exist
    if (document.getElementById('sparkline')) {
      this.createLineChart('sparkline', [5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7]);
    }
    
    if (document.getElementById('compositebar')) {
      this.createCompositeChart('compositebar', [4, 1, 5, 7, 9, 9, 8, 7, 6, 6, 4, 7, 8, 4, 3, 2, 2, 5, 6, 7]);
    }
    
    // Regular sparklines with custom colors (only on pages that have them)
    this.createCustomSparklines();

    // Easy Pie Charts (only if they exist)
    this.createEasyPieCharts();
  }

  /**
   * Create enhanced Monthly Stats chart with dual lines and more data
   */
  private createMonthlyStatsChart(): void {
    const canvas = document.getElementById('line-chart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Enhanced data for monthly stats
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesData = [120, 135, 145, 165, 180, 195, 210, 225, 240, 220, 200, 185];
    const profitData = [45, 52, 58, 62, 68, 75, 82, 88, 92, 85, 78, 72];
    
    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Sales ($K)',
            data: salesData,
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#4caf50',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Profit ($K)',
            data: profitData,
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#2196f3',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 20,
              font: {
                size: 12,
                weight: 600,
              },
            },
          },
          tooltip: {
            enabled: true,
            cornerRadius: 8,
            displayColors: true,
            intersect: false,
            mode: 'index',
            callbacks: {
              label(context) {
                return `${context.dataset.label}: $${context.parsed.y}K`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              borderDash: [5, 5] as [number, number],
            },
            ticks: {
              font: {
                size: 11,
              },
              callback(value) {
                return `$${value}K`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set('line-chart', chart);
  }

  /**
   * Create line chart (only if target exists)
   */
  private createLineChart(id: string, data: number[]): void {
    let canvas = document.getElementById(id) as HTMLCanvasElement;
    
    // Only proceed if target element exists
    if (!canvas) {
      return;
    }
    
    // If element exists but isn't a canvas, replace it with canvas
    if (canvas.tagName !== 'CANVAS') {
      const parent = canvas.parentNode;
      if (!parent) {
        return;
      }
      
      // Create new canvas element
      const newCanvas = document.createElement('canvas');
      newCanvas.id = id;
      this.setCanvasDimensions(newCanvas, { width: 100, height: 20 });
      
      // Replace element with canvas
      parent.replaceChild(newCanvas, canvas);
      canvas = newCanvas;
    } else {
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.map((_, i) => i.toString()),
        datasets: [{
          data,
          borderColor: COLORS['blue-500'],
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          tension: 0.4,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: false,
        events: [],
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Create composite chart (only if target exists)
   */
  private createCompositeChart(id: string, data: number[]): void {
    let canvas = document.getElementById(id) as HTMLCanvasElement;
    
    // Only proceed if target element exists
    if (!canvas) {
      return;
    }
    
    // If element exists but isn't a canvas, replace it with canvas  
    if (canvas.tagName !== 'CANVAS') {
      const parent = canvas.parentNode;
      if (!parent) {
        return;
      }
      
      // Create new canvas element
      const newCanvas = document.createElement('canvas');
      newCanvas.id = id;
      this.setCanvasDimensions(newCanvas, { width: 100, height: 20 });
      
      // Replace element with canvas
      parent.replaceChild(newCanvas, canvas);
      canvas = newCanvas;
    } else {
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i.toString()),
        datasets: [
          {
            type: 'bar',
            data,
            backgroundColor: '#aaf',
            borderColor: '#aaf',
            borderWidth: 0,
          },
          {
            type: 'line',
            data,
            borderColor: 'red',
            backgroundColor: 'transparent',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.4,
          } as any, // Type assertion needed for mixed chart types
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: false,
        events: [],
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Create custom sparklines for different elements (only if they exist)
   */
  private createCustomSparklines(): void {
    const sparklineElements = document.querySelectorAll('.sparkline');
    const sparkbarElements = document.querySelectorAll('.sparkbar');
    const sparktriElements = document.querySelectorAll('.sparktri');
    const sparkdiscElements = document.querySelectorAll('.sparkdisc');
    const sparkbullElements = document.querySelectorAll('.sparkbull');
    const sparkboxElements = document.querySelectorAll('.sparkbox');
    
    // Only create if we have elements
    if (sparklineElements.length === 0 && sparkbarElements.length === 0 && 
        sparktriElements.length === 0 && sparkdiscElements.length === 0 &&
        sparkbullElements.length === 0 && sparkboxElements.length === 0) {
      return;
    }
    
    const values = [5, 4, 5, -2, 0, 3, -5, 6, 7, 9, 9, 5, -3, -2, 2, -4];
    const valuesAlt = [1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1];

    sparklineElements.forEach((element, index) => {
      this.createCustomLineChart(element as HTMLElement, values, `sparkline-${index}`);
    });

    sparkbarElements.forEach((element, index) => {
      this.createCustomBarChart(element as HTMLElement, values, `sparkbar-${index}`);
    });

    sparktriElements.forEach((element, index) => {
      this.createTristateChart(element as HTMLElement, valuesAlt, `sparktri-${index}`);
    });

    sparkdiscElements.forEach((element, index) => {
      this.createDiscreteChart(element as HTMLElement, values, `sparkdisc-${index}`);
    });

    sparkbullElements.forEach((element, index) => {
      this.createBulletChart(element as HTMLElement, values, `sparkbull-${index}`);
    });

    sparkboxElements.forEach((element, index) => {
      this.createBoxChart(element as HTMLElement, values, `sparkbox-${index}`);
    });
  }

  /**
   * Create custom line chart for sparkline elements
   */
  private createCustomLineChart(element: HTMLElement, data: number[], id: string): void {
    // Create canvas if it doesn't exist
    let canvas = element.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.map((_, i) => i.toString()),
        datasets: [{
          data,
          borderColor: COLORS['red-500'],
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: COLORS['red-500'],
          tension: 0.4,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: false, // Disable animations to prevent resize triggers
        events: [], // Disable all events to prevent resize
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }, // Disable tooltip to prevent events
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Create custom bar chart for sparkbar elements
   */
  private createCustomBarChart(element: HTMLElement, data: number[], id: string): void {
    // Create canvas if it doesn't exist
    let canvas = element.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i.toString()),
        datasets: [{
          data,
          backgroundColor: data.map(val => val < 0 ? COLORS['deep-purple-500'] : '#39f'),
          borderColor: data.map(val => val < 0 ? COLORS['deep-purple-500'] : '#39f'),
          borderWidth: 1,
          barPercentage: 0.8,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `${context.parsed.y}°Celsius`,
            },
          },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Setup resize handler for charts
   */
  private setupResizeHandler(): void {
    // Setup responsive resize for large charts only
    window.addEventListener('resize', () => {
      this.debounceResize();
    });
    
    // Listen for sidebar toggle events
    window.addEventListener('sidebar:toggle', () => {
      this.debounceResize();
    });
  }

  /**
   * Debounced resize handler
   */
  private debounceResize(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => {
      this.redrawLargeChartsOnly();
    }, this.options.resizeDebounceMs || 150);
  }

  /**
   * Redraw only large charts, not sparklines
   */
  private redrawLargeChartsOnly(): void {
    const largeChartIds = [
      'line-chart', 'area-chart', 'scatter-chart', 'bar-chart',
      'doughnut-chart', 'polar-chart', 'radar-chart', 'mixed-chart', 'bubble-chart',
    ];
    
    largeChartIds.forEach(id => {
      const chart = this.charts.get(id);
      if (chart && chart.options.responsive) {
        chart.resize();
      }
    });
  }

  /**
   * Redraw all charts (used sparingly)
   */
  public redrawCharts(): void {
    this.charts.forEach((chart) => {
      if (chart.options.responsive) {
        chart.resize();
      }
    });
  }

  /**
   * Update chart data
   */
  public updateChart(id: string, newData: number[]): void {
    const chart = this.charts.get(id);
    if (chart && chart.data.datasets[0]) {
      chart.data.datasets[0].data = newData;
      chart.update();
    }
  }

  /**
   * Get chart instance by id
   */
  public getChart(id: string): Chart | undefined {
    return this.charts.get(id);
  }

  /**
   * Get all chart instances
   */
  public getAllCharts(): Map<string, Chart> {
    return new Map(this.charts);
  }

  /**
   * Create charts for the charts.html page
   */
  private createChartsPageCharts(): void {
    // Line Chart
    this.createLargeChart('line-chart', 'line', {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      }],
    });

    // Area Chart
    this.createLargeChart('area-chart', 'line', {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        fill: true,
        tension: 0.4,
      }],
    });

    // Scatter Chart with more data points
    this.createLargeChart('scatter-chart', 'scatter', {
      datasets: [{
        label: 'Dataset 1',
        data: [
          {x: -15, y: 8}, {x: -12, y: 12}, {x: -8, y: 3}, {x: -5, y: 15},
          {x: -2, y: 7}, {x: 0, y: 10}, {x: 3, y: 18}, {x: 6, y: 5},
          {x: 9, y: 22}, {x: 12, y: 8}, {x: 15, y: 14}, {x: 18, y: 19},
          {x: -10, y: 0}, {x: 10, y: 5}, {x: 0.5, y: 5.5}, {x: 7, y: 12},
          {x: -7, y: 17}, {x: 4, y: 9}, {x: 11, y: 16}, {x: -3, y: 11},
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      }],
    });

    // Continue with other chart types...
    this.createBarChart();
    this.createDoughnutChart();
    this.createPolarChart();
    this.createRadarChart();
    this.createMixedChart();
    this.createBubbleChart();
  }

  /**
   * Create large chart for charts page
   */
  private createLargeChart(id: string, type: ChartJSType, data: any): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Define chart-specific options
    const chartOptions = this.getChartOptions(type);
    
    const chartConfig: ChartConfiguration = {
      type,
      data,
      options: chartOptions,
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Get chart-specific options based on chart type
   */
  private getChartOptions(type: ChartJSType): any {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            padding: 20,
            font: {
              size: 12,
              weight: '600' as const,
            },
          },
        },
        tooltip: {
          enabled: true,
          cornerRadius: 8,
          displayColors: true,
        },
      },
    };

    // Chart type specific configurations
    switch (type) {
      case 'doughnut':
      case 'pie':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              ...baseOptions.plugins.legend,
              position: 'right' as const,
            },
          },
          interaction: {
            intersect: false,
          },
        };

      case 'polarArea':
        return {
          ...baseOptions,
          scales: {
            r: {
              pointLabels: {
                display: true,
                centerPointLabels: true,
                font: {
                  size: 10,
                },
              },
              grid: {},
            },
          },
        };

      case 'radar':
        return {
          ...baseOptions,
          scales: {
            r: {
              angleLines: {
                display: true,
              },
              grid: {},
              pointLabels: {
                font: {
                  size: 11,
                },
              },
              ticks: {
                display: true,
                font: {
                  size: 10,
                },
              },
            },
          },
        };

      case 'bubble':
        return {
          ...baseOptions,
          scales: {
            x: {
              type: 'linear' as const,
              position: 'bottom' as const,
              grid: {
                borderDash: [5, 5] as [number, number],
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [5, 5] as [number, number],
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
          },
        };

      case 'scatter':
        return {
          ...baseOptions,
          scales: {
            x: {
              type: 'linear' as const,
              position: 'bottom' as const,
              grid: {
                borderDash: [5, 5] as [number, number],
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
            y: {
              grid: {
                borderDash: [5, 5] as [number, number],
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
          },
        };

      default:
        // For line, bar, area, mixed charts
        return {
          ...baseOptions,
          scales: {
            x: {
              grid: {
                borderDash: [5, 5] as [number, number],
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [5, 5] as [number, number],
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
          },
        };
    }
  }

  // Additional chart creation methods...
  private createBarChart(): void {
    this.createLargeChart('bar-chart', 'bar', {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    });
  }

  private createDoughnutChart(): void {
    this.createLargeChart('doughnut-chart', 'doughnut', {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100, 75, 120, 60],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      }],
    });
  }

  private createPolarChart(): void {
    this.createLargeChart('polar-chart', 'polarArea', {
      labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
      datasets: [{
        label: 'My First Dataset',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(201, 203, 207, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderWidth: 2,
      }],
    });
  }

  private createRadarChart(): void {
    this.createLargeChart('radar-chart', 'radar', {
      labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Innovation'],
      datasets: [{
        label: 'Product A',
        data: [65, 59, 90, 81, 56, 55],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
      }],
    });
  }

  private createMixedChart(): void {
    this.createLargeChart('mixed-chart', 'bar', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        type: 'bar',
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      }, {
        type: 'line',
        label: 'Revenue',
        data: [18, 25, 8, 15, 12, 18],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.4,
      }],
    });
  }

  private createBubbleChart(): void {
    this.createLargeChart('bubble-chart', 'bubble', {
      datasets: [{
        label: 'First Dataset',
        data: [
          {x: 20, y: 30, r: 15},
          {x: 40, y: 10, r: 10},
          {x: 30, y: 40, r: 20},
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
      }],
    });
  }

  /**
   * Create tristate chart (for .sparktri elements)
   */
  private createTristateChart(element: HTMLElement, data: number[], id: string): void {
    let canvas = element.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i.toString()),
        datasets: [{
          data: data.map(val => Math.abs(val)),
          backgroundColor: data.map(val => {
            if (val > 0) return COLORS['light-blue-500'];
            if (val < 0) return '#f90';
            return '#000';
          }),
          borderWidth: 1,
          barPercentage: 0.8,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Create discrete chart (for .sparkdisc elements)
   */
  private createDiscreteChart(element: HTMLElement, data: number[], id: string): void {
    let canvas = element.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'scatter',
      data: {
        datasets: [{
          data: data.map((val, index) => ({x: index, y: val})),
          backgroundColor: '#9f0',
          borderColor: '#9f0',
          pointRadius: 2,
          showLine: false,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Create bullet chart (for .sparkbull elements)
   */
  private createBulletChart(element: HTMLElement, data: number[], id: string): void {
    let canvas = element.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [{
          data: [Math.max(...data)],
          backgroundColor: COLORS['amber-500'],
          borderColor: COLORS['amber-500'],
          borderWidth: 1,
          barPercentage: 0.6,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Create box chart (for .sparkbox elements) 
   */
  private createBoxChart(element: HTMLElement, data: number[], id: string): void {
    let canvas = element.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.setCanvasDimensions(canvas, { width: 100, height: 20 });
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Box plot simplified as bar chart showing quartiles
    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = sortedData[Math.floor(sortedData.length * 0.25)];
    const median = sortedData[Math.floor(sortedData.length * 0.5)];
    const q3 = sortedData[Math.floor(sortedData.length * 0.75)];
    
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Q1', 'Med', 'Q3'],
        datasets: [{
          data: [q1, median, q3],
          backgroundColor: '#9f0',
          borderColor: '#9f0',
          borderWidth: 1,
          barPercentage: 0.8,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    this.charts.set(id, chart);
  }

  /**
   * Create Easy Pie Charts (replaces jQuery Easy Pie Chart)
   */
  private createEasyPieCharts(): void {
    const easyPieElements = document.querySelectorAll('.easy-pie-chart');
    
    easyPieElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const size = parseInt(htmlElement.dataset.size || '80');
      const percent = parseInt(htmlElement.dataset.percent || '0');
      const barColor = htmlElement.dataset.barColor || '#f44336';
      
      // Create canvas for the pie chart
      let canvas = element.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        canvas = document.createElement('canvas');
        this.setCanvasDimensions(canvas, { width: size, height: size });
        element.appendChild(canvas);
      }

      // Create percentage display
      const percentDisplay = element.querySelector('span') as HTMLSpanElement;
      if (percentDisplay) {
        percentDisplay.textContent = `${percent}%`;
        percentDisplay.style.position = 'absolute';
        percentDisplay.style.top = '50%';
        percentDisplay.style.left = '50%';
        percentDisplay.style.transform = 'translate(-50%, -50%)';
        percentDisplay.style.fontSize = '14px';
        percentDisplay.style.fontWeight = 'bold';
      }

      // Set element position to relative for absolute positioning of text
      htmlElement.style.position = 'relative';
      htmlElement.style.display = 'inline-block';

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const chartConfig: ChartConfiguration = {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [percent, 100 - percent],
            backgroundColor: [barColor, '#f0f0f0'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
      };

      const chart = new Chart(ctx, chartConfig);
      this.charts.set(`easy-pie-${index}`, chart);
    });
  }
}

export default ChartComponent;