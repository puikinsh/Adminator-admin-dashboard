import * as $ from 'jquery';
import Masonry from 'masonry-layout';

const masonry = function () {
  $(document).ready( () => {
    if ($('.masonry').length > 0) {
      new Masonry('.masonry', {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-sizer',
        percentPosition: true,
      });
    }
  });
}

export default masonry;