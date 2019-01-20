import * as $ from 'jquery';
import 'easy-pie-chart/dist/jquery.easypiechart.min.js';

export default (function () {
  if ($('.easy-pie-chart').length > 0) {
    $('.easy-pie-chart').easyPieChart({
      lineWidth:7,
      lineCap:"square",
      scaleColor:false,
      animate: 2500,
      onStep(from, to, percent) {
        this.el.children[0].innerHTML = `${Math.round(percent)} %`;
      },
    });
  }
}())

