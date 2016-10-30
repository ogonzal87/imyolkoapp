angular
.module('YolkoApp', [
  'ui.router',
  'Presenter',
  'Attendee',

	// Angular Bootstrap
	'ui.bootstrap'
])
.constant('FIREBASE_URL', 'https://yolko-sandbox1.firebaseio.com/')
.config(ApplicationConfig);

// configure app and routing. this should be the only thing on this file
function ApplicationConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
  	.state('landing', {
  		url: '/',
  		templateUrl: 'views/landing-page/landing-page.html'
  	})
    .state('meeting', {
  		url: '/meeting',
  		templateUrl: 'views/meeting-page/meeting-page.html',
      controller: 'AttendeeCtrl'
  	})
    .state('dashboard', {
  		url: '/dashboard',
  		templateUrl: 'views/dashboard-page/dashboard-page.html',
      controller: 'PresenterCtrl'
  	});  

  $urlRouterProvider.otherwise('/');
}
