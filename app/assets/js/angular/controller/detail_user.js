app.controller('UserCtrl', function ($scope, $log, $stateParams, $http, $state, localStorageService, $filter, MasterSvc, Upload, NgMap, config, UserSvc, Lightbox) {
  
  var user = JSON.parse(localStorageService.get("user"));
  $scope.googleMaps = config.urlMap;

  var id = $stateParams.id;

  UserSvc.getUserById(id).then(function(res){
          $scope.user = res.data;
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

  $scope.openLightboxModal = function (url) {
    var image = [{ url : config.url + "/uploads/profile/" + url}];
    Lightbox.openModal(image, 0);
  };

});
