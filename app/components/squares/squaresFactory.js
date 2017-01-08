squaresModule
.factory('squaresFactory', [
    '$http',
    '$log',
    'toastr',
    function($http, $log, toastr){
    var service = [];

    service.getSquare = function() {
      var url = 'http://192.168.1.6:3000/squares/1.json';

      return $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response){
        angular.copy(response.data, service);
      });
    };

  return service;
}]);
