app.controller('MemoryListCtrl', function ($scope, $stateParams, $http, $state, localStorageService, ngTableParams, MemorySvc, config, Flash) {
	
    var user = JSON.parse(localStorageService.get("user"));

    $scope.limit = 10;
    $scope.page = 1;

    MemorySvc.getListByCreator($scope.limit, $scope.page, {createdBy: user._id}).then(function (res) {
                $scope.listMemoryById = res.data.results;
                $scope.size = res.data.total;
    });


    $scope.resolvedPhoto = function(x){
        if(x == undefined || x == ""){
                return "app/assets/img/blog1.jpg";
        }
        return config.url + "/uploads/memory/" + x;
    }


    $scope.goDetail = function(id){
        $state.go("app.memories_form", {id: id});
    }

    $scope.deleteMemory = function(id){

        MemorySvc.delete(id).then(function(res){
            if(res.data.isSuccess){ //validate success
                var message = "Delete memories success.";
                Flash.create('success', message);
                $state.go('app.memories_list',{}, { reload: true });
            } else {
                var message = "Delete memories failed.";
                Flash.create('danger', message);
            }
        })

    }
	
 
});