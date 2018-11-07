app.controller('VerifiedCtrl', function ($scope, $stateParams, $http, $state, localStorageService, UserSvc, config, EventsSvc, VacancySvc, $window, Lightbox) {

  $scope.user = JSON.parse(localStorageService.get("user"));

  var programStudy = $scope.user.studyProgramId._id;
  var limit = 12;
  $scope.maxSize = 5;

   //pagination
  $scope.pageChanged = function() {
      //list unverified account
       var x = {fullName:"", batch:"", studyProgramId:programStudy, isVerified: 1};
        UserSvc.explore(limit,$scope.currentPage, x).then(function(res){
          $scope.verifiedList = res.data.results;
          $scope.verifiedCount = res.data.total;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
        });

  };


  //list verified account
  var x = {fullName:"", batch:"", studyProgramId:programStudy, isVerified: 1};
  UserSvc.explore(limit,$scope.currentPage, x).then(function(res){
	  $scope.verifiedList = res.data.results;
	  $scope.verifiedCount = res.data.total;
    $scope.total = res.data.total;
    $scope.offset = Math.ceil($scope.total / limit) * 10;
  });
  
   $scope.resolvedPhotoAccount = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/user.jpg";
        }
        return config.url + "/uploads/profile/" + x;
    }


    $scope.goDetailVacancy = function(id){
        $window.open($state.href('app.vacancydetail', {id: id}, '_blank'));
        $state.go('app.vacancy');
        // window.open(url,'_blank');
    }
    //end vacancy

  $scope.goDetailUser = function(id){

        $state.go("app.detail_user", {id: id});
  }

  $scope.openLightboxModal = function (url) {
    var image = [{ url : config.url + "/uploads/profile/" + url}];
    Lightbox.openModal(image, 0);
  };

 
});