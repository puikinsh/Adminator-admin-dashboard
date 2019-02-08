import * as $ from 'jquery';
import './trumbowyg';

export default (function () {
  $.trumbowyg.svgPath = '/assets/static/trumbowyg/icons.svg';
  window.addEventListener('load', () => {
    if ($('.wysiwyg-editor').length > 0) {
      $('.wysiwyg-editor').trumbowyg({
        btns: [
          ['undo', 'redo'],
          ['formatting'],
          ['strong'],
          ['link'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
          ['unorderedList', 'orderedList'],
          ['horizontalRule'],
          ['removeformat']
        ],
        autogrow: true
      });
    }
  });
}());
