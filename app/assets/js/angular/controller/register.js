app.controller('RegisterCtrl', function ($scope, $stateParams, $http, $state, localStorageService, $filter, UserSvc, MasterSvc, Flash) {

	$scope.form = {};
    $scope.privacy = false;

	MasterSvc.getStudyProgram().then(function (res) {
            	$scope.faculty = res.data;
    });

	//datepicker
    $scope.open = function() {
   		 $scope.popup.opened = true;
    };
    $scope.popup = {
   		 opened: false
    };

    $scope.submitRegister = function(){
        var form = $scope.form;
        if(form.fullName == undefined){
           var message = 'Please insert name.';
           Flash.create('danger', message);
           return;
        }
        if(form.gender == undefined){
           var message = 'Please choose gender.';
           Flash.create('danger', message);
           return;
        }
        if(form.dateOfBirth == undefined){
           var message = 'Please insert date of birth.';
           Flash.create('danger', message);
           return;
        }
        if(form.nim == undefined){
           var message = 'Please insert nim.';
           Flash.create('danger', message);
           return;
        }
        if(form.gender == undefined){
           var message = 'Please choose gender.';
           Flash.create('danger', message);
           return;
        }
        if(form.batch == undefined){
           var message = 'Please insert batch.';
           Flash.create('danger', message);
           return;
        }
        if(form.studyProgramId == undefined){
           var message = 'Please choose stydy program.';
           Flash.create('danger', message);
           return;
        }
        if(form.userType == undefined){
           var message = 'Please choose status.';
           Flash.create('danger', message);
           return;
        }
        if(form.email == undefined){
           var message = 'Please insert email.';
           Flash.create('danger', message);
           return;
        }
        if($scope.privacy == false){
          var message = 'Make sure you have read our term and data policy.';
          Flash.create('danger', message);
          return;
        }
        if($scope.form.password !== $scope.confirmPassword){
          var message = 'Confirm Password not match';
          Flash.create('danger', message);
          return;
        }
        if($scope.file == "" || $scope.file == undefined || $scope.file == null){
          var message = 'Please Choose Profile Picture';
          Flash.create('danger', message);
          return;
        }
    	
        $scope.form.isVerified = false;
		//service register
 	    UserSvc.register($scope.form).then(function (res) { //upload function returns a promise
             if(res.data.isSuccess){ //validate success
                var cropped = dataURItoBlob($scope.myCroppedImage);
                $scope.upload(cropped, res.data.item._id);
                var message = "Register Success, your account under verify.";
                Flash.create('success', message);
                $state.go("login");
            } else {
                var message = 'Register Failed !';
                Flash.create('danger', message);
                var message = res.data.message;
                Flash.create('danger', message);
                $state.go("register");
            }
        }, function (res) { //catch error

        }, function (evt) { 
            // console.log(evt);
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });

    }

      //js handle update profile picture
    $scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    //https://code.ciphertrick.com/2015/12/07/file-upload-with-angularjs-and-nodejs/

     $scope.upload = function (file, id) {
       var data = {photo:file};
        UserSvc.changePict(data, id).then(function (res) { //upload function returns a promise
           if(res.data.isSuccess){

           }else{
              var message = res.data.message;
              Flash.create('danger', message);
           }
           
        }, function (resp) { //catch error
            
        }, function (evt) { 
            console.log(evt);
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = 'progress: ' + $scope.progressPercentage + '% '; // capture upload progress
        });
    };

    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    };

});