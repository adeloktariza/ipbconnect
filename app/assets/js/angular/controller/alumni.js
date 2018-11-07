app.controller('AlumniCtrl', function ($scope, $stateParams, $http, $state, localStorageService, UserSvc, $window, config, $log, MasterSvc, Lightbox) {

	var limit = 12;
    $scope.maxSize = 5;
    $scope.userList = [];
    // $scope.currentPage = 1;

    //pagination
    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        var filter = { isVerified : 1};
        filter = $scope.query;
        UserSvc.explore(limit, $scope.currentPage, filter).then(function(res){
          $scope.userList = res.data.results;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
        });

    };

    MasterSvc.getStudyProgram().then(function (res) {
                $scope.faculty = res.data;
    });

    var x = {isVerified: 1}
    UserSvc.explore(limit, $scope.currentPage, x).then(function(res){
          $scope.userList = res.data.results;
          console.log("alumni", res);
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
          
    });


    $scope.resolvedPhoto = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/user.jpg";
        }
        return config.url + "/uploads/profile/" + x;
    }

  $scope.goDetailUser = function(id){
        $state.go("app.detail_user", {id: id});
  }

  $scope.openLightboxModal = function (url) {
    var image = [{ url : config.url + "/uploads/profile/" + url}];
    Lightbox.openModal(image, 0);
  };
 
});