squaresModule
.factory('boardFactory', [
    '$http',
    '$log',
    'APP_CONFIG',
    'toastr',
    function($http, $log, APP_CONFIG, toastr){
    var service = [];

    service.deleteBox = function(box) {
      var url = APP_CONFIG.API_URL + '/boxes/' + box.id + '.json';

      return $http({
        method: 'DELETE',
        url: url
      }).then(function successCallback(response){
        angular.copy(response.data, service);
      });
    };


    service.updateBox = function(box) {
      var url = APP_CONFIG.API_URL + '/boxes/' + box.id + '.json';
      console.log('updating box with');
      console.log(box);
      return $http({
        method: 'PATCH',
        url: url,
        data: {
          name: box.name
        }
      }).then(function successCallback(response){
        angular.copy(response.data, service);
      });
    };

    service.getBoard = function(id) {
      var url = APP_CONFIG.API_URL + '/squares/' + id + '.json';

      return $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response){
        angular.copy(response.data, service);
      });
    };

  return service;
}]);
