var ParseAPI = createParseAPI();
$(document).ready(function(){
	$("#login-form").onClick(function(){
		ParseAPI.login(username,password,callBack)
	})
})