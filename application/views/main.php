<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Nearby</title>
	<?php $this->load->view('/partials/header'); ?>
	<script>
		$( document ).ready(function(){
			// sideNav handeler
			$(".button-collapse").sideNav({
					edge: 'right',
					closeOnClick: true
				}
			);


			// modal handler
			$('.modal-trigger').leanModal({
				ready: function() { modal_flag = true; }, // Callback for Modal open
				complete: function() { modal_flag = false; } // Callback for Modal close
			});

			// set options variables
			$("#radius_from_location").val(radius_from_location);
			$("#cluster_radius").val(cluster_radius);

			// sets search_position to user_position if geolocation worked
			get_geolocation_of_user();
		})
	</script>
</head>
<body>
	<nav>
		<div class="nav-wrapper">
			<img src="assets/nearby-icon-large-virt.png" class='nearby-icon'>
			<a class="brand-logo">Nearby</a>

			<ul class="right hide-on-med-and-down">
				<li><a href="how-does-it-work" class="waves-effect waves-light">How does it work?</a></li>
				<li><a href="mailto:nearby.rocks@gmail.com?Subject=Feedback" target="_top" class="waves-effect waves-light">Give Feedback!</a></li>
				<?php if ($this->session->userdata('logged_in')){ ?>
						<!-- <li><a href="log-out" onclick='signOut();' class="waves-effect waves-light">Log Out</a></li> -->
				<?php } else { ?>
						<!-- <li><a href="#login-modal" class="waves-effect waves-light modal-trigger">Log In</a></li> -->
				<?php } ?>
			</ul>

			<a href="#" data-activates="slide-out" class="button-collapse right"><i class="mdi-navigation-menu"></i></a>
			<ul id='slide-out' class='side-nav'>
				<?php if ($this->session->userdata('logged_in')){ ?>
						<!-- <li><a href="log-out">Log Out</a></li> -->
				<?php } else { ?>
						<!-- <li><a href="#login-modal" class="modal-trigger">Log In</a></li> -->
				<?php } ?>
				<li><a href="mailto:nearby.rocks@gmail.com?Subject=Feedback" target="_top" class="waves-effect waves-light">Give Feedback!</a></li>
				<li><a href="how-does-it-work">How does it work?</a></li>
			</ul>

		</div>
	</nav>

	<?php
		if (!$this->session->userdata('logged_in')){
			// $this->load->view('/partials/login_reg');
	 	}
	?>
	<!--============================= Search ==================================-->
	<div class="row small">
		<form class="col s12" id="searchform1">
			<div class="row">
				<div class="col l4 offset-l1 no-padding">
					<div class='col l4 s3 align-right'>
						<label class="search-label">Find a</label>
					</div>
					<div class="col s1">
						<img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" class='search-marker'/>
					</div>
					<div class="input-field col l7 s8">
						<input id="searchbox1" placeholder="movie theater" type="text" class="search-text">
					</div>
				</div>

				<div class="col l4 no-padding">
					<div class='col s3 center'>
						<label class="search-label">with</label>
					</div>
					<div class="col s1">
						<img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" class='search-marker'/>
					</div>
					<div class="input-field col s8">
						<input id="searchbox2" placeholder="ice cream" type="text" class="search-text">
					</div>
				</div>

				<div class="col l2 no-padding">
					<div class='col s7'>
						<label class="search-label">nearby!</label>
					</div>
					<div class='col s2'>
						<button type = 'submit' id="search-button" class="btn-floating btn-medium waves-effect waves-light blue search-button"><i class="material-icons">search</i></button>
					</div>
				</div>
			</div>
		</form>

		<a id="options-link" href="" class="col s5 m3 l2 right options-link"><i class="fa fa-cog"></i> Search Options</a>
	</div>

	<!--============================= options ================================-->
	<?php
		$this->load->view('/partials/no_res');
		$this->load->view('/partials/options');
	?>

	<!--================================ Map ================================-->
	<div id="map"></div>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLpRWMwoxfXI4F2hJ6g2jWoKMMjvdj-S0&signed_in=true&libraries=places&callback=initMap" async defer></script>
	<script src="/assets/js/map.js"></script>

	<!--============================= footer ================================-->
	<?php $this->load->view('/partials/footer'); ?>
</html>
