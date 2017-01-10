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

  .state('squares', {
      url: '/squares',
      templateUrl: './components/squares/squares.html',
      controller: 'squaresCtrl',
      authenticate: true,
      resolve: {
        squaresPromise: ['$stateParams', 'squaresFactory', function($stateParams, squaresFactory) {
          return squaresFactory.getSquares();
        }]
      }
    })

  .state('board', {
      url: '/squares/:id',
      templateUrl: './components/squares/board.html',
      controller: 'squaresCtrl',
      authenticate: true,
      resolve: {
        squaresPromise: ['$stateParams', 'boardFactory', function($stateParams, boardFactory) {
          return boardFactory.getBoard($stateParams.id);
        }]
      }
    });
  $urlRouterProvider.otherwise('/squares');
}]);
