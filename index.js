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