app.controller('VacancyDetailCtrl', function ($scope, $stateParams, $http, $state, localStorageService, VacancySvc) {

	var id = $stateParams.id;

	//get single
    if( id !== ""){

         VacancySvc.getVacancyById(id).then(function(res){
            $scope.detail = res.data;
             
            // $scope.form.startTime = new Date(res.data.startTime, shortTime);
          
         });
    }

});