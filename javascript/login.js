var ParseAPI = createParseAPI();
$(document).ready(function(){
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