app.controller('KnowledgessharingFormCtrl', function ($scope, $log, $stateParams, $http, $state, localStorageService, KnowledgessharingSvc, $filter, MasterSvc, Upload, NgMap, config, Flash) {

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

    KnowledgessharingSvc.getListById(id).then(function(res){
            $scope.form = res.data;
            $scope.form.category = res.data.category._id;
			//console.log($scope.form.category);
			
          
         });
    }


    KnowledgessharingSvc.getCategoryList().then(function (res) {
        	$scope.category = res.data;
			//console.log($scope.category);
 	});

	$scope.saveKnowledges = function(){
		//console.log($scope.myfile);
		if($scope.form.file == undefined){
           var message = 'Please insert file required.';
           Flash.create('danger', message);
           return;
        }
	
	     if($scope.form.title == undefined){
           var message = 'Please insert title.';
           Flash.create('danger', message);
           return;
        }
		
        if($scope.form.description == undefined){
           var message = 'Please insert description.';
           Flash.create('danger', message);
           return;
		   replace:true;
        }
		if($scope.form.category == undefined){
           var message = 'Please choose category.';
           Flash.create('danger', message);
           return;
        }
		
	
		
		$scope.form.createdBy = user._id;
		$scope.data = $scope.form;

		
		KnowledgessharingSvc.createKnowledges($scope.data).then(function (res) { //upload function returns a promise
             if(res.data.isSuccess){ //validate success
                var message = "Create knowledge sharing success.";
                Flash.create('success', message);
                $state.go('app.knowledgessharing_list');
            } else {
                var message = "Create knowledge sharing failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 
            //console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });


	
	};
	
   
	$scope.editKnowledges = function(){

        $scope.data = $scope.form;
        $scope.form.createdBy = user._id;

        var contentToUpdate = {};
        contentToUpdate.title = $scope.form.title;
        contentToUpdate.description = $scope.form.description;
        contentToUpdate.createdBy = user._id;
        contentToUpdate.category = $scope.form.category;
        contentToUpdate.file = $scope.form.file;

		
	    console.log(contentToUpdate);
        //service create knowledges
        KnowledgessharingSvc.editKnowledges(contentToUpdate, id).then(function (res) { //upload function returns a promise

             if(res.data.isSuccess){ //validate success
                var message = "Edit knowledge sharing success.";
                Flash.create('success', message);
                $state.go('app.knowledgessharing_list');
            } else {
                var message = "Edit  knowledge sharing failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        });

    }
	
    $scope.deleteKnowledges = function(){

        KnowledgessharingSvc.deleteKnowledges(id).then(function(res){
            if(res.data.isSuccess){ //validate success
                var message = "Delete  knowledge sharing success.";
                Flash.create('success', message);
                $state.go('app.knowledgessharing_list');
            } else {
                var message = "Delete  knowledge sharing failed.";
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

