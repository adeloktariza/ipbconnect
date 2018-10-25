app.controller('VacancyCtrl', function ($scope, $stateParams, $http, $state, localStorageService, VacancySvc, $window, MasterSvc) {

    var user = JSON.parse(localStorageService.get("user"));
    var limit = 5;
    $scope.maxSize = 5;
    // $scope.currentPage = 1;

    //pagination
    $scope.pageChanged = function() {
          var filter = { studyProgramId : user.studyProgramId._id};
          filter = $scope.query;
          VacancySvc.getLowongans(limit, $scope.currentPage, filter).then(function (res) {
              $scope.listvacancy = res.data.results;
              $scope.total = res.data.total;
              $scope.offset = Math.ceil($scope.total / limit) * 10;
         });
    };

    var filter = { studyProgramId : user.studyProgramId._id};
    VacancySvc.getLowongans(limit, $scope.currentPage, filter).then(function (res) {
    	    $scope.listvacancy = res.data.results;
          $scope.total = res.data.total;
          $scope.offset = Math.ceil($scope.total / limit) * 10;
     });

    MasterSvc.getLocation().then(function (res) {
            // console.log("tes", res.data);
            $scope.jobLocation = res.data;
    });


    $scope.goDetail = function(id){
        $window.open($state.href('app.vacancydetail', {id: id}, '_blank'));
        $state.go('app.vacancy');
        // window.open(url,'_blank');
    }
 
});

  app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}]);