import Masonry from 'masonry-layout';

export default (function () {
  window.addEventListener('load', () => {
    const masonryElement = document.querySelector('.masonry');
    if (masonryElement) {
      new Masonry(masonryElement, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-sizer',
        percentPosition: true,
      });
    }
  });
}());
