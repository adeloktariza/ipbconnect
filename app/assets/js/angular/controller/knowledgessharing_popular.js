app.controller('KnowledgessharingPopularCtrl', function ($scope, $stateParams, $http, $state, localStorageService, KnowledgessharingSvc, $window, config) {

    var user = JSON.parse(localStorageService.get("user"));
    var limit = 9;
    $scope.maxSize = 5;

    //pagination
	 $scope.pageChanged = function() {
        //console.log('Page changed to: ' + $scope.currentPage);
        var filter = { studyProgramId : user.studyProgramId._id};
		var searchnamepopular = $scope.SearchNamePopular;
		//console.log(searchnamepopular);
	    if (searchnamepopular != "" && searchnamepopular != null && searchnamepopular != 'undefined') {
			KnowledgessharingSvc.getSearchListPopular($scope.SearchNamePopular,$scope.currentPage,limit).then(function (res) {
			$scope.listknowledgessharingpopular = res.data.items;
			  var y = res.data.items;
			  //console.log($scope.listknowledgessharingpopular);
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;
				
			});
		}
		else
		{
			KnowledgessharingSvc.getListPopular(limit, $scope.currentPage, filter).then(function(res){
			  //console.log($scope.listknowledgessharingpopular)
			  $scope.listknowledgessharingpopular = res.data.items;
			  var y = res.data.items;
			  var bookmarkid = "";
			  //console.log(y.likers);
			  $scope.total = res.data.total;
			  $scope.offset = Math.ceil($scope.total / limit) * 10;
			  
			  for(var a=0 in y){
				  $scope.listbookmark = y[a].bookmarks; 
				  angular.forEach($scope.listbookmark, function(value, key){
					  $scope.listbookmarksid = value.createdBy._id;
					  if($scope.listbookmarksid == user._id){
						$scope.listknowledgessharingpopular[a].isBookmark = true;
						var thestring = "httpCall" + y[a]._id;
						var buttonColor = "#1976D2";
						 $scope[thestring] = {
						  'color': buttonColor
						} 
					} else {
				  	//tambah
				  	$scope.listknowledgessharingpopular[a].isBookmark = false;
					} 
				   });
			  }
			  
			  for(var a=0 in y){
			  $scope.listlikers = y[a].likers;
			  angular.forEach($scope.listlikers, function(value, key){
				  $scope.listlikersid = value.createdBy._id;
				  if($scope.listlikersid == user._id){
					$scope.listknowledgessharingpopular[a].isLike = true;
				    var thestring = "httpLovePop" + y[a]._id;
					var buttonColor = "#fc1414c4";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	$scope.listknowledgessharingpopular[a].isLike = false;
				  }
			   });
			}  
			});
		}
    };
	
	 $scope.SearchKnowladgePopular = function() {
		 var searchnamepopular = $scope.SearchNamePopular;
		 if (searchnamepopular != "" && searchnamepopular != null && searchnamepopular != 'undefined') {
			KnowledgessharingSvc.getSearchListPopular($scope.SearchNamePopular).then(function (res) {
				$scope.listknowledgessharingpopular = res.data.items;
				var y = res.data.items;
				//console.log($scope.listknowledgessharingpopular);
				$scope.total = res.data.total;
				$scope.offset = Math.ceil($scope.total / limit) * 10;
				
			});
		}
		else
		{
		KnowledgessharingSvc.getListPopular(limit, $scope.currentPage, filter).then(function (res) {
				  $scope.listknowledgessharingpopular = res.data.items;
				   var y = res.data.items;
				 //console.log($scope.listknowledgessharingpopular);
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
							var thestring = "httpLovePop" + y[a]._id;
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
	
	var filter = { studyProgramId : user.studyProgramId._id};
		KnowledgessharingSvc.getListPopular(limit, $scope.currentPage, filter).then(function (res) {
          $scope.listknowledgessharingpopular = res.data.items;
		   var y = res.data.items;
		 //console.log($scope.listknowledgessharing);
		  var bookmarkid = "";
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
		  for(var a=0 in y){
			  $scope.listbookmark = y[a].bookmarks;
			  angular.forEach($scope.listbookmark, function(value, key){
				  $scope.listbookmarksid = value.createdBy._id;
				  if($scope.listbookmarksid == user._id){
				  	//tambah
				  	$scope.listknowledgessharingpopular[a].isBookmark = true;
				    var thestring = "httpCall" + y[a]._id;
					var buttonColor = "#1976D2";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	//tambah
				  	$scope.listknowledgessharingpopular[a].isBookmark = false;
				  } 
			   });
		  }
		  
		  for(var a=0 in y){
			  $scope.listlikers = y[a].likers;
			  angular.forEach($scope.listlikers, function(value, key){
				  $scope.listlikersid = value.createdBy._id;
				  if($scope.listlikersid == user._id){
				  	$scope.listknowledgessharingpopular[a].isLike = true;
				    var thestring = "httpLovePop" + y[a]._id;
					var buttonColor = "#fc1414c4";
					 $scope[thestring] = {
					  'color': buttonColor
					} 
				  } else {
				  	$scope.listknowledgessharingpopular[a].isLike = false;
				  }
			   });
		  }
    });
	
	$scope.categoryList = [];
		KnowledgessharingSvc.getCategoryList().then(function(res){
		$scope.categoryList = res.data;
		//console.log("data ", res.data);

		}, function(err){

		});
	
	$scope.upLike = function(data){
		var x = {createdBy: user._id};
		 var id = data;
		 var thestring = "httpLovePop" + id;
		 KnowledgessharingSvc.upLike(x, id).then(function(res){  
				for(var a=0 in $scope.listknowledgessharingpopular){
		 			if($scope.listknowledgessharingpopular[a]._id == id){
		 				$scope.listknowledgessharingpopular[a].isLike = true;
		 				$scope.listknowledgessharingpopular[a].totalLike++;
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
	 	var thestring = "httpLovePop" + id;
		KnowledgessharingSvc.unLike(x, id).then(function(res){
	        for(var a=0 in $scope.listknowledgessharingpopular){
		 			if($scope.listknowledgessharingpopular[a]._id == id){
		 				$scope.listknowledgessharingpopular[a].isLike = false;
		 				$scope.listknowledgessharingpopular[a].totalLike--;
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
				for(var a=0 in $scope.listknowledgessharingpopular){
		 			if($scope.listknowledgessharingpopular[a]._id == id){
		 				$scope.listknowledgessharingpopular[a].isBookmark = true;
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
				for(var a=0 in $scope.listknowledgessharingpopular){
		 			if($scope.listknowledgessharingpopular[a]._id == id){
		 				$scope.listknowledgessharingpopular[a].isBookmark = false;
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
        $state.go('app.knowledgessharing-populer');
        //window.open(url,'_blank');
    }
 
});