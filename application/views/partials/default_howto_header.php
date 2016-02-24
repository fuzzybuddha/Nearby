<!-- <link rel="stylesheet" type="text/css" href="../assets/css/normalize.css">
<link rel="stylesheet" type="text/css" href="../assets/css/index.css"> -->

<!-- jQuery  -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>

<!-- Materialize - Compiled and minified CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css">
<!-- Materialize - Compiled and minified JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js"></script>
<!-- Materialize - buttons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- main style sheet -->
<link rel="stylesheet" type="text/css" href="assets/main.css">

<!-- favicon -->
<link rel="icon" href="favicon.ico" />

<script>
	$( document ).ready(function(){
		// sideNav handeler
		$(".button-collapse").sideNav();

		// login and register modal handler
		$('.modal-trigger').leanModal();
	})
</script>
<!--

	███████  █████   ██████ ███████ ██████   ██████   ██████  ██   ██
	██      ██   ██ ██      ██      ██   ██ ██    ██ ██    ██ ██  ██
	█████   ███████ ██      █████   ██████  ██    ██ ██    ██ █████
	██      ██   ██ ██      ██      ██   ██ ██    ██ ██    ██ ██  ██
	██      ██   ██  ██████ ███████ ██████   ██████   ██████  ██   ██	 			-->

	<script> // Facebook login api
	// This is called with the results from from FB.getLoginStatus().
	function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			var clientID = response.authResponse['userID'];
			var accessToken = response.authResponse['accessToken'];
			var url = 'https://graph.facebook.com/v2.5' + clientID + '/picture?width=350&height=350';
			FB.api('/me?fields=email,first_name, last_name', function(response){
				var email = response.email;
				var first_name = response.first_name;
				var last_name = response.last_name;

				$.ajax({
					method: "POST",
					url: '/main/facebook_login',
					data: {clientID: clientID, accessToken: accessToken, email: email, first_name: first_name, last_name: last_name},
				});

			})
		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			document.getElementById('status').innerHTML = 'Please log ' +
			'into this app.';
		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			document.getElementById('status').innerHTML = 'Please log ' +
			'into Facebook.';
		}
	}

	// This function is called when someone finishes with the Login
	// Button.  See the onlogin handler attached to it in the sample
	// code below.
	function checkLoginState() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '934753329943750',
			cookie     : true,  // enable cookies to allow the server to access
			// the session
			xfbml      : true,  // parse social plugins on this page
			version    : 'v2.5' // use graph api version 2.5
		});

		// Now that we've initialized the JavaScript SDK, we call
		// FB.getLoginStatus().  This function gets the state of the
		// person visiting this page and can return one of three states to
		// the callback you provide.  They can be:
		//
		// 1. Logged into your app ('connected')
		// 2. Logged into Facebook, but not your app ('not_authorized')
		// 3. Not logged into Facebook and can't tell if they are logged into
		//    your app or not.
		//
		// These three cases are handled in the callback function.

		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});

	};

	// Load the SDK asynchronously
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	function testAPI() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', function(response) {
			console.log('Successful login for: ' + response.name);
			document.getElementById('status').innerHTML =
			'Thanks for logging in, ' + response.name + '!';
		});
	}

	</script>

<!--
	███    ██  █████  ██    ██       ██████   █████  ██████
	████   ██ ██   ██ ██    ██       ██   ██ ██   ██ ██   ██
	██ ██  ██ ███████ ██    ██ █████ ██████  ███████ ██████
	██  ██ ██ ██   ██  ██  ██        ██   ██ ██   ██ ██   ██
	██   ████ ██   ██   ████         ██████  ██   ██ ██   ██	 				-->

