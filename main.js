var ParseAPI = createParseAPI();
$(document).ready(function(){
	$("#login-form").onClick(function(){
		var username = "";
		var password = "";
		ParseAPI.login(username, password, callBack);
	})
})