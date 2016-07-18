
var microappsApp = angular.module('microappsApp', ['ngRoute']);

microappsApp.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
microappsApp.config(function ($routeProvider) {
	$routeProvider
	// route for the thank you page
	.when('/', {
		templateUrl: 'pages/home.html',
		controller: 'mainController'
	}).when('/thankyou/:username', {
		templateUrl: 'pages/thankyou.html',
		controller: 'thankyou'
	});
});
// create the controller and inject Angular's $scope
microappsApp.controller('mainController', function ($scope, $http, $timeout, $location, $routeParams) {
	$scope.message = 'Please donate between 1-100 EUR | USD!';
	$scope.activeStep = 0;
	$scope.progress = { 'width': '46%' };
	$scope.functionThatReturnsPromise = function () {
		return $timeout(angular.noop, 1000);
	};

	$scope.setActive = function (stepItem) {
		var paymentType = "DB";
		var url = "https://test.oppwa.com/v1/checkouts?";
		var data = "authentication.userId=8a8294174b7ecb28014b9699220015cc&authentication.password=sy6KJsT8&authentication.entityId=8a8294174b7ecb28014b9699220015ca&amount=" + $scope.amount + "&currency=" + $scope.currency + "&paymentType=" + paymentType;
		var config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};
		$scope.progress = { 'width': '76%' };

		for (var i = 0; i < localStorage.length; i++) {
			console.log(localStorage.getItem(localStorage.key(i)));
		}
		function donated(username) {
			var donate = false;
			for (var i = 0; i < localStorage.length; i++) {
				var user = localStorage.getItem(localStorage.key(i));
				user = JSON.parse(user);
				if (user.username === $scope.username) {
					donate = timeDifference(user.date);
				}
			}
			return donate;
		}
		function timeDifference(timeStamp) {
			//2016-07-17 16:53:42+0000
			var d2 = new Date();
			var d1 = new Date(timeStamp);
			var seconds = (d2 - d1) / 1000;
			console.log(seconds);
			if (seconds < 3600) {
				return true;
			} else {
				return false;
			}
		}

		if (donated($scope.username)) {
			$location.path("/thankyou/" + $scope.username);
		} else {
			$http.post(url, data, config).success(function (data, status, headers, config) {
				var script = document.createElement('script');
				script.src = "https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=" + data.id;
				$("head").append($('<script type="text/javascript">var wpwlOptions = {style:"card"};</script>'), script);
				$(".step2").append($('<form action="http://microappstestapp.com.s3-website-us-east-1.amazonaws.com/#/thankyou/' + $scope.username + '" class="paymentWidgets">VISA MASTER AMEX</form>'));
				$scope.progress = { 'width': '80%' };
				$scope.activeStep = stepItem;
				$scope.progress = { 'width': '100%' };
				var user = {};
				user.username = $scope.username;
				user.password = $scope.password;
				user.amount = $scope.amount;
				user.currency = $scope.currency;
				user.date = data.timestamp;
				user.ndc = data.ndc;
				user.buildNumber = data.buildNumber;
				user.resultCode = data.result.code;
				user.resultDescription = data.result.description;
				user.dataId = data.id;
				localStorage.setItem(user.username, JSON.stringify(user));
			}).error(function (data, status, header, config) {});
		}
	};
});
microappsApp.controller('thankyou', function ($scope, $http, $routeParams) {
	$scope.username = $routeParams.username;
	var userNow = {};
	if ($routeParams.username) {
		for (var i = localStorage.length - 1; i >= 0; i--) {
			var user = localStorage.getItem(localStorage.key(i));
			user = JSON.parse(user);
			if (user.username === $routeParams.username) {
				userNow = user;
			}
		}
	}
	function timeAgo(time) {
		var timeAgoFromNow;
		var date = new Date(time);
		var currentDate = new Date();
		var miliseconds = currentDate - date;
		var secondsDiff = miliseconds / 1000;
		var minutesDiff = secondsDiff / 60;
		var hoursDiff = minutesDiff / 60;
		var daysDiff = hoursDiff / 24;
		if (minutesDiff < 60) {
			timeAgoFromNow = parseInt(minutesDiff) + ' minutes ago and please wait ' + (60 - parseInt(minutesDiff)) + ' more minutes to donate again';
		} else if (hoursDiff < 60) {
			timeAgoFromNow = parseInt(hoursDiff) + ' hours ago';
		} else if (daysDiff < 30) {
			timeAgoFromNow = parseInt(daysDiff) + ' days ago';
		} else {
			timeAgoFromNow = 'ages ago';
		}
		return timeAgoFromNow;
	}
	$scope.time = timeAgo(userNow.date);
	$scope.userAmt = userNow.amount;
	$scope.userCurrency = userNow.currency;
	$scope.userNdc = userNow.ndc;
	$scope.userBuildNumber = userNow.buildNumber;
	$scope.userResultCode = userNow.resultCode;
	$scope.userResultDesc = userNow.resultDescription;
	$scope.userCheckoutId = userNow.dataId;
});

microappsApp.directive('clickAndDisable', function () {
	return {
		scope: {
			clickAndDisable: '&'
		},
		link: function (scope, iElement, iAttrs) {
			iElement.bind('click', function () {
				iElement.prop('disabled', true);
				scope.clickAndDisable().finally(function () {
					iElement.prop('disabled', false);
				});
			});
		}
	};
});