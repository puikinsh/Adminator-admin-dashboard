import masonry from "../masonry";
import chart from "../charts/chartJS";
import pieChart from "../charts/easyPieChart";

/** @ngInject */
const DashboardController = ($scope, AdsService, UserService) => {
    $scope.$on('loadUserSuccess', function(event, user) {
        $scope.user = user;
    }); 

    //link al ad-detail
    $scope.$on('loadUserSuccess', async (event, user) => {
        await AdsService.fetchAdsService()
          .then( (result) => { $scope.ads = result; })
          .catch( (error) => { console.log(error); })
    });



        
    // tutte le funzioni del controller
    UserService.loadUser();
    masonry();
    chart();
    pieChart();
}

export default DashboardController;

