import masonry from "../masonry";
import chart from "../charts/chartJS";
import pieChart from "../charts/easyPieChart";

/** @ngInject */
const DashboardController = ($scope, AdsService, UserService, $location) => {
    $scope.$on('loadUserSuccess', async function(event, user) {
        $scope.user = user;

        // load ads
        //await AdsService.fetchAdsService(user)
        //.then( (result) => { $scope.ads = result; })
        //.catch( (error) => { console.log(error); })
        if ( user.role === 'user' || user.role === 'company' ){
            $location.path( "/ads" );
        }
        
        // tutte le funzioni del controller
        masonry();
        chart();
        pieChart();

    });  
    UserService.loadUser();
}

export default DashboardController;

