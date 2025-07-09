import { Chart, registerables } from 'chart.js';
import { debounce } from 'lodash';
import { COLORS } from '../../constants/colors';
import Theme from '../../utils/theme.js';

// Register Chart.js components
Chart.register(...registerables);

export default (function () {
  // Store chart instances for cleanup
  let chartInstances = [];

  // ------------------------------------------------------
  // @Sparkline Chart Creation Helpers
  // ------------------------------------------------------

  const createSparklineChart = (elementId, data, color, type = 'bar') => {
    const element = document.getElementById(elementId);
    if (!element) return null;

    // Clear existing chart
    const existingChart = chartInstances.find(chart => chart.canvas.id === elementId);
    if (existingChart) {
      existingChart.destroy();
      chartInstances = chartInstances.filter(chart => chart.canvas.id !== elementId);
    }

    // Create canvas if it doesn't exist
    let canvas = element.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = `${elementId  }-canvas`;
      element.appendChild(canvas);
    }

    // Set canvas size
    canvas.width = element.offsetWidth || 100;
    canvas.height = 20;

    const ctx = canvas.getContext('2d');
    
    const chartConfig = {
      type,
      data: {
        labels: data.map((_, index) => index),
        datasets: [{
          data,
          backgroundColor: color,
          borderColor: color,
          borderWidth: type === 'line' ? 2 : 0,
          barThickness: 3,
          categoryPercentage: 1.0,
          barPercentage: 0.8,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          x: {
            display: false,
            grid: {
              display: false,
            },
          },
          y: {
            display: false,
            grid: {
              display: false,
            },
          },
        },
        elements: {
          bar: {
            borderRadius: 0,
          },
          line: {
            tension: 0.1,
          },
        },
        layout: {
          padding: 0,
        },
      },
    };

    const chart = new Chart(ctx, chartConfig);
    chartInstances.push(chart);
    return chart;
  };

  const createSparklineForElements = (selector, data, color, type = 'bar') => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      const elementId = element.id || `sparkline-${selector.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
      if (!element.id) element.id = elementId;
      createSparklineChart(elementId, data, color, type);
    });
  };

  // ------------------------------------------------------
  // @Dashboard Sparklines
  // ------------------------------------------------------

  const drawSparklines = () => {
    const sparkColors = Theme.getSparklineColors();
    const data = [0, 5, 6, 10, 9, 12, 4, 9];
    
    // Dashboard sparklines
    createSparklineChart('sparklinedash', data, sparkColors.success);
    createSparklineChart('sparklinedash2', data, sparkColors.purple);
    createSparklineChart('sparklinedash3', data, sparkColors.info);
    createSparklineChart('sparklinedash4', data, sparkColors.danger);
  };

  // ------------------------------------------------------
  // @Other Sparklines
  // ------------------------------------------------------

  const drawOtherSparklines = () => {
    const sparkColors = Theme.getSparklineColors();
    
    // Line sparklines
    createSparklineChart('sparkline', [5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], COLORS['red-500'], 'line');
    
    // Composite bar - simplified implementation
    createSparklineChart('compositebar', [4, 1, 5, 7, 9, 9, 8, 7, 6, 6, 4, 7, 8, 4, 3, 2, 2, 5, 6, 7], sparkColors.light);
    
    // Normal line
    createSparklineChart('normalline', [5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], sparkColors.info, 'line');
    
    // Various sparkline types for elements with classes
    const values = [5, 4, 5, -2, 0, 3, -5, 6, 7, 9, 9, 5, -3, -2, 2, -4];
    const valuesAlt = [1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1];

    // Line sparklines
    createSparklineForElements('.sparkline', values, COLORS['red-500'], 'line');
    
    // Bar sparklines
    createSparklineForElements('.sparkbar', values, COLORS['deep-purple-500'], 'bar');
    
    // Tristate sparklines (simplified as bar charts)
    createSparklineForElements('.sparktri', valuesAlt, COLORS['light-blue-500'], 'bar');
    createSparklineForElements('.sparktristate', valuesAlt, sparkColors.info, 'bar');
    createSparklineForElements('.sparktristatecols', valuesAlt, '#fa7', 'bar');
    
    // Discrete sparklines (as line charts)
    createSparklineForElements('.sparkdisc', values, '#9f0', 'line');
    
    // Bullet sparklines (simplified as bar charts)
    createSparklineForElements('.sparkbull', values, COLORS['amber-500'], 'bar');
    
    // Box sparklines (simplified as bar charts)
    createSparklineForElements('.sparkbox', values, '#9f0', 'bar');
  };

  // ------------------------------------------------------
  // @Initialization
  // ------------------------------------------------------

  const initializeSparklines = () => {
    drawSparklines();
    drawOtherSparklines();
  };

  // Initial draw
  initializeSparklines();

  // Redraw sparklines on window resize
  window.addEventListener('resize', debounce(initializeSparklines, 150));
  
  // Listen for theme changes
  window.addEventListener('adminator:themeChanged', debounce(initializeSparklines, 150));

  // Cleanup function for chart instances
  window.addEventListener('beforeunload', () => {
    chartInstances.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    chartInstances = [];
  });

  // Export for external access
  return {
    redraw: initializeSparklines,
    destroy: () => {
      chartInstances.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
      chartInstances = [];
    },
  };
}());