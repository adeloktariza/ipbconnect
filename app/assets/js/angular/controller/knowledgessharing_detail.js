app.controller('KnowledgessharingDetailCtrl', function ($scope, $stateParams, $http, $state, $location, localStorageService, KnowledgessharingSvc, config, UserSvc, $log, Flash, $sce, $document, $window, $location) {

  var user = JSON.parse(localStorageService.get("user"));

  var id = $stateParams.id;
  var limit = 3;
  $scope.maxSize = 5;

  $scope.commentList = [];
  $scope.isUpLike = true;
  $scope.isDownLike = true;
  $scope.recommendedContent = [];
  $scope.reply = {};

    //pagination
    $scope.pageChanged = function() {
        //$log.log('Page changed to: ' + $scope.currentPage);
        KnowledgessharingSvc.getCommentList(limit, $scope.currentPage, id).then(function(res){
          $scope.commentList = res.data.comments;
          $scope.totalComment = res.data.totalComment;
          $scope.offset = Math.ceil($scope.totalComment / limit) * 10;
            // resolvedPhoto(res.data.photo);
            
          });
      };

      $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
      };



    //get single
    KnowledgessharingSvc.getListById(id).then(function(res){
      $scope.detail = res.data;
      $scope.file = "http://docs.google.com/gview?url=" + config.url + "/uploads/knowledgesharing/" + res.data.file + "&embedded=true"
            //console.log($scope.detail.category._id);
            $scope.profile = res.data.createdBy.profile;
            //resolvedPhoto(res.data.photo);
            $scope.recommendedContent = res.data.recommendedContent.slice(0,4);
            var likers = res.data.likers;
            var bookmarks = res.data.bookmarks;

            for(var i = 0 in likers){
              if(likers[i].createdBy._id == user._id){
                $scope.detail.isLike = true;
                var thestring = "httpLove" + res.data._id;
                var buttonColor = "#fc1414c4";
                $scope[thestring] = {
                  'color': buttonColor
                }
              }
            }

            for(var i = 0 in bookmarks){
              if(bookmarks[i].createdBy._id == user._id){
                $scope.detail.isBookmark = true;
                var thestring = "httpCall" + res.data._id;
                var buttonColor = "#1976D2";
                $scope[thestring] = {
                  'color': buttonColor
                }
              }
            }
            
          });

    KnowledgessharingSvc.getCommentList(limit, $scope.currentPage, id).then(function(res){
      $scope.commentList = res.data.comments;
      $scope.totalComment = res.data.totalComment;
      $scope.offset = Math.ceil($scope.totalComment / limit) * 10;      
    });

    $scope.resolvedFile = function(x){
      var data = "http://docs.google.com/gview?url=" + config.url + "/uploads/knowledgesharing/" + x + "&embedded=true";
      return $sce.trustAsResourceUrl(data);
    }

    $scope.newComment = function(){
      if($scope.comment == "" || $scope.comment == undefined){
        var message = "Please write comment first.";
        Flash.create('danger', message);
        return false;
      }
      var x = {comment: $scope.comment, createdBy: user._id};
      KnowledgessharingSvc.comment(x, id).then(function(res){

        $scope.commentList.push({
          created: "a few seconds ago",
          createdBy: {
            fullName: user.fullName,
            profile: {
              photo: user.profile.photo
            }
          },
          value: $scope.comment
        });
        $scope.comment = "";
      });
      console.log(x);
    }

    $scope.replyComment = function(commentID){
      if($scope.reply.value == "" || $scope.reply.value == undefined){
        var message = "Please write a comment first.";
        Flash.create('danger', message);
        return false;
      }
      var x = {comment: $scope.reply.value, createdBy: user._id, commentId: commentID};
      KnowledgessharingSvc.replyComment(x, id).then(function(res){
        for(var i = 0; i < $scope.commentList.length; i++){
          if($scope.commentList[i]._id == commentID){
            $scope.commentList[i].replies.push({
              created: "a few seconds ago",
              createdBy: {
                fullName: user.fullName,
                profile: {
                  photo: user.profile.photo
                }
              },
              value: $scope.reply.value
            });
          }
        }
        $scope.reply = {};
      });
    }

    $scope.resolvedPhoto = function(x){
      if(x == undefined || x == ""){
        return "app/assets/img/user.jpg";
      }
      return config.url + "/uploads/profile/" + x;
    }


    $scope.resolvedCover = function(x){
      if(x == undefined || x == ""){
        return "app/assets/img/blog1.jpg";
      }
      return config.url + "/uploads/knowledgesharing/" + x;
    }

    $scope.upLike = function(data){
      var x = {createdBy: user._id};
      var id = data;
      var thestring = "httpLove" + id;
      KnowledgessharingSvc.upLike(x, id).then(function(res){

        $scope.detail.isLike = true;
        $scope.detail.totalLike++;
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
        $scope.detail.isLike = false;
        $scope.detail.totalLike--;
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
      $scope.detail.isBookmark = true;
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
      $scope.detail.isBookmark = false;
      $scope.isSuccess = res.data.isSuccess;
      if($scope.isSuccess == true){
        var buttonColor = "#535b60";
        $scope[thestring] = {
          'color': buttonColor
        } 
      }
    });
  }

  $scope.downloadFile = function(x){
    var fileDownload = config.url + "/uploads/knowledgesharing/" + x;
    return fileDownload;
  }
  
  $scope.share = function(dataId, shareable){
    if(shareable == true){
      $scope.shareable = false;
    }else{
      $scope.shareable = true;
    }

    $scope.datashare = $location.absUrl()
  }
	
   $scope.descClick = function(desc){
		if(desc == true){
		  $scope.desc = false;
		}else{
		  $scope.desc = true;
		}
	  }

  $scope.resolvedPhotoComment = function(x){
        // console.log("image", x);
        if(x.photo == undefined || x.photo == "" || x.photo == null){
         return "app/assets/img/user.jpg";
       } else {
        return  config.url + "/uploads/profile/" + x.photo;
      }
    }
    
    $scope.goDetail = function(id){
      $window.open($state.href('app.knowledgessharing_detail', {id: id}, '_blank'));
      $state.go('app.knowledgessharing');
        //window.open(url,'_blank');
      }

    });
