app.controller('HomeCtrl', function ($scope, $stateParams, $http, $state, localStorageService, UserSvc, config, EventsSvc, VacancySvc, $window, Lightbox, Flash) {

  $scope.user = JSON.parse(localStorageService.get("user"));
  console.log("user", $scope.user);
  var programStudy = $scope.user.studyProgramId._id;
  var userBatch = $scope.user.batch;
  var limit = 4;
  var page = 1;


  //list unverified account
  var z = {fullName:"", batch:userBatch, studyProgramId:programStudy, isVerified: 0};
  UserSvc.explore(limit,page, z).then(function(res){
  		$scope.unverfiedList = res.data.results;
  		$scope.unverifiedCount = res.data.total;
  });

  //list verified account
  var x = {fullName:"", batch:"", studyProgramId:programStudy, isVerified: 1};
  UserSvc.explore(limit, page, x).then(function(res){
	  $scope.verifiedList = res.data.results;
	  $scope.verifiedCount = res.data.total;
  });
  
  UserSvc.countUser(programStudy).then(function(res){
	  	var data = {};
	  	data.gender = res.data.results.gender;
	  	data.userType = res.data.results.userType;
	  	data.count = res.data.total;
	  	$scope.count = data.count;
	  },function(err){
  	
  });

   $scope.resolvedPhotoAccount = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/user.jpg";
        }
        return config.url + "/uploads/profile/" + x;
    }

   //list events
   EventsSvc.getEvents(limit, page, '').then(function (res) {
              console.log("events", res);
              $scope.listevents = res.data.results;
              $scope.eventCount = res.data.total;

   });

   $scope.resolvedPhoto = function(x){
	    if(x == undefined || x == ""){
	            return "app/assets/img/event.jpg";
	    }
	    return config.url + "/uploads/event/" + x;
	 }

    // end events

    //list vacancy
    var y = {studyProgramId : $scope.user.studyProgramId._id};
    VacancySvc.getLowongans(limit,page,y).then(function (res) {
            	$scope.listvacancy = res.data.results;
              $scope.vacancyCount = res.data.total;
    });

    $scope.goDetailVacancy = function(id){
        $window.open($state.href('app.vacancydetail', {id: id}, '_blank'));
        $state.go('app.vacancy');
        // window.open(url,'_blank');
    }

  $scope.goDetailUser = function(id){

        $state.go("app.detail_user", {id: id});
  }

  $scope.openLightboxModal = function (url) {
    var image = [{ url : config.url + "/uploads/profile/" + url}];
    Lightbox.openModal(image, 0);
  };
    //end vacancy
	
	$scope.goDetail = function(id){
        $state.go("app.events_detail", {id: id});
    }
 
});