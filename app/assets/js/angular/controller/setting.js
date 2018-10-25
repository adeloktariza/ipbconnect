app.controller('SettingCtrl', function ($scope, $stateParams, $http, $state, localStorageService, UserSvc, config, EventsSvc, VacancySvc, $window, Lightbox, Flash) {

  var user = JSON.parse(localStorageService.get("user"));
  $scope.googleMaps = config.urlMap;

  UserSvc.getUserById(user._id).then(function(res){
          $scope.user = res.data;
          console.log("setting", $scope.user);
          if(res.data.gender == "P"){
            $scope.user.gender = "Female";
          }else if(res.data.gender == "L"){
            $scope.user.gender = "Male";
          }
          var x = $scope.user.profile.latitude;
          var y = $scope.user.profile.longitude;
          if(x != "" || y != "" ){
            $scope.position = {lat: x, lng: y};
          }
  });


 $scope.resolvedPhotoAccount = function(x){
      if(x == undefined || x == ""){
              return "app/assets/img/user.jpg";
      }
      return config.url + "/uploads/profile/" + x;
  }


	$scope.goDetailProfile = function(id){

        $state.go("app.profile", {id: id});
  }

  $scope.goDetailAcademic = function(id){

        $state.go("app.academic", {id: id});
  }

  $scope.goDetailPassword = function(){
        $state.go("app.password");
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
  

  $scope.save = function(){ //function to call on form submit
    if($scope.file == "" || $scope.file == undefined || $scope.file == null){
       var message = "Please insert your profile picture.";
       Flash.create('danger', message);
    }
      var cropped = dataURItoBlob($scope.myCroppedImage);
      $scope.upload(cropped);
  }


    $scope.upload = function (file) {
       var data = {photo:file};
        UserSvc.changePict(data, user._id).then(function (res) { //upload function returns a promise
           if(res.data.isSuccess){
             user.profile.photo = res.data.photo;
             localStorageService.set("user", JSON.stringify(user));
             var message = "Update profile picture success.";
             Flash.create('success', message);
              $window.location.reload();
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

  $scope.openLightboxModal = function (url) {
    var image = [{ url : config.url + "/uploads/profile/" + url}];
    Lightbox.openModal(image, 0);
  };
 
});