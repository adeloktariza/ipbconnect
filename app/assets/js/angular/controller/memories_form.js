app.controller('MemoryFormCtrl', function ($scope, $log, $stateParams, $http, $state, localStorageService, MemorySvc, $filter, MasterSvc, Upload, NgMap, config, Flash) {

    // data user
    var user = JSON.parse(localStorageService.get("user"));
    var id = $stateParams.id;

    //initiate show button
    $scope.btnUpdate = false;
    $scope.btnSubmit = true;

    //get single
    if( id !== ""){

        $scope.btnUpdate = true;
        $scope.btnSubmit = false;

         MemorySvc.getSingleMemory(id).then(function(res){
            $scope.form = res.data;
         });
    }


    //create events
	$scope.saveMemories = function(){

      $scope.form.createdBy = user._id ;
      $scope.data = $scope.form;
      if($scope.file != null || $scope.file != undefined){
          $scope.data.photo = $scope.file;
      }


  		//service create events
      MemorySvc.create($scope.data).then(function (res) { //upload function returns a promise
           if(res.data.isSuccess){ //validate success
              var message = "Create memories success.";
              Flash.create('success', message);
              $state.go('app.memories_list', {}, { reload: true });
          } else {
              var message = "Create memories failed.";
              Flash.create('danger', message);
          }
      }, function (res) { //catch error

      }, function (evt) { 
          //console.log(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
      });


	};

  $scope.editEvents = function(data){

        $scope.data = data;
        $scope.data.createdBy = user._id;
        if($scope.file != null || $scope.file != undefined){
            $scope.data.picture = $scope.file;
        }

        //service create events
        MemorySvc.updateEvents($scope.data, id).then(function (res) { //upload function returns a promise
             if(res.data.isSuccess){ //validate success
                var message = "Edit memories success.";
                Flash.create('success', message);
                $state.go('app.events_list',{}, { reload: true });
            } else {
                var message = "Edit memories failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });

    }

    $scope.reset = function(){

        $scope.form = "";

    }
 
});