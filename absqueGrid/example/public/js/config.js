angular
		.module('absqueGridExample')
		.config(config)
		.run(function($rootScope, $state) {
				$rootScope.$state = $state;
		});


function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

	// Configure Idle settings
	IdleProvider.idle(5); // in seconds
	IdleProvider.timeout(120); // in seconds

	$urlRouterProvider.otherwise("/");

	$ocLazyLoadProvider.config({
			// Set to true if you want to see what and when is dynamically loaded
			debug: false
	});

	$stateProvider
		.state('dashboard', {
			url: '/',
			templateUrl: 'views/common/content.html'
		});
}
