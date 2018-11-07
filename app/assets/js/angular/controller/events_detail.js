app.controller('EventsDetailCtrl', function ($scope, $stateParams, $http, $state, localStorageService, EventsSvc, config, Lightbox) {

	var id = $stateParams.id;

	$scope.googleMaps = config.urlMap;
	var googleMaps = config.urlMap;
	//get single
    if( id !== ""){

         EventsSvc.getEventById(id).then(function(res){

            $scope.detail = res.data;
            var x = res.data.latitude;
    		var y = res.data.longitude;
            resolvedPhoto(res.data.picture);

		    if(x != "" || y != "" ){
		      $scope.position = {lat: x, lng: y};
		      var z = new google.maps.LatLng(x, y);
			  // $scope.vmap.setCenter(z);
			  // $scope.vmap.setZoom(15);
		    }
            
         });
    }

    var resolvedPhoto = function(x){
	    if(x == undefined || x == "" || x == null){
	        $scope.detail.picture = "app/assets/img/event.jpg";
	    }else{
	    	$scope.detail.picture =  config.url + "/uploads/event/" + x;
	    }
	}

   $scope.openLightboxModal = function (url) {
	    var image = [{ url : url}];
	    Lightbox.openModal(image, 0);
  };

	
 
});