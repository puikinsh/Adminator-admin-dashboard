// import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

export default (function () {
  // ------------------------------------------------------
  // @Popover
  // ------------------------------------------------------

  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  // eslint-disable-next-line no-unused-vars
  const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // ------------------------------------------------------
  // @Tooltips
  // ------------------------------------------------------

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  // eslint-disable-next-line no-unused-vars
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
})();