<nav>
	<div class="nav-wrapper">
		<img src="assets/nearby-icon-large.png" class='nearby-icon'>
		<a href="#" class="brand-logo">Nearby</a>
		<a href="#" data-activates="mobile-nav" class="button-collapse"><i class="material-icons">menu</i></a>
		<ul class="right hide-on-med-and-down">
			<li><a href="/" class="waves-effect waves-light">Home</a></li>
			<li><a href="#login-modal" class="waves-effect waves-light  modal-trigger">Log In</a></li>
		</ul>
		<ul class="side-nav right" id="mobile-nav">
			<li><a href="/">Home</a></li>
			<li><a href="#login-modal" class="modal-trigger">Log In</a></li>
		</ul>
	</div>
</nav>
<!--

				██       ██████   ██████  ██ ███    ██
				██      ██    ██ ██       ██ ████   ██
				██      ██    ██ ██   ███ ██ ██ ██  ██
				██      ██    ██ ██    ██ ██ ██  ██ ██
				███████  ██████   ██████  ██ ██   ████	 						-->

<div class="row">
	<div id="login-modal" class="modal col s10 offset-s1 m6 offset-m3 l4 offset-l4">
		<div class="modal-content">
			<form class="login-form">
				<div class="row small">
					<div class="input-field col s4 header-icon">
						<img src="assets/nearby-icon-90x90.png" alt="nearby-icon" class="responsive-img valign">
					</div>
					<div class="row small">
						<h5 class="col s4 center login-header">Log In</h5>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12">
						<i class="mdi-social-person-outline prefix"></i>
						<input type="text" id="email">
						<label for="email" class="center-align">Email</label>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12">
						<i class="mdi-action-lock-outline prefix"></i>
						<input type="password" id="password">
						<label for="password">Password</label>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12 remember-check">
						<input type="checkbox"  id="remember-me">
						<label for="remember-me">Remember me</label>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s12">
						<a href="/" class="btn waves-effect orange waves-light col s12">Login</a>
					</div>
				</div>
				<div class="row small">
					<div class="input-field login-helper-link col s6">
						<fb:login-button class='z-depth-1 hoverable' data-size='xlarge' scope="public_profile,email" onlogin="checkLoginState();">
					</fb:login-button>
				</div>
				<div class="input-field login-helper-link col s6">
					<a href="/" class="btn red waves-effect waves-light col s12">Google</a>
				</div>
			</div>
			<div class="row small">
				<div class="input-field col s4">
					<p class="login-helper-link medium-small">
						<a href="#register-modal" class="modal-trigger modal-close">Register!</a>
					</p>
				</div>
				<div class="input-field col s8">
					<p class="login-helper-link right-align medium-small">
						<a href="#">Forgot password?</a>
					</p>
				</div>
			</div>
		</form>
	</div>
</div>
</div>

<!--
	██████  ███████  ██████  ██ ███████ ████████ ███████ ██████
	██   ██ ██      ██       ██ ██         ██    ██      ██   ██
	██████  █████   ██   ███ ██ ███████    ██    █████   ██████
	██   ██ ██      ██    ██ ██      ██    ██    ██      ██   ██
	██   ██ ███████  ██████  ██ ███████    ██    ███████ ██   ██	 				-->

<div class="row">
	<div id="register-modal" class="modal col s10 offset-s1 m6 offset-m3 l4 offset-l4 ">
		<div class="modal-content">
			<form class="login-form">
				<div class="row small">
					<div class="input-field center">
						<h5 class="center login-form-text modal-header">Register</h5>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12">
						<i class="mdi-social-person-outline prefix"></i>
						<input type="email" id="email">
						<label for="email" class="center-align">Email</label>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12">
						<i class="mdi-action-lock-outline prefix"></i>
						<input type="password" id="password">
						<label for="password">Password</label>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12">
						<i class="mdi-action-lock-outline prefix"></i>
						<input type="password" id="password_comfirm">
						<label for="password_comfirm">Confirm Password</label>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12">
						<a href="/" class="btn waves-effect orange waves-light col s12">Register</a>
					</div>
				</div>
				<div class="row small">
					<div class="input-field col s12">
						<p class="login-helper-link margin medium-small">
							<a href="#login-modal" class="modal-trigger modal-close">Already Registered? Log In!</a>
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
