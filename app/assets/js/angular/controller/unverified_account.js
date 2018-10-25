app.controller('UnverifiedCtrl', function ($scope, $stateParams, $http, $state, localStorageService, UserSvc, config, EventsSvc, VacancySvc, $window, Lightbox, Flash) {

  $scope.user = JSON.parse(localStorageService.get("user"));

  var programStudy = $scope.user.studyProgramId._id;
  var limit = 12;
  $scope.maxSize = 5;

   //pagination
  $scope.pageChanged = function() {
      //list unverified account
      var z = {fullName:"", batch:"", studyProgramId:programStudy, isVerified: 0};
      UserSvc.explore(limit,$scope.currentPage, z).then(function(res){
          $scope.unverfiedList = res.data.results;
          $scope.unverifiedCount = res.data.total;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
      });

  };

  //list unverified account
  var z = {fullName:"", batch:"", studyProgramId:programStudy, isVerified: 0};
  UserSvc.explore(limit,$scope.currentPage, z).then(function(res){
  		$scope.unverfiedList = res.data.results;
  		$scope.unverifiedCount = res.data.total;
      $scope.total = res.data.total;
      $scope.offset = Math.ceil($scope.total / limit) * 10;
  });

   $scope.resolvedPhotoAccount = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/user.jpg";
        }
        return config.url + "/uploads/profile/" + x;
    }

    $scope.approveRequest = function(id){
        UserSvc.verify(id).then(function (res) { //upload function returns a promise
            if(res.data.isSuccess){ //validate success
                var message = "User has been verified.";
                Flash.create('success', message);
                $state.reload();
            } else {
                var message = "Failed to verified user.";
                Flash.create('danger', message);
            }
        });   
    }

  $scope.goDetailUser = function(id){
        $state.go("app.detail_user", {id: id});
  }

  $scope.openLightboxModal = function (url) {
    var image = [{ url : config.url + "/uploads/profile/" + url}];
    Lightbox.openModal(image, 0);
  };


 
});