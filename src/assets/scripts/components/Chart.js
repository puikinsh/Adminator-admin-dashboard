/**
 * Modern Chart Component
 * Replaces jQuery Sparkline with Chart.js
 */

import { Chart, registerables } from 'chart.js';
import { COLORS } from '../constants/colors';

// Register Chart.js components
Chart.register(...registerables);

class ChartComponent {
  constructor() {
    this.charts = new Map(); // Store chart instances
    this.debounceTimer = null;
    this.init();
  }

  init() {
    // Only disable resizing for small sparkline charts
    this.createSparklines();
    this.createOtherCharts();
    this.setupResizeHandler();
  }



  /**
   * Create sparklines (only for dashboard page)
   */
  createSparklines() {
    // Only create sparklines if we're on a page that has them
    const sparklineExists = document.getElementById('sparklinedash');
    if (!sparklineExists) {
      return;
    }

    const sparklineConfigs = [
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
  createSparklineChart({ id, data, color }) {
    let canvas = document.getElementById(id);
    
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
      newCanvas.id = id;
      newCanvas.width = 100;
      newCanvas.height = 20;
      newCanvas.style.width = '100px';
      newCanvas.style.height = '20px';
      
      // Replace the span with canvas
      parent.replaceChild(newCanvas, canvas);
      canvas = newCanvas;
    } else {
      // Set canvas dimensions to match original sparkline
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
    }

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 0,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: false,
        events: [],
        onResize: null,
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
    });

