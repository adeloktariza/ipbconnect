app.controller('VacancyListCtrl', function ($scope, $stateParams, $http, $state, localStorageService, ngTableParams, VacancySvc) {
	
    var user = JSON.parse(localStorageService.get('user'));

    $scope.goEdit = function(id){
        $state.go("app.vacancy_form", {id: id});
    }
	$scope.tableVacancies = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        getData: function ($defer, params) {
            var limit = params.count();
            var offset = (params.page() - 1) * limit;
            VacancySvc.getVacancyByCreator(limit, offset, user._id).then(function (res) {
                params.total(res.data.total);
                $scope.size = res.data.total;
                $defer.resolve(res.data.results);
            })
        }
    })
	
 
});