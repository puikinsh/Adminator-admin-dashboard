import SkyconsInit from 'skycons';
import Theme from '../utils/theme.js';

const Skycons = SkyconsInit(window);

export default (function () {
  let icons;
  
  const initSkycons = () => {
    const skyconsColor = Theme.getCSSVar('--skycons-color');
    
    if (icons) {
      icons.pause();
      icons.remove('all');
    }
    
    icons = new Skycons({ 'color': skyconsColor });
    
    const list  = [
      'clear-day',
      'clear-night',
      'partly-cloudy-day',
      'partly-cloudy-night',
      'cloudy',
      'rain',
      'sleet',
      'snow',
      'wind',
      'fog',
    ];
    let i = list.length;

    while (i--) {
      const
        weatherType = list[i],
        elements    = document.getElementsByClassName(weatherType);
      let j = elements.length;

      while (j--) {
        icons.set(elements[j], weatherType);
      }
    }

    icons.play();
  };
  
  // Initialize skycons
  initSkycons();
  
  // Listen for theme changes
  window.addEventListener('adminator:themeChanged', initSkycons);
}());
