/** @ngInject */
const DashboardController = ($scope, $cookies) => {
    const token = $cookies.get('access_token');
    console.log(token);
    
    if(typeof(token) !== "undefined"){
        $scope.user = parseJwt( token );
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export default DashboardController;