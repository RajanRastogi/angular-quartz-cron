var module = angular.module("aqc-example",["angular-quartz-cron"]);

module.controller("mainCtrl", [
	"$scope",
	function($scope){
		$scope.output1 = null;
		
		$scope.output2 = null;
		$scope.init = "0 10 10 ? * 1";

		$scope.output3 = null;
		$scope.config = {
			options: {
				allowMinute: false
			}
		}
	}
]);