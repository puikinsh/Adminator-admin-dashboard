import Theme from '../../utils/theme.js';

export default (function () {
  
  // Vanilla JS Pie Chart implementation using SVG
  class VanillaPieChart {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        size: 110,
        lineWidth: 3,
        lineCap: 'round',
        trackColor: '#f2f2f2',
        barColor: '#ef1e25',
        scaleColor: false,
        animate: 1000,
        onStep: null,
        ...options,
      };
      
      this.percentage = parseInt(element.dataset.percent || 0);
      this.init();
    }
    
    init() {
      this.createSVG();
      this.animate();
    }
    
    createSVG() {
      const size = this.options.size;
      const lineWidth = this.options.lineWidth;
      const radius = (size - lineWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      
      // Create SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.style.transform = 'rotate(-90deg)';
      
      // Create track (background circle)
      const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      track.setAttribute('cx', size / 2);
      track.setAttribute('cy', size / 2);
      track.setAttribute('r', radius);
      track.setAttribute('fill', 'none');
      track.setAttribute('stroke', this.options.trackColor);
      track.setAttribute('stroke-width', lineWidth);
      
      // Create bar (progress circle)
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bar.setAttribute('cx', size / 2);
      bar.setAttribute('cy', size / 2);
      bar.setAttribute('r', radius);
      bar.setAttribute('fill', 'none');
      bar.setAttribute('stroke', this.options.barColor);
      bar.setAttribute('stroke-width', lineWidth);
      bar.setAttribute('stroke-linecap', this.options.lineCap);
      bar.setAttribute('stroke-dasharray', circumference);
      bar.setAttribute('stroke-dashoffset', circumference);
      
      // Add elements to SVG
      svg.appendChild(track);
      svg.appendChild(bar);
      
      // Clear element and add SVG
      this.element.innerHTML = '';
      this.element.appendChild(svg);
      
      // Add percentage text
      const textElement = document.createElement('div');
      textElement.style.position = 'absolute';
      textElement.style.top = '50%';
      textElement.style.left = '50%';
      textElement.style.transform = 'translate(-50%, -50%)';
      textElement.style.fontSize = '14px';
      textElement.style.fontWeight = 'bold';
      textElement.style.color = Theme.getCSSVar('--c-text-base') || '#333';
      textElement.textContent = '0%';
      
      this.element.style.position = 'relative';
      this.element.appendChild(textElement);
      
      // Store references
      this.svg = svg;
      this.bar = bar;
      this.textElement = textElement;
      this.circumference = circumference;
    }
    
    animate() {
      const targetOffset = this.circumference - (this.percentage / 100) * this.circumference;
      const duration = this.options.animate;
      const startTime = Date.now();
      const startOffset = this.circumference;
      
      const animateStep = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentOffset = startOffset - (startOffset - targetOffset) * easeProgress;
        const currentPercent = ((this.circumference - currentOffset) / this.circumference) * 100;
        
        this.bar.setAttribute('stroke-dashoffset', currentOffset);
        this.textElement.textContent = `${Math.round(currentPercent)}%`;
        
        // Call onStep callback if provided
        if (this.options.onStep) {
          this.options.onStep.call(this, 0, this.percentage, currentPercent);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateStep);
        }
      };
      
      requestAnimationFrame(animateStep);
    }
    
    update(percentage) {
      this.percentage = percentage;
      this.animate();
    }
    
    destroy() {
      if (this.element) {
        this.element.innerHTML = '';
      }
    }
  }
  
  // Initialize all pie charts
  const initializePieCharts = () => {
    const pieChartElements = document.querySelectorAll('.easy-pie-chart');
    
    pieChartElements.forEach(element => {
      // Skip if already initialized
      if (element.pieChartInstance) {
        element.pieChartInstance.destroy();
      }
      
      // Get theme colors
      const isDark = Theme.current() === 'dark';
      const barColor = element.dataset.barColor || (isDark ? '#4f46e5' : '#ef4444');
      const trackColor = element.dataset.trackColor || (isDark ? '#374151' : '#f3f4f6');
      
      // Create pie chart instance
      const pieChart = new VanillaPieChart(element, {
        size: parseInt(element.dataset.size || 110),
        lineWidth: parseInt(element.dataset.lineWidth || 3),
        barColor,
        trackColor,
        animate: parseInt(element.dataset.animate || 1000),
        onStep(from, to, percent) {
          // Update the percentage display
          const textElement = this.element.querySelector('div');
          if (textElement) {
            textElement.innerHTML = `${Math.round(percent)}%`;
          }
        },
      });
      
      // Store instance for cleanup
      element.pieChartInstance = pieChart;
    });
  };
  
  // Initialize on load
  initializePieCharts();
  
  // Reinitialize on theme change
  window.addEventListener('adminator:themeChanged', () => {
    setTimeout(initializePieCharts, 100);
  });
  
  // Reinitialize on window resize
  window.addEventListener('resize', () => {
    setTimeout(initializePieCharts, 100);
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    const pieChartElements = document.querySelectorAll('.easy-pie-chart');
    pieChartElements.forEach(element => {
      if (element.pieChartInstance) {
        element.pieChartInstance.destroy();
      }
    });
  });
  
  // Return public API
  return {
    init: initializePieCharts,
    VanillaPieChart,
  };
}());