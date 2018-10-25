app.controller('VacancyFormCtrl', function ($scope, $stateParams, $http, $state, localStorageService, $filter, VacancySvc, MasterSvc, Flash) {

	var user = JSON.parse(localStorageService.get('user'));

 	var id = $stateParams.id;

    //initiate show button
    $scope.btnDelete = false;
    $scope.btnUpdate = false;
    $scope.btnSubmit = true;

    //get single
    if( id !== ""){

        $scope.btnDelete = true;
        $scope.btnUpdate = true;
        $scope.btnSubmit = false;

         VacancySvc.getVacancyById(id).then(function(res){
            $scope.form = res.data;
            $scope.form.closeDate =  new Date(res.data.closeDate);
            $scope.form.jobLocationId = res.data.jobLocationId._id;
          
         });
    }


    MasterSvc.getLocation().then(function (res) {
        	$scope.jobLocation = res.data;
 	});

    //open datepicker
    $scope.openStart = function() {
         $scope.popupStart.opened = true;
    };
    $scope.popupStart = {
         opened: false
    };

	$scope.data = [];
	$scope.data.createdBy = [];
	$scope.data.modifiedBy = [];
    $scope.form = {};

	$scope.saveVacancy = function(){
        
        if($scope.form.title == undefined){
           var message = 'Please insert title.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.company == undefined){
           var message = 'Please insert company.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.salaryMin == "" || $scope.form.salaryMax == ""){
           var message = 'Please insert salary.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.closeDate == undefined){
           var message = 'Please insert closed date.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.email == undefined){
           var message = 'Please insert email.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.subject == undefined){
           var message = 'Please insert subject.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.jobQualification == undefined){
           var message = 'Please insert job qualification.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.jobDescription == undefined){
           var message = 'Please insert job description.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.jobLocationId == undefined){
           var message = 'Please choose job location.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.address == undefined){
           var message = 'Please insert address.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.file == undefined){
           var message = 'Please insert document required.';
           Flash.create('danger', message);
           return;
        }

		$scope.form.createdBy = user._id;
		$scope.data = $scope.form;

		//service create events
 	    VacancySvc.createLowongan($scope.data).then(function (res) { //upload function returns a promise
             if(res.data.isSuccess){ //validate success
                var message = "Create vacancy success.";
                Flash.create('success', message);
                $state.go('app.vacancy_list');
            } else {
                var message = "Create vacancy failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 
            console.log(evt);
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });


	};

    $scope.editVacancy = function(data){

        $scope.data = data;
        $scope.data.createdBy = user._id;
        //service create events
        VacancySvc.updateVacancy($scope.data, id).then(function (res) { //upload function returns a promise
             if(res.data.isSuccess){ //validate success
                var message = "Edit vacancy success.";
                Flash.create('success', message);
                $state.go('app.vacancy_list');
            } else {
                var message = "Edit vacancy failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 
            console.log(evt);
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });

    }

    $scope.deleteVacancy = function(){

        VacancySvc.deleteVacancy(id).then(function(res){
            if(res.data.isSuccess){ //validate success
                var message = "Delete vacancy success.";
                Flash.create('success', message);
                $state.go('app.vacancy_list');
            } else {
                var message = "Delete vacancy failed.";
                Flash.create('danger', message);
            }
        })

    }

    $scope.reset = function(){

        $scope.form = "";

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

