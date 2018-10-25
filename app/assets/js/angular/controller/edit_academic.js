app.controller('AcademicCtrl', function ($scope, $log, $stateParams, $http, $state, localStorageService, $filter, MasterSvc, Upload, NgMap, config, UserSvc, Flash) {

    // data user
    var user = JSON.parse(localStorageService.get("user"));
    var id = $stateParams.id;

    //get single
    if( id !== ""){

        $scope.btnDelete = true;
        $scope.btnUpdate = true;
        $scope.btnSubmit = false;

         UserSvc.getUserById(id).then(function(res){
            $scope.form = res.data;
            $scope.form.studyProgramId = res.data.studyProgramId._id;
            $scope.form.dateOfBirth =  new Date(res.data.dateOfBirth);
         });

    }

    MasterSvc.getStudyProgram().then(function (res) {
              $scope.faculty = res.data;
    });

    //datepicker start
    $scope.openStart = function() {
         $scope.popupStart.opened = true;
    };
    $scope.popupStart = {
         opened: false
    };


	  $scope.data = {};
    $scope.form = {};
  
    $scope.editAcademic = function(data){

        $scope.data = data;

        //service edit profile
        UserSvc.editAcademic($scope.data, id).then(function (res) { //upload function returns a promise

             if(res.data.isSuccess){ //validate success
                var message = "Edit academic success.";
                Flash.create('success', message);
                $state.go('app.setting');
            } else {
                var message = "Edit academic failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 

        });

    }


    $scope.reset = function(){

        $scope.form = "";

    }
 
});