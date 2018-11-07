app.controller('KnowledgessharingByCreatorCtrl', function ($scope, $stateParams, $http, $state, localStorageService, KnowledgessharingSvc, $window, config) {

    var user = JSON.parse(localStorageService.get("user"));
    var limit = 9;
    $scope.maxSize = 5;
	var id =  $stateParams.id;


    //pagination
    $scope.pageChanged = function() {
       //console.log('Page changed to: ' + $scope.currentPage);
       var filter = { creator : user._id};
		   KnowledgessharingSvc.getListCreator(limit, $scope.currentPage, filter).then(function (res) {
			  $scope.listknowledgessharingcreator = res.data.items;
			  var y = res.data.items;
			  //console.log($scope.listknowledgessharingcreator);
			   var bookmarkid = "";
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;
			   for(var a=0 in y){
				  $scope.listbookmark = y[a].bookmarks; 
				  angular.forEach($scope.listbookmark, function(value, key){
					  $scope.listbookmarksid = value.createdBy._id;
					  if($scope.listbookmarksid == user._id){
						$scope.listknowledgessharingcreator[a].isBookmark = true;
						var thestring = "httpCall" + y[a]._id;
						var buttonColor = "#1976D2";
						 $scope[thestring] = {
						  'color': buttonColor
						} 
					} else {
				  	//tambah
				  	$scope.listknowledgessharingcreator[a].isBookmark = false;
					} 
				   });
			  }
			  
			  for(var a=0 in y){
			  $scope.listlikers = y[a].likers;
			  angular.forEach($scope.listlikers, function(value, key){
				  $scope.listlikersid = value.createdBy._id;
				  if($scope.listlikersid == user._id){
					$scope.listknowledgessharingcreator[a].isLike = true;
				    var thestring = "httpLove" + y[a]._id;
					var buttonColor = "#fc1414c4";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	$scope.listknowledgessharingcreator[a].isLike = false;
				 }
			   });
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
				
			});
		}
		else
		{
			KnowledgessharingSvc.getListCreator(limit, $scope.currentPage, filter).then(function (res) {
				  $scope.listknowledgessharingcreator = res.data.items;
				   var y = res.data.items;
				 //console.log($scope.listknowledgessharingcreator);
				  $scope.total = res.data.total;
				  $scope.offset = Math.ceil($scope.total / limit) * 10;
				   for(var a=0 in y){
				  $scope.listbookmark = y[a].bookmarks; 
				  angular.forEach($scope.listbookmark, function(value, key){
					  $scope.listbookmarksid = value.createdBy._id;
					  if($scope.listbookmarksid == user._id){
						$scope.listknowledgessharingcreator[a].isBookmark = true;
						var thestring = "httpCall" + y[a]._id;
						var buttonColor = "#1976D2";
						 $scope[thestring] = {
						  'color': buttonColor
						} 
					} else {
				  	//tambah
				  	$scope.listknowledgessharingcreator[a].isBookmark = false;
					} 
				   });
			  }
			  
			  for(var a=0 in y){
			  $scope.listlikers = y[a].likers;
			  angular.forEach($scope.listlikers, function(value, key){
				  $scope.listlikersid = value.createdBy._id;
				  if($scope.listlikersid == user._id){
					$scope.listknowledgessharingcreator[a].isLike = true;
				    var thestring = "httpLove" + y[a]._id;
					var buttonColor = "#fc1414c4";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	$scope.listknowledgessharingcreator[a].isLike = false;
				  }
			   });
			}  
			});
		}
		 
	 };
	
    var filter = { creator : user._id};
    KnowledgessharingSvc.getListCreator(limit, $scope.currentPage, filter).then(function (res) {
          $scope.listknowledgessharingcreator = res.data.items;
		  var y = res.data.items;
		  //console.log($scope.listknowledgessharingcreator);
		  var bookmarkid = "";
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
		 for(var a=0 in y){
				  $scope.listbookmark = y[a].bookmarks; 
				  angular.forEach($scope.listbookmark, function(value, key){
					  $scope.listbookmarksid = value.createdBy._id;
					  if($scope.listbookmarksid == user._id){
						$scope.listknowledgessharingcreator[a].isBookmark = true;
						var thestring = "httpCall" + y[a]._id;
						var buttonColor = "#1976D2";
						 $scope[thestring] = {
						  'color': buttonColor
						} 
					} else {
				  	//tambah
				  	$scope.listknowledgessharingcreator[a].isBookmark = false;
					} 
				   });
			  }
			  
			  for(var a=0 in y){
			  $scope.listlikers = y[a].likers;
			  angular.forEach($scope.listlikers, function(value, key){
				  $scope.listlikersid = value.createdBy._id;
				  if($scope.listlikersid == user._id){
					$scope.listknowledgessharingcreator[a].isLike = true;
				    var thestring = "httpLove" + y[a]._id;
					var buttonColor = "#fc1414c4";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	$scope.listknowledgessharingcreator[a].isLike = false;
				  }
			   });
			}  

	});
	
	
	
	
	$scope.goDetailKnowledge = function(idCategory){
		KnowledgessharingSvc.getListCategory(limit, $scope.currentPage, idCategory).then(function(res){
        $scope.listknowledgessharingcreator = res.data.items;
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


	
	
	
	$scope.upLike = function(data){
		var x = { creator : user._id};
		var id = data;
		var thestring = "httpLove" + id;
		KnowledgessharingSvc.upLike(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharingcreator){
				if($scope.listknowledgessharingcreator[a]._id == id){
					$scope.listknowledgessharingcreator[a].isLike = true;
					$scope.listknowledgessharingcreator[a].totalLike++;
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
		var x = { creator : user._id};
		var id = data;
		var thestring = "httpLove" + id;
		KnowledgessharingSvc.unLike(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharingcreator){
				if($scope.listknowledgessharingcreator[a]._id == id){
					$scope.listknowledgessharingcreator[a].isLike = false;
					$scope.listknowledgessharingcreator[a].totalLike--;
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

	$scope.upBookmarks = function(id){
		var x = { creator : user._id};
		var id = id;
		var thestring = "httpCall" + id;
		KnowledgessharingSvc.upBookmarks(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharingcreator){
				if($scope.listknowledgessharingcreator[a]._id == id){
					$scope.listknowledgessharingcreator[a].isBookmark = true;
				}
			}  
			$scope.isSuccess = res.data.isSuccess;
			if($scope.isSuccess == true)
			{
				var buttonColor = "#1976D2";
				$scope[thestring] = {
					'color': buttonColor
				} 
			}

		});

	}

	$scope.unBookmarks = function(id){
		var x = { creator : user._id};
		var id = id;
		var thestring = "httpCall" + id;
		KnowledgessharingSvc.unBookmarks(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharingcreator){
				if($scope.listknowledgessharingcreator[a]._id == id){
					$scope.listknowledgessharingcreator[a].isBookmark = false;
				}
			}  
			$scope.isSuccess = res.data.isSuccess;
			if($scope.isSuccess == true)
			{
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
        $state.go('app.knowledgessharing-bycreator');
        // window.open(url,'_blank');
    }
 
});