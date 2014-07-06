function setLoginCookie(email) {
	document.cookie="email=" + email;
	console.log(document.cookie);
	setTimeout(function(){
		window.location.replace("index.html");
	}, 3000);
}
