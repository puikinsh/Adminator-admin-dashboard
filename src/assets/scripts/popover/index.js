import * as $ from 'jquery';
import 'bootstrap';

export function initPopovers() {
  // ------------------------------------------------------
  // @Popover
  // ------------------------------------------------------

  $('[data-toggle="popover"]').popover();

  // ------------------------------------------------------
  // @Tooltips
  // ------------------------------------------------------

  $('[data-toggle="tooltip"]').tooltip();
};
