import PerfectScrollbar from 'perfect-scrollbar';

export default (function () {
  const scrollables = document.querySelectorAll('.scrollable');
  if (scrollables.length > 0) {
    scrollables.forEach(el => {
      new PerfectScrollbar(el);
    });
  }
}());
