app.controller('ProfileCtrl', function ($scope, $log, $stateParams, $http, $state, localStorageService, EventsSvc, $filter, MasterSvc, Upload, NgMap, config, UserSvc, Flash) {

    // data user
    var user = JSON.parse(localStorageService.get("user"));
    var id = $stateParams.id;

    //get single
    if( id !== ""){

        $scope.btnDelete = true;
        $scope.btnUpdate = true;
        $scope.btnSubmit = false;

         UserSvc.getUserById(id).then(function(res){
            console.log("prof", res);
            $scope.form = res.data.profile;
            // $scope.position = { lat:res.data.profile.latitude, lng:res.data.profile.longitude};
            $scope.googleMaps = config.urlMap;
            var x = res.data.profile.latitude;
            var y = res.data.profile.longitude;
            if(x != "" || y != "" ){
              $scope.position = {lat: x, lng: y};
              // var z = new google.maps.LatLng(x, y);
              // $scope.vmap.setCenter(z);
              // $scope.vmap.setZoom(15);
            }

         });

    }


	  $scope.data = {};
    $scope.form = {};
  	$scope.form.latitude = "";
    $scope.form.longitude = "";


    //map
     $scope.googleMaps = config.urlMap;
     
     //search map
     NgMap.getMap().then(function(map) {
        $scope.vmap = map;

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        $scope.vmap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        $scope.vmap.addListener('bounds_changed', function() {
          searchBox.setBounds($scope.vmap.getBounds());
        });

          var markers = [];
          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
              return;
            }

            // Clear out the old markers.
            // markers.forEach(function(marker) {
            //   marker.setMap(null);
            // });
            // markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };

              // Create a marker for each place.
              // markers.push(new google.maps.Marker({
              //   map: $scope.vmap,
              //   icon: icon,
              //   title: place.name,
              //   position: place.geometry.location
              // }));

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          });

     });

    $scope.addMarker = function(event) {
      $scope.position = {};
      var ll = event.latLng;
      $scope.position = {lat:ll.lat(), lng: ll.lng()};
      $scope.form.latitude = $scope.position.lat;
      $scope.form.longitude = $scope.position.lng;
    }


    $scope.editProfile = function(data){

        $scope.data = data;

        console.log("edit", $scope.data);

        //service edit profile
        UserSvc.editProfile($scope.data, id).then(function (res) { //upload function returns a promise
             if(res.data.isSuccess){ //validate success
                var message = "Edit profile success.";
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