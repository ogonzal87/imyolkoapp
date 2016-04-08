angular.module('YolkoApp', [
  'ui.router',
  'firebase'
]);

angular.module('YolkoApp')
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  	.state('landingPage', {
  		url: '/',
  		templateUrl: 'views/landing-page/landing-page.html'
  	});

  $urlRouterProvider.otherwise('/');
});
