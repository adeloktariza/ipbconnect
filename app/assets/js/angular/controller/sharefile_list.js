app.controller('SharefileListCtrl', function ($scope, $stateParams, $http, $state, localStorageService, ngTableParams, SharefileSvc, config, Flash) {
	
    var user = JSON.parse(localStorageService.get("user"));

    $scope.limit = 10;
    $scope.page = 1;

    SharefileSvc.getListByCreator($scope.limit, $scope.page, {createdBy: user._id}).then(function (res) {
                $scope.listSharefileById = res.data.results;
                $scope.size = res.data.total;
    });


    $scope.resolvedFile = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/blog1.jpg";
        }
        return config.url + "/uploads/sharefile/" + x;
    }


    $scope.goDetail = function(id){
        $state.go("app.sharefile_form", {id: id});
    }

    $scope.deleteSharefile = function(id){

        SharefileSvc.delete(id).then(function(res){
            if(res.data.isSuccess){ //validate success
                var message = "Delete files success.";
                Flash.create('success', message);
                $state.go('app.sharefile_list',{}, { reload: true });
            } else {
                var message = "Delete files failed.";
                Flash.create('danger', message);
            }
        })

    }
	
 
});