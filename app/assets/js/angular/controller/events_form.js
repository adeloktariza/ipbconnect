app.controller('EventsFormCtrl', function ($scope, $log, $stateParams, $http, $state, localStorageService, EventsSvc, $filter, MasterSvc, Upload, NgMap, config, Flash) {

    // data user
    var user = JSON.parse(localStorageService.get("user"));
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
        if($scope.file == ""){
            $scope.dontshow = true;
        }

         EventsSvc.getEventById(id).then(function(res){
            console.log("result", res);
            $scope.form = res.data;
            $scope.form.startDate =  new Date(res.data.startDate);
            $scope.form.endDate =  new Date(res.data.endDate);
            var startDate = $filter('date')(res.data.startDate, 'd');
            var endDate =  $filter('date')(res.data.startDate, 'd');
            if(startDate == endDate){
                $scope.oneDay = true;
                $scope.isOneDay();
            }
            if(res.data.price == 0){
                $scope.free = true;
                $scope.isFree();
            }
            $scope.startTime =   new Date(res.data.startTime);
            $scope.endTime =   new Date(res.data.endTime);
            var startTime = $filter('date')(res.data.startDate, 'HH:mm');
            var endTime =  $filter('date')(res.data.startDate, 'HH:mm');
            if(startTime == endTime){
                $scope.untilEnd = true;
                $scope.isUntilEnd();
            }

            if($scope.data.picture != ""){
                $scope.file = res.data.picture;
            }

            $scope.googleMaps = config.urlMap;
            var x = res.data.latitude;
            var y = res.data.longitude;

            if(x != "" || y != "" ){
              $scope.position = {lat: x, lng: y};
              // var z = new google.maps.LatLng(x, y);
              // $scope.vmap.setCenter(z);
              // $scope.vmap.setZoom(15);
            }
          
         });
    }

    if($scope.file == undefined){
            $scope.dontshow = true;
    }

    $scope.setTrueShowImage = function(){
       $scope.showImageInput = true;
    }

    $scope.urlPhoto = function(x){
      if( x != ""){
          return config.url + "/uploads/event/" + x;
      }
    }

    //hide show one day
    $scope.hideEndDate = false;
    $scope.isOneDay = function(){
        if($scope.oneDay == true && $scope.form.startDate !== undefined){
            $scope.hideEndDate = true;
            $scope.form.endDate = $scope.form.startDate;
        }else{
            var message = "Please Insert Start Date First.";
            Flash.create('danger', message);
            $scope.hideEndDate = false;
            $scope.form.endDate = "";
        }
    }

    //hide show until end
    $scope.hideEndTime = false;
    $scope.isUntilEnd = function(){
        if($scope.untilEnd == true && $scope.startTime !== undefined){
            $scope.hideEndTime = true;
            $scope.endTime = $scope.startTime;
        }else{
            var message = "Please Insert Start Time First.";
            Flash.create('danger', message);
            $scope.hideEndTime = false;
            $scope.endTime = "";
        }
    }

    //hide Price
    $scope.hidePrice = false;
    $scope.isFree = function(){
        if($scope.free == true){
            $scope.hidePrice = true;
            $scope.form.price = 0;
        }else{
            $scope.hidePrice = false;
        }
    }

    //datepicker start
    $scope.openStart = function() {
         $scope.popupStart.opened = true;
    };
    $scope.popupStart = {
         opened: false
    };

    //datepicker end
    $scope.openEnd = function() {
         $scope.popupEnd.opened = true;
    };
    $scope.popupEnd = {
         opened: false
    };

  	$scope.data = {};
    $scope.form = {};
  	$scope.form.latitude = "";
    $scope.form.longitude = "";


    //map
    $scope.googleMaps = config.urlMap;
     // $("#map").hide();
     $("#deleteLocation").hide();
     
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

    $scope.deleteLocation = function(){
        $scope.form.latitude = "";
        $scope.form.longitude = "";
        $("#deleteLocation").hide();
        $scope.position = {};
    }


    //create events
	$scope.saveEvents = function(){
        console.log("form_event", $scope.form);
        if($scope.form.title == undefined){
           var message = 'Please insert title.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.place == undefined){
           var message = 'Please insert place.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.latitude == "" || $scope.form.longitude == ""){
           var message = 'Please choose map.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.startDate == undefined){
           var message = 'Please insert date.';
           Flash.create('danger', message);
           return;
        }
        if($scope.startTime == undefined){
           var message = 'Please insert time.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.description == undefined){
           var message = 'Please insert title.';
           Flash.create('danger', message);
           return;
        }
        if($scope.form.contact == undefined){
           var message = 'Please insert contact.';
           Flash.create('danger', message);
           return;
        }


        $scope.form.createdBy = user._id ;
        $scope.form.startTime = $scope.startTime;
        $scope.form.endTime = $scope.endTime;
		$scope.data = $scope.form;
        if($scope.file != null || $scope.file != undefined){
            $scope.data.picture = $scope.file;
        }else{
           var message = 'Please insert image.';
           Flash.create('danger', message);
           return;
        }

		//service create events
 	    EventsSvc.createEvents($scope.data).then(function (res) { //upload function returns a promise

             if(res.data.isSuccess){ //validate success
                var message = "Create events success.";
                Flash.create('success', message);
                $state.go('app.events_list');
            } else {
                var message = "Create events failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });


	};

    $scope.editEvents = function(data){

        $scope.data = data;
        $scope.data.createdBy = user._id;
        $scope.data.startTime = $scope.startTime;
        $scope.data.endTime = $scope.endTime;
        if($scope.file != null || $scope.file != undefined){
            $scope.data.picture = $scope.file;
        }else{
            $scope.data.picture = $scope.file;
        }

        
        //service create events
        EventsSvc.updateEvents($scope.data, id).then(function (res) { //upload function returns a promise

             if(res.data.isSuccess){ //validate success
                var message = "Edit event success.";
                Flash.create('success', message);
                $state.go('app.events_list');
            } else {
                var message = "Edit event failed.";
                Flash.create('danger', message);
            }
        }, function (res) { //catch error

        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });

    }

    $scope.deleteEvents = function(){

        EventsSvc.deleteEvents(id).then(function(res){
            if(res.data.isSuccess){ //validate success
                var message = "Delete event success.";
                Flash.create('success', message);
                $state.go('app.events_list');
            } else {
                var message = "Delete event failed.";
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