console.log("api");
function createParseAPI(){
	var parseId = "h167t65xmew6bUXDEFl49Lgvk91sqUQZwzmLrWuR";
	var parseRESTId = "hFJFRxSPg1VPebPBFPZqWs88tMQrtr6rGOcqYqbS";
	var api = {};
	api.signUp = function(username, password, name, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'https://api.parse.com/1/users', true);
		addHeaderKeys(xhr);
		xhr.setRequestHeader("Content-Type", "application/json");
    	var data = JSON.stringify({"username":username,"password":password,"name":name});
		xhr.send(data);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result.objectId && callBack != undefined) {
				callBack(result.objectId);
		    }
		  }
		}
	}

	api.login = function(username, password, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", 'https://api.parse.com/1/login?' + urlEncode({"username":username,"password":password},"=","&"), true);
		addHeaderKeys(xhr);
		xhr.send();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    console.log(xhr.responseText);
		    if (result["objectId"] && callBack != undefined) {
		    	callBack({"msg":result["objectId"]})
		    } else {
		    	callBack({"msg":"error"})
		    }
		  }
		}
	}

	api.getEvents = function(userId, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", 'https://api.parse.com/1/users/' + userId + '?where{include:Event', true);
		addHeaderKeys(xhr);
		xhr.send();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result["events"] && callBack != undefined) {
		    	callBack(result["events"])
		    }else{
		    	callBack([]);
		    }
		  }
		}
	} 

	api.getLocations = function(eventId, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", 'https://api.parse.com/1/classes/Event/' + eventId +'?where{include=User}', true);
		addHeaderKeys(xhr);
		xhr.send();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		  
		    if (result["attendees"] && callBack != undefined) {
		    	var locations =[]
		    	for(var user in result["attendees"]){
		    		locations.push({"userId":user.objectId, "location":user.location});
		    	}
		    	callBack(locations);
		    }else{
		    	callBack([""]);
		    }
		  }
		}
	}

	api.getEvent = function(eventId, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", 'https://api.parse.com/1/classes/Event/' + eventId, true);
		addHeaderKeys(xhr);
		xhr.send();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result && callBack != undefined) {
		    	callBack(result)
		    }else{
		    	callBack([]);
		    }
		  }
		}
	}


	api.addEventToUser = function(userID, eventId, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", 'https://api.parse.com/1/users/' + userID, true);
		addHeaderKeys(xhr);
		var data = {"events":{"__op":"AddUnique","objects":[{"__type":"Pointer","className":"Event","objectId":eventId}]}};
		console.log("data :" + JSON.stringify(data));
		xhr.send(JSON.stringify(data));
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result && callBack != undefined) {
		    	callBack(result)
		    }else{
		    	callBack([]);
		    }
		  }
		}
	}

	api.createEvent = function(event, callBack){
		var attendees = [];
		var geoLocation = {
          "__type": "GeoPoint",
          "latitude": event.destination.latitude,
          "longitude": event.destination.longitude
        }
        event.destination = geoLocation;
		for (var userId in event.attendees){
			attendees.push({"__type":"Pointer","className":"User","objectId":userId})
		}

		event.attendees = attendees;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'https://api.parse.com/1/classes/Event', true);
		addHeaderKeys(xhr);
		xhr.setRequestHeader("Content-Type", "application/json");
    	var data = JSON.stringify(event);
		xhr.send(data);
		
		var eventId;
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result.objectId && callBack != undefined) {
		    	updateUsers(result.objectId);
				callBack(result.objectId);
		    }
		  }
		}
		function updateUsers(eventId){
			for (var userRel in attendees){
				console.log("rel" + userRel);
				ParseAPI.addEventToUser(userRel.objectId, eventId, function(text){
					console.log(text);
				});
				attendees.push({"__type":"Pointer","className":"User","objectId":userId})
			}
		}
		
	}

	function addHeaderKeys(xhr){
		xhr.setRequestHeader("X-Parse-Application-Id", parseId);
		xhr.setRequestHeader("X-Parse-REST-API-Key", parseRESTId);
	}
	function urlEncode(params, join , delim){
		var urlEncodedParams = "";
		var isFirst = true;
		for(var prop in params){
			var paramPair  = prop + join + escape(encodeURI(params[prop]));
			if(isFirst){
				isFirst = false;
				urlEncodedParams += paramPair;
			}else{
				urlEncodedParams += delim +  paramPair;
			}
		}
		return urlEncodedParams;
	}
	return api;
};

var ParseAPI = createParseAPI();

console.log("wde")
ParseAPI.signUp("edd"+ Math.random(),"edd", function(text){
	console.log(text);
});
ParseAPI.login("edd","edd", function(text){
	console.log(text);
});
ParseAPI.getEvents("9nybCoNLoB", function(text){
	console.log(text);
});

ParseAPI.createEvent({"name":"name","attendees":["KnU2QZPoHh"],"destination":{"latitude":40,"longitude":20},"punishment":"punishment","startTime":50,"endTime":60}, 
	function(text){
	console.log(text);
});

ParseAPI.getEvent("uWzO8C7QLV", function(obj){
	console.log("get event");
	for(var prop in obj){
		console.log(prop + " " + obj[prop])
	}
});
ParseAPI.getLocations("uWzO8C7QLV", function(obj){
	console.log("get event");
	for(var prop in obj){
		console.log("loc" + prop + " " + obj[prop])
	}
});
