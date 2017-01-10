squaresModule
.factory('squaresFactory', [
    '$http',
    '$log',
    'APP_CONFIG',
    'toastr',
    function($http, $log, APP_CONFIG, toastr){
    var service = [];

    service.getSquares = function() {
      var url = APP_CONFIG.API_URL + '/squares.json';

      return $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response){
        angular.copy(response.data, service);
      });
    };

  return service;
}]);
