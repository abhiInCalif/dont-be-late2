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
	
	api.addUserEventJoin = function(userId, eventId, callBack){
		console.log("addUser");
		var eventRel = {"__type":"Pointer","className":"Event","objectId":eventId};

		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'https://api.parse.com/1/classes/UserEvent', true);
		addHeaderKeys(xhr);
		xhr.setRequestHeader("Content-Type", "application/json");
    	var data = JSON.stringify({"event":eventRel,"userId":userId});
		xhr.send(data);
		
		var eventId;
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result.objectId && callBack != undefined) {
		    	console.log("result" + result);
		    	callBack(result.objectId);
		    }
		  }
		}
	}

	api.getEvents = function(userId, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", 'https://api.parse.com/1/classes/UserEvents?where{userId:' + userId + ",include:Event}", true);
		addHeaderKeys(xhr);
		xhr.send();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result["results"] && callBack != undefined) {
		    	var events = [];
		    	for(var userEventJoin in result["results"]){
		    		events.push(userEventJoin["event"])
		    	}
		    	callBack()
		    }else{
		    	callBack([]);
		    }
		  }
		}
	} 

	api.getLocations = function(eventId, callBack){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", 'https://api.parse.com/1/classes/Event/' + eventId +'?where={include:_User}', true);
		addHeaderKeys(xhr);
		xhr.send();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		 	console.log(xhr.responseText);
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


	api.createEvent = function(eventObj, callBack){
		for (var prop in eventObj){
			console.log("prop : " + prop +" " + eventObj[prop])
		}
		var attendees = [];
		var geoLocation = {
          "__type": "GeoPoint",
          "latitude": eventObj.destination.latitude,
          "longitude": eventObj.destination.longitude
        }
        eventObj.destination = geoLocation;
        console.log(" obj e" + eventObj);
		for (var i = 0; i< eventObj.attendees.length ;i++){
			console.log("user id baby" + eventObj.attendees[i])
			attendees.push({"__type":"Pointer","className":"User","objectId":eventObj.attendees[i]})
		}

		eventObj.attendees = attendees;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'https://api.parse.com/1/classes/Event', true);
		addHeaderKeys(xhr);
		xhr.setRequestHeader("Content-Type", "application/json");
    	var data = JSON.stringify(eventObj);
		xhr.send(data);
		
		var eventId;
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    var result = JSON.parse(xhr.responseText);
		    if (result.objectId && callBack != undefined) {
		    	updateUsers(result.attendees, result.objectId);
				callBack(result.objectId);
		    }
		  }
		}


		function updateUsers(attendees, eventId){
		for (var i = 0; i< eventObj.attendees.length ;i++){
				ParseAPI.addUserEventJoin(eventObj.attendees[i].objectId, eventId, function(text){
					console.log(text);
				});
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




