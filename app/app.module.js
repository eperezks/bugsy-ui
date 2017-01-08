'use strict';

var squaresModule = angular.module('myApp.squares', []);
// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ui.router',
  'ngAnimate',
  'foundation',
  'toastr',
  'myApp.squares',
  'application.appConfig'
]);