    this.charts.set(id, chart);
  }

  /**
   * Create other chart types (only if they exist on the page)
   */
  createOtherCharts() {
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
  createMonthlyStatsChart() {
    const canvas = document.getElementById('line-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Enhanced data for monthly stats
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesData = [120, 135, 145, 165, 180, 195, 210, 225, 240, 220, 200, 185];
    const profitData = [45, 52, 58, 62, 68, 75, 82, 88, 92, 85, 78, 72];
    
    const chart = new Chart(ctx, {
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
                weight: '600',
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
                return `${context.dataset.label  }: $${  context.parsed.y  }K`;
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
              borderDash: [5, 5],
            },
            ticks: {
              font: {
                size: 11,
              },
              callback(value) {
                return `$${  value  }K`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });

    this.charts.set('line-chart', chart);
  }

  /**
   * Create line chart (only if target exists)
   */
  createLineChart(id, data) {
    let canvas = document.getElementById(id);
    
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
      newCanvas.width = 100;
      newCanvas.height = 20;
      newCanvas.style.width = '100px';
      newCanvas.style.height = '20px';
      
      // Replace element with canvas
      parent.replaceChild(newCanvas, canvas);
      canvas = newCanvas;
    } else {
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
    }

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
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
        onResize: null,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });

    this.charts.set(id, chart);
  }

  /**
   * Create composite chart (only if target exists)
   */
  createCompositeChart(id, data) {
    let canvas = document.getElementById(id);
    
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
      newCanvas.width = 100;
      newCanvas.height = 20;
      newCanvas.style.width = '100px';
      newCanvas.style.height = '20px';
      
      // Replace element with canvas
      parent.replaceChild(newCanvas, canvas);
      canvas = newCanvas;
    } else {
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
    }

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i),
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
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: false,
        events: [],
        onResize: null,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });

    this.charts.set(id, chart);
  }

  /**
   * Create custom sparklines for different elements (only if they exist)
   */
  createCustomSparklines() {
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
      this.createCustomLineChart(element, values, `sparkline-${index}`);
    });

    sparkbarElements.forEach((element, index) => {
      this.createCustomBarChart(element, values, `sparkbar-${index}`);
    });

    sparktriElements.forEach((element, index) => {
      this.createTristateChart(element, valuesAlt, `sparktri-${index}`);
    });

    sparkdiscElements.forEach((element, index) => {
      this.createDiscreteChart(element, values, `sparkdisc-${index}`);
    });

    sparkbullElements.forEach((element, index) => {
      this.createBulletChart(element, values, `sparkbull-${index}`);
    });

    sparkboxElements.forEach((element, index) => {
      this.createBoxChart(element, values, `sparkbox-${index}`);
    });
  }

  /**
   * Create custom line chart for sparkline elements
   */
  createCustomLineChart(element, data, id) {
    // Create canvas if it doesn't exist
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
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
        onResize: null, // Explicitly disable resize callback
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }, // Disable tooltip to prevent events
        },
      },
    });



    this.charts.set(id, chart);
  }

  /**
   * Create custom bar chart for sparkbar elements
   */
  createCustomBarChart(element, data, id) {
    // Create canvas if it doesn't exist
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i),
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
    });

    this.charts.set(id, chart);
  }

  /**
   * Setup resize handler for charts
   */
  setupResizeHandler() {
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
  debounceResize() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.redrawLargeChartsOnly();
    }, 150);
  }

  /**
   * Redraw only large charts, not sparklines
   */
  redrawLargeChartsOnly() {
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
  redrawCharts() {
    this.charts.forEach((chart) => {
      if (chart.options.responsive) {
        chart.resize();
      }
    });
  }

  /**
   * Update chart data
   */
  updateChart(id, newData) {
    const chart = this.charts.get(id);
    if (chart) {
      chart.data.datasets[0].data = newData;
      chart.update();
    }
  }

  /**
   * Create charts for the charts.html page
   */
  createChartsPageCharts() {
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
      }, {
        label: 'Dataset 2',
        data: [
          {x: -13, y: 4}, {x: -9, y: 8}, {x: -6, y: 13}, {x: -1, y: 6},
          {x: 2, y: 11}, {x: 5, y: 15}, {x: 8, y: 2}, {x: 13, y: 17},
          {x: 16, y: 9}, {x: -4, y: 14}, {x: 1, y: 20}, {x: 14, y: 4},
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      }],
    });

    // Bar Chart
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

    // Doughnut Chart
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
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      }],
    });

    // Polar Area Chart
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
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 2,
      }],
    });

    // Radar Chart
    this.createLargeChart('radar-chart', 'radar', {
      labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Innovation'],
      datasets: [{
        label: 'Product A',
        data: [65, 59, 90, 81, 56, 55],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
      }, {
        label: 'Product B',
        data: [28, 48, 40, 95, 86, 27],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
      }],
    });

    // Mixed Chart (Bar + Line)
    this.createLargeChart('mixed-chart', 'bar', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        type: 'bar',
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      }, {
        type: 'line',
        label: 'Revenue',
        data: [18, 25, 8, 15, 12, 18],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      }],
    });

    // Bubble Chart
    this.createLargeChart('bubble-chart', 'bubble', {
      datasets: [{
        label: 'First Dataset',
        data: [
          {x: 20, y: 30, r: 15},
          {x: 40, y: 10, r: 10},
          {x: 30, y: 40, r: 20},
          {x: 50, y: 35, r: 12},
          {x: 10, y: 50, r: 8},
          {x: 60, y: 20, r: 18},
          {x: 25, y: 25, r: 14},
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
      }, {
        label: 'Second Dataset',
        data: [
          {x: 15, y: 45, r: 12},
          {x: 35, y: 15, r: 16},
          {x: 45, y: 25, r: 9},
          {x: 55, y: 45, r: 14},
          {x: 25, y: 35, r: 11},
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
      }],
    });
  }

  /**
   * Create large chart for charts page
   */
  createLargeChart(id, type, data) {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Define chart-specific options
    const chartOptions = this.getChartOptions(type);
    
    const chart = new Chart(ctx, {
      type,
      data,
      options: chartOptions,
    });

    this.charts.set(id, chart);
  }

  /**
   * Get chart-specific options based on chart type
   */
  getChartOptions(type) {
    const baseOptions = {
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
              weight: '600',
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
            position: 'right',
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
            grid: {
            },
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
            grid: {
            },
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
            type: 'linear',
            position: 'bottom',
            grid: {
              borderDash: [5, 5],
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
              borderDash: [5, 5],
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
        },
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            ...baseOptions.plugins.tooltip,
            callbacks: {
              label(context) {
                return `${context.dataset.label}: (${context.parsed.x}, ${context.parsed.y}), Size: ${context.parsed._custom}`;
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
            type: 'linear',
            position: 'bottom',
            grid: {
              borderDash: [5, 5],
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            grid: {
              borderDash: [5, 5],
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
              borderDash: [5, 5],
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
              borderDash: [5, 5],
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

  /**
   * Create tristate chart (for .sparktri elements)
   */
  createTristateChart(element, data, id) {
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data: data.map(val => Math.abs(val)),
          backgroundColor: data.map(val => {
            if (val > 0) return COLORS['light-blue-500'];
            if (val < 0) return '#f90';
            return '#000';
          }),
          borderColor: data.map(val => {
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
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `${context.parsed.y}°Celsius`,
            },
          },
        },
      },
    });

    this.charts.set(id, chart);
  }

  /**
   * Create discrete chart (for .sparkdisc elements)
   */
  createDiscreteChart(element, data, id) {
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
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
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `${context.parsed.y}°Celsius`,
            },
          },
        },
      },
    });

    this.charts.set(id, chart);
  }

  /**
   * Create bullet chart (for .sparkbull elements)
   */
  createBulletChart(element, data, id) {
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    // Simplified bullet chart as horizontal bar
    const chart = new Chart(ctx, {
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
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `${context.parsed.x}°Celsius`,
            },
          },
        },
      },
    });

    this.charts.set(id, chart);
  }

  /**
   * Create box chart (for .sparkbox elements) 
   */
  createBoxChart(element, data, id) {
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 20;
      canvas.style.width = '100px';
      canvas.style.height = '20px';
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    
    // Box plot simplified as bar chart showing quartiles
    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = sortedData[Math.floor(sortedData.length * 0.25)];
    const median = sortedData[Math.floor(sortedData.length * 0.5)];
    const q3 = sortedData[Math.floor(sortedData.length * 0.75)];
    
    const chart = new Chart(ctx, {
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
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `${context.parsed.y}°Celsius`,
            },
          },
        },
      },
    });

    this.charts.set(id, chart);
  }

  /**
   * Create Easy Pie Charts (replaces jQuery Easy Pie Chart)
   */
  createEasyPieCharts() {
    const easyPieElements = document.querySelectorAll('.easy-pie-chart');
    
    easyPieElements.forEach((element, index) => {
      const size = parseInt(element.dataset.size) || 80;
      const percent = parseInt(element.dataset.percent) || 0;
      const barColor = element.dataset.barColor || '#f44336';
      
      // Create canvas for the pie chart
      let canvas = element.querySelector('canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        element.appendChild(canvas);
      }

      // Create percentage display
      const percentDisplay = element.querySelector('span');
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
      element.style.position = 'relative';
      element.style.display = 'inline-block';

      const ctx = canvas.getContext('2d');
      
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [percent, 100 - percent],
            backgroundColor: [barColor, '#f0f0f0'],
            borderWidth: 0,
            cutout: '70%',
          }],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
      });

      this.charts.set(`easy-pie-${index}`, chart);
    });
  }

  /**
   * Destroy all charts
   */
  destroy() {
    this.charts.forEach(chart => {
      chart.destroy();
    });
    this.charts.clear();
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}

export default ChartComponent; 