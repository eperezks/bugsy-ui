myApp

.config([
'$stateProvider',
'$urlRouterProvider',
'$httpProvider',
function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Enable CORS
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $stateProvider

  .state('square', {
      url: '/',
      templateUrl: './components/squares/squares.html',
      controller: 'squaresCtrl',
      authenticate: true,
      resolve: {
        squaresPromise: ['$stateParams', 'squaresFactory', function($stateParams, squaresFactory) {
          return squaresFactory.getSquare($stateParams.id);
        }]
      }
    });
  $urlRouterProvider.otherwise('/');
}]);
