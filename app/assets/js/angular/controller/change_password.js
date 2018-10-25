app.controller('PasswordCtrl', function ($scope, $log, $stateParams, $http, $state, localStorageService, $filter, MasterSvc, Upload, NgMap, config, UserSvc, Flash) {

    // data user
    var user = JSON.parse(localStorageService.get("user"));


	$scope.data = {};
    $scope.form = {};
  
    $scope.savePassword = function(){

        if($scope.form.newPass !== $scope.form.newPassConfirm){
            alert("Confirm new password doesn't match !");
            return;
        }

        //service edit profile
        UserSvc.editPassword($scope.form, user._id).then(function (res) { //upload function returns a promise
             if(res.data.isSuccess){ //validate success
                var message = "Change password success.";
                Flash.create('success', message);
                $state.go('app.setting');
            } else {
                var message = "Change password failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 

        });

    }


    $scope.reset = function(){

        $scope.form = "";

    }
 
});