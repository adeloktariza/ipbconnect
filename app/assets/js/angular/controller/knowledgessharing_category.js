app.controller('KnowledgessharingCategoryCtrl', function ($scope, $stateParams, $http, $state, localStorageService, KnowledgessharingSvc, $window, config) {

	var user = JSON.parse(localStorageService.get("user"));
	var limit = 9;
	$scope.maxSize = 5;

	var categoryID = $stateParams.idCategory;
	KnowledgessharingSvc.getListCategory(limit, $scope.currentPage, categoryID).then(function(res){
		$scope.listknowledgessharing = res.data.items;
		var y = res.data.items;
		//console.log(y);
		var bookmarkid = "";
		$scope.total = res.data.total;
		$scope.offset = Math.ceil($scope.total / limit) * 10;

		for(var a=0 in y){
			$scope.listbookmark = y[a].bookmarks;
			angular.forEach($scope.listbookmark, function(value, key){
				$scope.listbookmarksid = value.createdBy._id;
				if($scope.listbookmarksid == user._id){
				  	//tambah
				  	$scope.listknowledgessharing[a].isBookmark = true;
				  	var thestring = "httpCall" + y[a]._id;
				  	var buttonColor = "#1976D2";
				  	$scope[thestring] = {
				  		'color': buttonColor
				  	} 
				  } else {
				  	//tambah
				  	$scope.listknowledgessharing[a].isBookmark = false;
				  } 
				});
		}

		for(var a=0 in y){
			$scope.listlikers = y[a].likers;
			angular.forEach($scope.listlikers, function(value, key){
				$scope.listlikersid = value.createdBy._id;
				if($scope.listlikersid == user._id){
					$scope.listknowledgessharing[a].isLike = true;
					var thestring = "httpLove" + y[a]._id;
					var buttonColor = "#fc1414c4";
					$scope[thestring] = {
						'color': buttonColor
					} 
				} else {
					$scope.listknowledgessharing[a].isLike = false;
				}
			});
		}
	});

    //pagination
    $scope.pageChanged = function() {
        //console.log('Page changed to: ' + $scope.currentPage);
        var filter = { studyProgramId : user.studyProgramId._id};
        var searchname = $scope.SearchName;
		// console.log(searchname);
		if (searchname != "" && searchname != null && searchname != 'undefined') {
			KnowledgessharingSvc.getSearchList($scope.SearchName,$scope.currentPage,limit).then(function (res) {
				$scope.listknowledgessharing = res.data.items;
				var y = res.data.items;

				for(var a=0 in y){
					$scope.listbookmark = y[a].bookmarks;
					angular.forEach($scope.listbookmark, function(value, key){
						$scope.listbookmarksid = value.createdBy._id;
						if($scope.listbookmarksid == user._id){
				  	//tambah
				  	$scope.listknowledgessharing[a].isBookmark = true;
				  	var thestring = "httpCall" + y[a]._id;
				  	var buttonColor = "#1976D2";
				  	$scope[thestring] = {
				  		'color': buttonColor
				  	} 
				  } else {
				  	//tambah
				  	$scope.listknowledgessharing[a].isBookmark = false;
				  } 
				});
				}

				for(var a=0 in y){
					$scope.listlikers = y[a].likers;
					angular.forEach($scope.listlikers, function(value, key){
						$scope.listlikersid = value.createdBy._id;
						if($scope.listlikersid == user._id){
							$scope.listknowledgessharing[a].isLike = true;
							var thestring = "httpLove" + y[a]._id;
							var buttonColor = "#fc1414c4";
							$scope[thestring] = {
								'color': buttonColor
							} 
						} else {
							$scope.listknowledgessharing[a].isLike = false;
						}
					});
				}
				//console.log($scope.listknowledgessharing);
				$scope.total = res.data.total;
				$scope.offset = Math.ceil($scope.total / limit) * 10;	
			});
		}
		else
		{
			KnowledgessharingSvc.getListCategory(limit, $scope.currentPage, categoryID).then(function(res){
			  //console.log($scope.listknowledgessharing)
			  $scope.listknowledgessharing = res.data.items;
			  var y = res.data.items;

			  for(var a=0 in y){
			  	$scope.listbookmark = y[a].bookmarks;
			  	angular.forEach($scope.listbookmark, function(value, key){
			  		$scope.listbookmarksid = value.createdBy._id;
			  		if($scope.listbookmarksid == user._id){
				  	//tambah
				  	$scope.listknowledgessharing[a].isBookmark = true;
				  	var thestring = "httpCall" + y[a]._id;
				  	var buttonColor = "#1976D2";
				  	$scope[thestring] = {
				  		'color': buttonColor
				  	} 
				  } else {
				  	//tambah
				  	$scope.listknowledgessharing[a].isBookmark = false;
				  } 
				});
			  }

			  for(var a=0 in y){
			  	$scope.listlikers = y[a].likers;
			  	angular.forEach($scope.listlikers, function(value, key){
			  		$scope.listlikersid = value.createdBy._id;
			  		if($scope.listlikersid == user._id){
			  			$scope.listknowledgessharing[a].isLike = true;
			  			var thestring = "httpLove" + y[a]._id;
			  			var buttonColor = "#fc1414c4";
			  			$scope[thestring] = {
			  				'color': buttonColor
			  			} 
			  		} else {
			  			$scope.listknowledgessharing[a].isLike = false;
			  		}
			  	});
			  }
			  //console.log(y.likers);
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;
			  
			  
			});
		}
	};

	$scope.SearchKnowlage = function() {
		var searchname = $scope.SearchName;
		if (searchname != "" && searchname != null && searchname != 'undefined') {
			KnowledgessharingSvc.getSearchList($scope.SearchName).then(function (res) {
				console.log("search!")
				$scope.listknowledgessharing = res.data.items;
				var y = res.data.items;
			 	//console.log($scope.listknowledgessharing);
			 	for(var a=0 in y){
			 		$scope.listbookmark = y[a].bookmarks;
			 		angular.forEach($scope.listbookmark, function(value, key){
			 			$scope.listbookmarksid = value.createdBy._id;
			 			if($scope.listbookmarksid == user._id){
					  	//tambah
					  	$scope.listknowledgessharing[a].isBookmark = true;
					  	var thestring = "httpCall" + y[a]._id;
					  	var buttonColor = "#1976D2";
					  	$scope[thestring] = {
					  		'color': buttonColor
					  	} 
					  } else {
					  		//tambah
					  		$scope.listknowledgessharing[a].isBookmark = false;
					  	} 
					  });
			 	}

			 	for(var a=0 in y){
			 		$scope.listlikers = y[a].likers;
			 		angular.forEach($scope.listlikers, function(value, key){
			 			$scope.listlikersid = value.createdBy._id;
			 			if($scope.listlikersid == user._id){
			 				$scope.listknowledgessharing[a].isLike = true;
			 				var thestring = "httpLove" + y[a]._id;
			 				var buttonColor = "#fc1414c4";
			 				$scope[thestring] = {
			 					'color': buttonColor
			 				} 
			 			} else {
			 				$scope.listknowledgessharing[a].isLike = false;
			 			}
			 		});
			 	}
			 	$scope.total = res.data.total;
			 	$scope.offset = Math.ceil($scope.total / limit) * 10;	
			 });
		}
		else
		{
			KnowledgessharingSvc.getListCategory(limit, $scope.currentPage, categoryID).then(function (res) {
				
				var y = res.data.items;
				 //console.log($scope.listknowledgessharing);
				 $scope.total = res.data.total;
				 $scope.offset = Math.ceil($scope.total / limit) * 10;
				 
				 for(var a=0 in y){
				 	$scope.listbookmark = y[a].bookmarks;
				 	
				 	angular.forEach($scope.listbookmark, function(value, key){
				 		$scope.listbookmarksid = value.createdBy._id;
				 		if($scope.listbookmarksid == user._id){
				 			var thestring = "httpCall" + y[a]._id;
				 			var buttonColor = "#1976D2";
				 			$scope[thestring] = {
				 				'color': buttonColor
				 			}
				 			
				 		}
				 	});
				 }
				 
				 
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
				 $scope.listknowledgessharing = res.data.items;
				 $scope.total = res.data.total;
				 $scope.offset = Math.ceil($scope.total / limit) * 10;
				});
		}
		
	};

	$scope.categoryList = [];
	KnowledgessharingSvc.getCategoryList().then(function(res){
		$scope.categoryList = res.data;
		isNextLoad = true;
		console.log("data ", res.data);

	}, function(err){
	});


	$scope.upLike = function(data){
		var x = {createdBy: user._id};
		var id = data;
		var thestring = "httpLove" + id;
		KnowledgessharingSvc.upLike(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharing){
				if($scope.listknowledgessharing[a]._id == id){
					$scope.listknowledgessharing[a].isLike = true;
					$scope.listknowledgessharing[a].totalLike++;
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
			for(var a=0 in $scope.listknowledgessharing){
				if($scope.listknowledgessharing[a]._id == id){
					$scope.listknowledgessharing[a].isLike = false;
					$scope.listknowledgessharing[a].totalLike--;
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
		var x = {createdBy: user._id};
		var id = id;
		var thestring = "httpCall" + id;
		KnowledgessharingSvc.upBookmarks(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharing){
				if($scope.listknowledgessharing[a]._id == id){
					$scope.listknowledgessharing[a].isBookmark = true;
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
		var x = {createdBy: user._id};
		var id = id;
		var thestring = "httpCall" + id;
		KnowledgessharingSvc.unBookmarks(x, id).then(function(res){
			for(var a=0 in $scope.listknowledgessharing){
				if($scope.listknowledgessharing[a]._id == id){
					$scope.listknowledgessharing[a].isBookmark = false;
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
		$window.open($state.href('app.knowledgessharing_detail', {id: id}, '_blank'));
		$state.go('app.knowledgessharing');
        //window.open(url,'_blank');
    }

});