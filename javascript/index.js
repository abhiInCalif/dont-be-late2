var ParseAPI = createParseAPI();
$(document).ready(function(){
	var userId = "KnU2QZPoHh"; //$.cookie("userId");
	var events = ParseAPI.getEvents(userId, function(text){
		console.log("index : " + text);
	});
	$("#login-btn").click(function(){
		console.log("hisgfrendjlgvnedijgnceijwadsknf")
		var username = $("#username").val();
		var password = $("#password").val();;
		function callBack(text){
			console.log("text : " + text);
		}
		ParseAPI.login(username, password, callBack);
	})
})