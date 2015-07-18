var ParseAPI = createParseAPI();
$(document).ready(function(){
    $('#login-form').submit(function(){
        var username = $("#username").val();
		var password = $("#password").val();
		function callBack(text){
			console.log("text : " + text);
			if(text.msg != "error"){
				$.cookie("userId", text["objectId"]);
				$.cookie("sessionToken", text["sessionToken"]);
				  $(function() {
			          $.get('/login', function() {
			            window.location = '/';
			          });
			          return false;
			        });
				}
			}
		ParseAPI.login(username, password, callBack);
		return false;
         });
    });