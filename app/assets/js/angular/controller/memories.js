app.controller('MemoryCtrl', function ($scope, $stateParams, $http, $state, localStorageService, MemorySvc, $window, config) {

    var user = JSON.parse(localStorageService.get("user"));
    var limit = 10;
    $scope.maxSize = 5;

    //pagination
    $scope.pageChanged = function() {
        //$log.log('Page changed to: ' + $scope.currentPage);
        var filter = { studyProgramId : user.studyProgramId._id};
        MemorySvc.getList(limit, $scope.currentPage, filter).then(function(res){
          $scope.listmemories = res.data.results;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
        });

    };

    var filter = { studyProgramId : user.studyProgramId._id};
    MemorySvc.getList(limit, $scope.currentPage, filter).then(function (res) {
          $scope.listmemories = res.data.results;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
		  var y = res.data;
		  for(var a=0 in y){
			for(var i=0 in y[a].likers){
				if(y[a].likers.createdBy == user._id){
				  console.log("test");
				  $scope.colorlike = "color:red";
				  break;
				}
			  }
		  }
    });

	
	
	$scope.upLike = function(id){
    	 var x = {createdBy: user._id};
		 var id = id;
		 
    	 KnowledgessharingSvc.upLike(x, id).then(function(res){
	        $scope.isSuccess = res.data.isSuccess;
			console.log(res);
	      });

    }
	
	$scope.downLike = function(id){
    	 var x = {createdBy: user._id};
		 var id = id;
		 //console.log(id);
    	 KnowledgessharingSvc.downLike(x, id).then(function(res){
	        $scope.isSuccess = res.isSuccess;
			if(res.isSuccess == true){
				 $scope.isDownLike = true;
			}
	      });

    }

    $scope.resolvedPhoto = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/blog1.jpg";
        }
        return config.url + "/uploads/memory/" + x;
    }

    $scope.goDetail = function(id){
        $window.open($state.href('app.memories_detail', {id: id}, '_blank'));
        $state.go('app.memories');
        // window.open(url,'_blank');
    }
 
});