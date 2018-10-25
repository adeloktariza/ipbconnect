app.controller('ForgotPassCtrl', function ($scope, $stateParams, $http, $state, localStorageService, $filter, UserSvc,$window, MasterSvc, Flash) {
	$scope.send = function(){
		$scope.form = $scope.data;
		UserSvc.forgotPass($scope.form).then(function (res) {
			if(res.data.isSuccess){ //validate success
                var message = res.message;
				window.alert('Success !', message);
			} else {
				var message = res.message;
				window.alert('Error !', message);
			}
		})
	}
});