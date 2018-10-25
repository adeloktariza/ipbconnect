app.controller('SharefileCtrl', function ($scope, $stateParams, $http, $state, localStorageService, SharefileSvc, $window, config) {

    var user = JSON.parse(localStorageService.get("user"));
    var limit = 10;
    $scope.maxSize = 5;

    //pagination
    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
        var filter = { studyProgramId : user.studyProgramId._id};
        SharefileSvc.getList(limit, $scope.currentPage, filter).then(function(res){
          $scope.listSharefile = res.data.results;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
        });

    };

     SharefileSvc.getSharefile(limit, $scope.currentPage).then(function (res) {
          console.log("res", res);
    	  $scope.listSharefile = res.data.results;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;

    });

    $scope.resolvedPhoto = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/blog1.jpg";
        }
        return config.url + "/uploads/sharefile/" + x;
    }

    $scope.goDetail = function(id){
        $window.open($state.href('app.sharefile_detail', {id: id}, '_blank'));
        $state.go('app.sharefile');
        // window.open(url,'_blank');
    }
 
});