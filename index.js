function showLogin() {
	$('#login_button').fadeOut(400, function() {
		$('#hidden_login').fadeIn(400);
	});
}

function hideLogin() {
	$('#hidden_login').fadeOut(300, function() {
		$('#login_button').fadeIn(300);
	});
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
	}
	return "";
}

if (getCookie("email")) {
	$(".loggedin").removeClass("hidden");
} else {
	$(".loggedout").removeClass("hidden");
}
