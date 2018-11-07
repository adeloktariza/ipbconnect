app.controller('KnowledgessharingBookmarksCtrl', function ($scope, $stateParams, $http, $state, localStorageService, KnowledgessharingSvc, $window, config) {

    var user = JSON.parse(localStorageService.get("user"));
    var limit = 9;
    $scope.maxSize = 5;
	var id =  $stateParams.id;

    //pagination
    $scope.pageChanged = function() {
       //console.log('Page changed to: ' + $scope.currentPage);
	   
       var filter = { user : user._id};
		var searchname = $scope.SearchName;
		// console.log(searchname);
	    if (searchname != "" && searchname != null && searchname != 'undefined') {
			KnowledgessharingSvc.getSearchList($scope.SearchName,$scope.currentPage,limit).then(function (res) {
			$scope.listknowledgessharingbookmarks = res.data.items;
			  var y = res.data.items;
			 //console.log($scope.listknowledgessharingbookmarks);
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;	
			});
		}
		else
		{
			KnowledgessharingSvc.getList(limit, $scope.currentPage, filter).then(function(res){
			  //console.log($scope.listknowledgessharingbookmarks)
			  $scope.listknowledgessharingbookmarks = res.data.items;
			  var y = res.data.items;
			  //console.log(y.likers);
			  var bookmarkid = "";
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;
			  
			  for(var a=0 in y){
			  $scope.listlikers = y[a].likers;
			  angular.forEach($scope.listlikers, function(value, key){
				  $scope.listlikersid = value.createdBy._id;
				  if($scope.listlikersid == user._id){
					$scope.listknowledgessharingbookmarks[a].isLike = true;
				    var thestring = "httpLove" + y[a]._id;
					var buttonColor = "#fc1414c4";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	$scope.listknowledgessharingbookmarks[a].isLike = false;
				  }
			   });
			}  
        });
		}

    };
	
	 $scope.SearchKnowladgeBookmarks = function() {
		 var searchname = $scope.SearchName;
		 if (searchname != "" && searchname != null && searchname != 'undefined') {
			KnowledgessharingSvc.getSearchListBookmarks($scope.SearchName).then(function (res) {
				$scope.listknowledgessharingbookmarks = res.data.items;
			   var y = res.data.items;
			 //console.log($scope.listknowledgessharingbookmarks);
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;	
			});
		}
		else
		{
			KnowledgessharingSvc.getList(limit, $scope.currentPage, filter).then(function (res) {
				  $scope.listknowledgessharingbookmarks = res.data.items;
				   var y = res.data.items;
				 //console.log($scope.listknowledgessharingbookmarks);
				  $scope.total = res.data.total;
				  $scope.offset = Math.ceil($scope.total / limit) * 10;
				  
				   for(var a=0 in y){
					  $scope.listlikers = y[a].likers;
					  angular.forEach($scope.listlikers, function(value, key){
						  $scope.listlikersid = value.createdBy._id;
						  if($scope.listlikersid == user._id){
							var thestring = "httpLove" + y[a]._id;
							var buttonColor = "#fc1414c4";
							 $scope[thestring] = {
							  'color': buttonColor
							} 
						  }
					   });
				  }
		 });
		}
	 };
	
    var filter = { user : user._id};
    KnowledgessharingSvc.getBookmarks(limit, $scope.currentPage, filter).then(function (res) {
          $scope.listknowledgessharingbookmarks = res.data.items;
		  var y = res.data.items;
		  //console.log($scope.listknowledgessharingbookmarks);
           var bookmarkid = "";
		  $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
		  
		  for(var a=0 in y){
			  $scope.listlikers = y[a].likers;
			  angular.forEach($scope.listlikers, function(value, key){
				  $scope.listlikersid = value.createdBy._id;
				  if($scope.listlikersid == user._id){
				  	$scope.listknowledgessharingbookmarks[a].isLike = true;
				    var thestring = "httpLove" + y[a]._id;
					var buttonColor = "#fc1414c4";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	$scope.listknowledgessharingbookmarks[a].isLike = false;
				  }
			   });
		  }
    });
	
	
	
	
	$scope.goDetailKnowledge = function(idCategory){
		KnowledgessharingSvc.getListCategory(limit, $scope.currentPage, idCategory).then(function(res){
        $scope.listknowledgessharingcategory = res.data.items;
        //console.log("data ", res.data.items);
		}, function(err){
		  
		});
   }
   
   $scope.unBookmarks = function(id){
    	 var x = {createdBy: user._id};
		 var id = id;
    	 KnowledgessharingSvc.unBookmarks(x, id).then(function(res){
	        $scope.isSuccess = res.data.isSuccess;
			if($scope.isSuccess == true)
			{
				//$window.alert(res.data.message);
			}
	        window.location.reload();

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

	$scope.upBookmarks = function(){

    	 var x = {createdBy: user._id};
    	 KnowledgessharingSvc.upBookmarks(x, id).then(function(res){
	        $scope.detail.totalLike++;
	        $scope.isUpBookmarks = false;
			    $scope.isDownBookmarks = true;

	      });

    }
	
	$scope.upLike = function(data){
		var x = {createdBy: user._id};
		 var id = data;
		 var thestring = "httpLove" + id;
		 KnowledgessharingSvc.upLike(x, id).then(function(res){
		 		for(var a=0 in $scope.listknowledgessharingbookmarks){
		 			if($scope.listknowledgessharingbookmarks[a]._id == id){
		 				$scope.listknowledgessharingbookmarks[a].isLike = true;
		 				$scope.listknowledgessharingbookmarks[a].totalLike++;
		 			}
		 		}
				$scope.isSuccess = res.data.isSuccess;
				if($scope.isSuccess == true)
				{
					var buttonColor = "#fc1414c4";
					$scope[thestring] = {
					  'color': buttonColor
					} 
					//$window.alert(res.data.message);
				}

			});

    }
	
	 $scope.unLike = function(data){
	 	var x = {createdBy: user._id};
	 	var id = data;
	 	var thestring = "httpLove" + id;
		KnowledgessharingSvc.unLike(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharingbookmarks){
		 			if($scope.listknowledgessharingbookmarks[a]._id == id){
		 				$scope.listknowledgessharingbookmarks[a].isLike = false;
		 				$scope.listknowledgessharingbookmarks[a].totalLike--;
		 			}
		 		}
	        $scope.isSuccess = res.data.isSuccess;
			if($scope.isSuccess == true){
				var buttonColor = "#535b60";
				$scope[thestring] = {
					'color': buttonColor
				} 
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
	
	$scope.downloadFile = function(x){
		//console.log(x);
		//console.log("test");
		var file = "";
		KnowledgessharingSvc.getListById(x).then(function(res){
			var fileDownload = config.url + "/uploads/knowledgesharing/" + res.data.file;
			console.log(fileDownload);
			$window.location.href = fileDownload;
		});
	}
	
    $scope.goDetail = function(id){
        $window.open($state.href('app.knowledgessharing_detail', {id: id}, '_blank'));
        $state.go('app.knowledgessharing');
        // window.open(url,'_blank');
    }
 
});