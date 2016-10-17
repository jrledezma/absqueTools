'use strict';

angular
	.module('absqueGridExample')
	.controller('MainCtrl', MainCtrl);

function MainCtrl($scope) {

	var vm = this;
	start();

	function start(){
		var currentDate = new Date();
		$scope.currentYear = currentDate.getFullYear();
	}
}