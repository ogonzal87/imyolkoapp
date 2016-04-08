angular.module('YolkoApp', [
  "firebase",
  "ui.router"
]);

angular.module('YolkoApp')
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  	.state('landingPage', {
  		url: '/',
  		templateUrl: 'views/landing-page/landing-page.html',
      controller: 'SampleCtrl'
  	});

  $urlRouterProvider.otherwise('/');
});



angular.module('YolkoApp')
.controller("SampleCtrl", function($scope, $firebaseObject) {
  var ref = new Firebase("https://yolkoapp.firebaseio.com/oscar");

  var oscar = $firebaseObject(ref);

  oscar.$bindTo($scope, "oscar");
});
