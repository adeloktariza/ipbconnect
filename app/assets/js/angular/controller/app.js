app.controller('AppCtrl', function ($scope, $stateParams, $http, $state, localStorageService, $location, $window, config) {

	//need get url path for active class
	var path = $location.path();

	//console.log("path", path);

	if( path == "/" ){
		$("#home").addClass("active");
	}else if( path == "/events" ){
		$("#event").addClass("active");
	}else if( path == "/vacancy" ){
		$("#vacancy").addClass("active");
	}else if( path == "/memories" ){
		$("#memory").addClass("active");
	}else if( path == "/alumni" ){
		$("#alumni").addClass("active");
	}else if( path == "/knowledgessharing" ){
		$("#knowledgessharing").addClass("active");
	}


	$scope.user = JSON.parse(localStorageService.get("user"));
	//console.log("app", $scope.user);
	$scope.resolvedPhotoAccount = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/user.jpg";
        }
        return config.url + "/uploads/profile/" + x;
    }

	if($scope.user != null){
	}

	$scope.logout = function() {
		localStorageService.set("user", null);
		localStorageService.set("token", null);
		$state.go('login');
  	};
 
});