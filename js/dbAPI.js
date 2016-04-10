function inviteFriend()
{
	alert("We will be notifying your friend. Thanks ");
}
function search_user(authData)
{
	ref.child("Users").orderByKey().equalTo(authData.uid).once("value", function(snapshot){
		return true;
	}, function(error){
		return false;
	});
}

function createWalkEvent(eventData){						//Event details from front end
	ref.child("WalkEvent").push({
		"UID" : ref.getAuth().uid,
		"Source" : {
			"Latitude" : eventData.Source.Latitude,
			"Longitude" : eventData.Source.Longitude},
		"Destination" : {
			"Latitude" : eventData.Destination.Latitude,
			"Longitude" : eventData.Destination.Longitude},
		"ArrivingTime" : eventData.ArrivingTime,
		"Recurring" : eventData.Recurring,
		"Walked" : "false",
		"Invitee" : ""
	});
}

function createWalkRequest(myEventId, inviteeEventID){		//Requester event ID, Invitee Event ID
	var inviteeUID;
	
	ref.child("WalkEvent").child(inviteeEventID).once("value", function(snapshot){
		inviteeUID = snapshot.val().UID;
		var data = [];
		data[inviteeUID] = "false";
		ref.child("WalkEvent/"+myEventId+"/Invitee").update(data);
			
		ref.child("WalkRequest").push({
			"UID" : inviteeUID,
			"WalkEventID" : myEventId,
			"InviteeWalkEventID" : inviteeEventID,
			"Accepted" : "false"
		});
	});	
	alert("We will send an invitation to your friend");
}

function updateAcceptance(requestID){						//Request ID accepted by the user
	ref.child("WalkRequest/$requestID").update({
		"Accepted" : "true"
	});
	
	inviteeUID = ref.getAuth().uid;
	data[inviteeUID.toString()] = "true";
	ref.child("WalkRequest").child(requestID).child("Invitee").update(data);
}

function getRequest(callback) {
var requestData = [];
	
	ref.child("WalkRequest").orderByChild("UID").equalTo(ref.getAuth().uid).once("value", function(requestList) {
		console.log("Inside requestList");
		requestList.forEach(function(request) {
			var requestKey = request.key();
			console.log("Inside request");
			ref.child("WalkEvent").orderByKey().equalTo(request.val().WalkEventID).once("value",function(eventSnap){
				console.log("Inside EventSnap");
				var eventVal = eventSnap.val();
				ref.child("Users").child(eventSnap.UID).once("value", function(userSnap){
					console.log("Inside UserSnap");
					requestData.push({
							RequestID : requestKey,
							FirstName : userSnap.val().FirstName,
							Source: {Latitude: eventVal.Source.Latitude, Longitude: eventVal.Source.Longitude},
							Destination: {Latitude: eventVal.Destination.Latitude, Longitude: eventVal.Destination.Longitude},
							ArrivingTime: eventVal.ArrivingTime,
							Recurring: eventVal.Recurring});
				});
			});
		});
		callback(requestData);
	});
}

function getAcceptance(callback) {
	var acceptanceData = [];
	ref.child("WalkEvent").orderByChild("UID").equalTo(ref.getAuth().uid).once("value", function(eventList) {
		
		eventList.forEach(function(eventSnap) {
			var eventID = eventSnap.key();
			var eventVal = eventSnap.val();
			ref.child("WalkEvent").child(eventID).child("Invitee").orderByKey().once("value", function(inviteeList){
				inviteeList.forEach(function(invitee){
					 if (invitee.val() == "true") {
						 ref.child("Users").child(invitee.key()).once("value",function(userDataSnap){
							 acceptanceData.push({
									 FirstName : userDataSnap.val().FirstName,
									 Source: {Latitude: eventVal.Source.Latitude, Longitude: eventVal.Source.Longitude},
									 Destination: {Latitude: eventVal.Destination.Latitude, Longitude: eventVal.Destination.Longitude},
									 ArrivingTime: eventVal.ArrivingTime,
									 Recurring: eventVal.Recurring});
						});
					 }
				});
			});
		});
		callback(acceptanceData);
	});	
}

function getAllEvents(callback) {
	var allEvents = [];
	ref.child("WalkEvent").once("value", function(eventList){
		eventList.forEach(function(eventSnap) {
			var FName;
			ref.child("Users").child(eventSnap.val().UID).once("value",function(userDataSnap){
				FName = userDataSnap.val().FirstName;
			});
			var eventID = eventSnap.key();
			var eventVal = eventSnap.val();
			allEvents.push({
					 FirstName : FName,
				 	 EventID : eventID,
				 	 UID : eventVal.UID,
					 Source : {Latitude: eventVal.Source.Latitude, Longitude: eventVal.Source.Longitude},
					 Destination : {Latitude: eventVal.Destination.Latitude, Longitude: eventVal.Destination.Longitude},
					 ArrivingTime : eventVal.ArrivingTime,
					 Recurring : eventVal.Recurring});
		});
		console.log(allEvents);
		callback(allEvents);
	});
}

function read_user(){
	var users = ref.child("Users");
	users.on("child_added",function(snapshot,prevChildKey){
		return snapshot.val();
	});
}
var messageData = ref.child("Messages/data");
messageData.on("child_changed", function(snapshot, prevChildey){
	sendSMS();
});

function get_name_from_uid(uid, callback){
	var user = ref.child("Users/"+uid+"/FirstName");
	user.once("value",function(data){
		callback(data.val());
	});

}

function saveDetails(data, callback){
  var dataRef = new Firebase(FIRE_BASE_URL+DAT_REF+ref.getAuth().uid);
  dataRef.update(data, callback);
}

function sendSMS(){
	ref.child("Details"+ref.getAuth().uid+"/numberEmergency").once("value", function(data){
		console.log(data.val());

    var data = {"number":data.val(), "message":"HELP"}
    $.ajax({
        type: "POST",
        url: "http://www.textbelt.com/text",
        data: data
    });
    });
    alert("Emergency message sent");
}
