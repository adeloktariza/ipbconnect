app.controller('EventsCtrl', function ($scope, $stateParams, $http, $state, localStorageService, EventsSvc, config, $log) {

	var limit = 10;
  $scope.maxSize = 5;
    // $scope.currentPage = 1;

    //pagination
    $scope.pageChanged = function() {
         EventsSvc.getEvents(limit, $scope.currentPage, $scope.query).then(function (res) {
              $scope.listvacancy = res.data.results;
              $scope.total = res.data.total;
              $scope.offset = Math.ceil($scope.total / limit) * 10;

         });
    };


    EventsSvc.getEvents(limit, $scope.currentPage).then(function (res) {
          console.log("res", res);
    	    $scope.listvacancy = res.data.results;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;

    });



     $scope.resolvedPhoto = function(x){
	    if(x == undefined || x == ""){
	            return "app/assets/img/event.jpg";
	    }
	    return config.url + "/uploads/event/" + x;
	 }

    $scope.filterEvents = function(){

        var query = $scope.query;

    }

    $scope.goDetail = function(id){
        $state.go("app.events_detail", {id: id});
    }
     
 
});