app.controller('SharefileDetailCtrl', function ($scope, $stateParams, $http, $state, localStorageService, MemorySvc, config, UserSvc, $log, Flash) {

	var user = JSON.parse(localStorageService.get("user"));

	var id = $stateParams.id;
	var limit = 5;
  $scope.maxSize = 5;

	$scope.commentList = [];
	$scope.isUpLike = true;
	$scope.isDownLike = true;

    //pagination
    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        SharefileSvc.getCommentList(limit, $scope.currentPage, id).then(function(res){
            $scope.commentList = res.data.results;
            $scope.total = res.data.total;
            $scope.offset = Math.ceil($scope.total / limit) * 10;
            // resolvedFile(res.data.file);
            
         });
    };

	//get single
    if( id !== ""){

         SharefileSvc.getListById(id).then(function(res){
            $scope.detail = res.data;
            $scope.profile = res.data.createdBy.profile;
            resolvedFile(res.data.file);
            
         });

         SharefileSvc.getCommentList(limit, $scope.currentPage, id).then(function(res){
            $scope.commentList = res.data.results;
            $scope.total = res.data.total;
            $scope.offset = Math.ceil($scope.total / limit) * 10;
            // resolvedPhoto(res.data.photo);
            
         });

    }


    $scope.newComment = function(){
      if($scope.comment == "" || $scope.comment == undefined){
        var message = "Please write comment first.";
        Flash.create('danger', message);
        return false;
      }
      var x = {value: $scope.comment, createdBy: user._id};
      MemorySvc.comment(x, id).then(function(res){
        $scope.comment = "";
        $scope.commentList.push(res.data.item);
      });
    }

    $scope.upLike = function(){

    	 var x = {createdBy: user._id};
    	 MemorySvc.upLike(x, id).then(function(res){
	        $scope.detail.totalLike++;
	        $scope.isUpLike = false;
			    $scope.isDownLike = true;

	      });

    }

    $scope.downLike = function(){

    	 var x = {createdBy: user._id};
    	 MemorySvc.downLike(x, id).then(function(res){
	        $scope.detail.totalLike--;
	    	  $scope.isUpLike = true;
			    $scope.isDownLike = false;
	      });

    }

    var resolvedPhoto = function(x){
    	// console.log("image", x);
	    if(x == undefined || x == "" || x == null){
	        $scope.detail.picture = "app/assets/img/user.jpg";
	    }else{
	    	$scope.detail.picture =  config.url + "/uploads/memory/" + x;
	    }
	    
	}

	$scope.resolvedPhotoComment = function(x){
    	// console.log("image", x);
	    if(x.photo == undefined || x.photo == "" || x.photo == null){
	       return "app/assets/img/user.jpg";
	    }else{
	    	return  config.url + "/uploads/profile/" + x.photo;
	    }
	    
	}
 
});