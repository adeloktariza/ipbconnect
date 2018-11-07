app.controller('KnowledgessharingListCtrl', function ($scope, $stateParams, $http, $state, localStorageService, KnowledgessharingSvc, $window, config) {

    var user = JSON.parse(localStorageService.get("user"));
    var limit = 6;
    $scope.maxSize = 5;
	var id =  $stateParams.id;

    //pagination
    $scope.pageChanged = function() {
       //console.log('Page changed to: ' + $scope.currentPage);
       var filter = { creator : user._id};
		   KnowledgessharingSvc.getListCreator(limit, $scope.currentPage, filter).then(function (res) {
			  $scope.listknowledgessharingcreator = res.data.items;
			 //console.log($scope.listknowledgessharingcreator);
			  var y = res.data.items;
			  //console.log($scope.listknowledgessharingcreator);
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;
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
        

    };
	
	 $scope.SearchKnowladgeCreator = function() {
		 var searchnamecreator = $scope.SearchNamereator;
		 if (searchnamecreator != "") {
			KnowledgessharingSvc.getSearchListCreator($scope.SearchNameCreator).then(function (res) {
				$scope.listknowledgessharingcreator = res.data.items;
			   var y = res.data.items;
			 //console.log($scope.listknowledgessharingcreator);
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;
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
		}
		else
		{
			KnowledgessharingSvc.getListCreator(limit, $scope.currentPage, filter).then(function (res) {
				  $scope.listknowledgessharingcreator = res.data.items;
				   var y = res.data.items;
				 //console.log($scope.listknowledgessharing);
				  $scope.total = res.data.total;
				  $scope.offset = Math.ceil($scope.total / limit) * 10;
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
		}
		 
	 };
	
    var filter = { creator : user._id};
    KnowledgessharingSvc.getListCreator(limit, $scope.currentPage, filter).then(function (res) {
          $scope.listknowledgessharingcreator = res.data.items;
		  var y = res.data.items;
		  //console.log($scope.listknowledgessharingcreator);
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
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
	
	
	
	
	$scope.goDetailKnowledge = function(idCategory){
		KnowledgessharingSvc.getListCategory(limit, $scope.currentPage, idCategory).then(function(res){
        $scope.listknowledgessharingcategory = res.data.items;
        //console.log("data ", res.data.items);
		}, function(err){
		  
		});
   }
	

	
	$scope.categoryList = [];
		KnowledgessharingSvc.getCategoryList().then(function(res){
		isLoading = false;
		$scope.categoryList = res.data;
		isNextLoad = true;
		//console.log("data ", res.data);

		}, function(err){
	});

	$scope.deleteKnowledgessharing = function(id, title)
	{
		var title = "Are you sure you want to delete " +title+ " ?";
		var id = id;
		//console.log(title);
		if ($window.confirm(title)) {
			KnowledgessharingSvc.deleteKnowledgessharing(id).then(function(res){
				$scope.isSuccess = res.data.isSuccess;
				if($scope.isSuccess == true)
				{
					alert(res.data.message);
					$window.location.reload();
				}
			});
		}	
		
	}
	
	
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

	$scope.resolvedCover = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/blog1.jpg";
        }
        return config.url + "/uploads/knowledgesharing/" + x;
    }
	
	$scope.resolvedPhoto = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/user.jpg";
        }
        return config.url + "/uploads/profile/" + x;
    }
	
    $scope.goDetail = function(id){
        $window.open($state.href('app.knowledgessharing_form', {id: id}, '_blank'));
        $state.go('app.knowledgessharing');
        // window.open(url,'_blank');
    }
 
});