import masonry from "../masonry";
import chart from "../charts/chartJS";
import pieChart from "../charts/easyPieChart";

/** @ngInject */
const DashboardController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function(event, user) {
        $scope.user = user;
    }); 
        
    // tutte le funzioni del controller
    masonry();
    chart();
    pieChart();
}

export default DashboardController;