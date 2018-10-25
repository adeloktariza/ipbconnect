app.controller('LoginCtrl', function ($scope, $stateParams, $http, $state, localStorageService, $filter, UserSvc, $window, Flash) {

	$scope.login = function(){
		$scope.form = $scope.data;
		

				//service create events
 	    UserSvc.login($scope.form).then(function (res) { //upload function returns a promise
    
            if(res.data.isSuccess){ //validate success
                // var message = '<strong>Login Success!</strong> You will redirect to homepage.';
                // Flash.create('success', message);
      
                localStorageService.set("user", JSON.stringify(res.data.item));
                localStorageService.set("token", "JWT " + res.data.token);
             	$state.go('app.home');
                var message = "Welcome, " + res.data.item.fullName;
                Flash.create('success', message);
            } else {
                var message = res.data.message;
                Flash.create('danger', message);
            	$state.go('login')
            }
        }, function (res) { //catch error

        }, function (evt) { 
            console.log(evt);
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });	
	
	
	
	}
	
});

