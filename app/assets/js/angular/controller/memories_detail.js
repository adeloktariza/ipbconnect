app.controller('MemoryDetailCtrl', function ($scope, $stateParams, $http, $state, localStorageService, MemorySvc, config, UserSvc, $log, Flash) {

	var user = JSON.parse(localStorageService.get("user"));

	var id = $stateParams.id;
	var limit = 5;
  	$scope.maxSize = 5;

	$scope.commentList = [];
	$scope.isUpLike = true;
	$scope.isDownLike = true;
	$scope.resolvedPhoto = function(x){
		//console.log("image", x);
        if(x == undefined || x == ""){
                return "app/assets/img/user.jpg";
        }
        return config.url + "/uploads/profile/" + x;
    }
	
    //pagination
    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        MemorySvc.getCommentList(limit, $scope.currentPage, id).then(function(res){
            $scope.commentList = res.data.results;
            $scope.total = res.data.total;
            $scope.offset = Math.ceil($scope.total / limit) * 10;
           //resolvedPhoto(res.data.photo);
            
         });
    };

	//get single
    //if( id !== ""){

	MemorySvc.getListById(id).then(function(res){
		$scope.detail = res.data;
		var y = res.data;
		$scope.isDownLike = false;
		$scope.profile = res.data.createdBy.profile;
		//resolvedPhoto(res.data.photo);
		//console.log($scope.detail);
		for(var i=0 in y.likers){
			if(y.likers[i].createdBy == user._id){
			  $scope.isUpLike = true;
			  $scope.isDownLike = false;
			  break;
			}
		  }
		  
	
	 });

         MemorySvc.getCommentList(limit, $scope.currentPage, id).then(function(res){
            $scope.commentList = res.data.results;
            $scope.total = res.data.total;
            $scope.offset = Math.ceil($scope.total / limit) * 10;
			
			
            // resolvedPhoto(res.data.photo);
            
         });

    //}


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
		 $scope.isdontLike = true;
		 for(var i=0 in y.likers){
			if(y.likers[i].createdBy == user._id){
			  $scope.isLike = false;
			  break;
			}
		  }
		  
		  if($scope.isdontLike)
		  {
			   MemorySvc.upLike(x, id).then(function(res){
			   $scope.detail.totalLike++;
			   $scope.isUpLike = true;
			   $scope.isDownLike = false;
			   });
		  }

    }

    $scope.downLike = function(){
    	 var x = {createdBy: user._id};
		 $scope.isLike = false;
		 for(var i=0 in y.likers){
			if(y.likers[i].createdBy == user._id){
			  $scope.isLike = true;
			  break;
			}
		  }
		  //console.log("test"+$scope.isLike);
		  if($scope.isLike)
		  {
			  MemorySvc.downLike(x, id).then(function(res){
				$scope.detail.totalLike--;
				$scope.isUpLike = false;
			    $scope.isDownLike = true;
			  });
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