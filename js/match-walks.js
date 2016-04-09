var authData = ref.getAuth();
var myFirstName = authData.uid;
function isNear(ASrc,ADest,BSrc,BDest) {
  var bounds = new google.maps.LatLngBounds;
  //var markersArray = [];
  var Src1 = new google.maps.LatLng(ASrc.Latitude, ASrc.Longitude);
  var Dest1 = new google.maps.LatLng(ADest.Latitude, ADest.Latitude);
  var Src2 = new google.maps.LatLng(BSrc.Latitude, BSrc.Latitude);
  var Dest2 = new google.maps.LatLng(BDest.Latitude, BDest.Latitude);
  //var origin2 = 'Greenwich, England';
  //var destinationA = 'Stockholm, Sweden';
  //var destinationB = {lat: 50.087, lng: 14.421};

  //var destinationIcon = 'https://chart.googleapis.com/chart?' +
      //'chst=d_map_pin_letter&chld=D|FF0000|000000';
  //var originIcon = 'https://chart.googlseapis.com/chart?' +
      //'chst=d_map_pin_letter&chld=O|FFFF00|000000';
  //var map = new google.maps.Map(document.getElementById('map'), {
    //center: {lat: 55.53, lng: 9.4},
    //zoom: 10
  //});
  var geocoder = new google.maps.Geocoder;

 /* var service = new google.maps.DistanceMatrixService;
  service.getDistanceMatrix({
    origins: [Src1, Dest1],
    destinations: [Src2, Dest2],
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: true,
    avoidTolls: true
  }, function(response, status) {
    if (status !== google.maps.DistanceMatrixStatus.OK) {
      alert('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
      var outputDiv = document.getElementById('output');
      //outputDiv.innerHTML = '';
      //deleteMarkers(markersArray);

     /* var showGeocodedAddressOnMap = function(asDestination) {
        var icon = asDestination ? destinationIcon : originIcon;
        return function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            map.fitBounds(bounds.extend(results[0].geometry.location));
            markersArray.push(new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: icon
            }));
          } else {
            alert('Geocode was not successful due to: ' + status);
          }
        };
      };
      console.log(Src1);
      console.log(Src2);
      console.log(Dest1);
      console.log(Dest2);
      console.log(results[0][0]);
      console.log(results[1][1]);*/
      var x = google.maps.geometry.spherical.computeDistanceBetween(Src1,Src2);
      var y = google.maps.geometry.spherical.computeDistanceBetween(Dest1,Dest2);
      if(x < 500000000 && y < 500000000){
      	console.log("DONE!!");
      	console.log(x);
      	console.log(y);
      	return true;
      }
      //if(results[0][0]<5 && results[1][1]<100)
      	
      else {
      	console.log(x);
      	console.log(y);
      	return false;
      }
      	
    //}
  //});
}

/*function isNear(ASrc,ADest,BSrc,BDest){
	return true;
}*/

function findClosestWalks(callback){
	var walk_res;
	getAllEvents(function(walk_res){

		console.log(walk_res);
		//var walk_obj = JSON.parse(walk_res);
	//var myFirstName = getFName();
	//console.log(walk_res);
	var closeWalks =[];
	var mywalks =[];
	for(var i=0;i<walk_res.length;i++){
		if(walk_res[i].UID === myFirstName){
			mywalks.push(walk_res[i]);
		}
	}
	/*walk_res.forEach(function (value){
		if(value.FirstName === myFirstName){
			mywalks.push(value);
			$("#abc").html("got my walk");
		}
	})*/
	console.log(myFirstName);
	console.log(mywalks);
	for(var i=0;i<mywalks.length;i++){
		for(var j=0;j<walk_res.length;j++){
			if(walk_res[j].UID == myFirstName){
				continue;
			}
			else{
				
				//var todayDate = new Date();
				//var objectDate = new Date(walk_res[j].Date);
				//${#abc}.html(todayDate);
				//${#abc}.html(objectDate);
				if(//todayDate === objectDate &to& 
					isNear(mywalks[i].Source,mywalks[i].Destination,
													  walk_res[j].Source,walk_res[j].Destination)){
					closeWalks.push(mywalks[i]);
					closeWalks.push(walk_res[j]);
					//$("#abc").html("got my close walk");
				}
			}
		}
	}
	console.log("closeWalks" + closeWalks);
	/*mywalks.forEach( function (value){
		for(key in walk_res){
			if(key.FirstName===myFirstName){
				$("#abc").html("got my walk again");
				continue;
			}
			else{
				var todayDate = new Date();
				var objectDate = new Date(key.Date);
				//${#abc}.html(todayDate);
				//${#abc}.html(objectDate);
				if(todayDate === objectDate &to& isNear(value.Source,value.Destination,
													  key.Source,key.Destination)){
					closeWalks.push(key);
					$("#abc").html("got my close walk");
				}
			}
		}
	})*/
	callback(closeWalks);
	});
	
}
