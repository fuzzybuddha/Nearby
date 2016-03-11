var map;
var infowindow;

var validated_results = [];
var validated_clusters = [];
var result_indices_with_clusters = [];
var search_terms = "";
var search_terms2 = "";
var user_position;
var res_flag = false;
var options_flag = false;
var search_flag = false;   //<====================================
var result_counter = 0;

// options
var search_location;
var radius_from_location = 5000;
var cluster_radius = 500;
var map_zoom_level = 12;
var min_rating = 0;
/*
		 	 ██████  ██████  ████████ ██  ██████  ███    ██ ███████
			██    ██ ██   ██    ██    ██ ██    ██ ████   ██ ██
			██    ██ ██████     ██    ██ ██    ██ ██ ██  ██ ███████
			██    ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
			 ██████  ██         ██    ██  ██████  ██   ████ ███████
*/
function pos_from_address(address, callback){
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK){

			position = {
				lat:results[0].geometry.location.lat(),
				lng:results[0].geometry.location.lng()
			};
			search_location = position;

			callback();
		}
	});
}

$('#options-link').click(function(event){
	event.preventDefault();
	if(!options_flag){
		options_flag = true;
		$('#options').openModal({
			ready: function(){options_flag = true;},
			complete: function(){options_flag = false;}
		});
	}
})

$('#options').submit(function(event){
	event.preventDefault();
	var address = $("#start_location").val();
	radius_from_location = parseFloat($('#radius_from_location').val());
	cluster_radius = parseFloat($('#cluster_radius').val());

	var rad = radius_from_location;
	if(rad <= 1400 ){
		map_zoom_level = 15;
	} else if (rad > 1400 && rad <= 2400){
		map_zoom_level = 14;
	} else if (rad > 2400 && rad <= 4500){
		map_zoom_level = 13;
	} else if (rad > 4500 && rad <= 8500){
		map_zoom_level = 12;
	} else if (rad > 8500 && rad <= 15000){
		map_zoom_level = 11;
	}
	// console.log(rad, map_zoom_level);

	if (address){
		pos_from_address(address, function(){
			if(search_location){
				$('#options').closeModal();
				options_flag = false;

				search_terms = $('#searchbox1').val();
				search_terms2 = $('#searchbox2').val();
				if(search_terms !== '' && search_terms2 !== ''){
					primary_search(search_terms);
				} else {
					initMap();
				}
			}
		});
	}
});

/*
██████  ███████ ███████ ██████   ██████  ███    ██  ██████ ███████
██   ██ ██      ██      ██   ██ ██    ██ ████   ██ ██      ██
██████  █████   ███████ ██████  ██    ██ ██ ██  ██ ██      █████
██   ██ ██           ██ ██      ██    ██ ██  ██ ██ ██      ██
██   ██ ███████ ███████ ██       ██████  ██   ████  ██████ ███████
*/
window.addEventListener('keypress', function(e) {
	// console.log('key:', e, e.keyCode);
	if(e.keyCode === 13 && res_flag){
		$('#no_res').closeModal();
		setTimeout(function(){
			res_flag = false;
			// console.log('false');
		}, 300);
	}
});

function search_error_response(){
	var term1 = $('#searchbox1').val();
	var term2 = $('#searchbox2').val();
	var res_str;
	// console.log("no_res: term1 -> ", term1, " : term2 -> ", term2);
	if(term1 !== "" && term2 !== ""){
		res_str = "<h6 class='center-align'>There are no results for:</h6>"+
		"<h6 class='center-align'> <strong>"+term1+"</strong> with <strong>"+term2+"</strong> nearby.</h6>";
	} else {
		res_str = "<h6 class='center-align'>Please enter two values search terms</h6>";
	}
	$('#response').html(res_str);
	if(!res_flag){
		res_flag = true;
		$('#no_res').openModal({
			ready: function(){res_flag = true;},
			complete: function(){res_flag = false;}
		});
	}
}

/*
			██    ██ ███████ ███████ ██████
			██    ██ ██      ██      ██   ██
			██    ██ ███████ █████   ██████
			██    ██      ██ ██      ██   ██
			 ██████  ███████ ███████ ██   ██
*/
function get_geolocation_of_user(){
	// HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infowindow.setPosition(pos);
			infowindow.setContent('Location found.');

			map.setCenter(pos);
			set_user_position(pos);
			set_search_position(pos);
			add_user_marker(search_location);

		}, function() {
			// User doesen't allow Geolocation
			// console.log("User doesen't allow Geolocation");
			$('#options').openModal();
			if(search_location !== undefined){
				set_search_position(search_location);
			}

			handleLocationError(true, infowindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		// console.log("Browser doesn't support Geolocation");
		set_search_position(search_location);

		handleLocationError(false, infowindow, map.getCenter());
	}

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {

	infoWindow.setPosition(pos);
	infoWindow.setContent(
		browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.'
	);
}

function set_user_position(location){
	user_position = location;
}

function set_search_position(location){
	// console.log("set_search_position -> location: ", location);
	search_location = location;
	var lat = location.lat;
	var lng = location.lng;
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyBLpRWMwoxfXI4F2hJ6g2jWoKMMjvdj-S0";
	$.get(url, function(result){
		var address = result.results[0].formatted_address;
		document.getElementById('start_location').value = address;
	}, "json");
}

function add_user_marker(user_position){
	// console.log("add_user_marker -> user_position", user_position);
	var dot = {
		url: "/assets/userdot.png",
		size: new google.maps.Size(21,21),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(11,11)
	};

	var marker = new google.maps.Marker({
		map: map,
		position: user_position,
		icon: dot
	});

	create_user_Circle(user_position);
}

function create_user_Circle(location){
	var circle = new google.maps.Circle({
		strokeColor: '#999999',
		strokeOpacity: 0.5,
		strokeWeight: 3,
		fillOpacity: 0.0,
		map: map,
		center: location,
		radius: radius_from_location+(radius_from_location/4)
	});
}

/*
			███    ███  █████  ██████
			████  ████ ██   ██ ██   ██
			██ ████ ██ ███████ ██████
			██  ██  ██ ██   ██ ██
			██      ██ ██   ██ ██
*/
function initMap() {

	//create a new map and set zoom level
	map = new google.maps.Map(document.getElementById('map'), {
		center: search_location,
		zoom: map_zoom_level
	});

	google.maps.event.addDomListener(window, 'resize', function(){
		var new_center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(new_center);
	});

	// create marker at search location
	add_user_marker(search_location);

	// search auto complete
	// var options = {
	// 	types: ['(establishment)']
	// };
	// var searchbox1 = document.getElementById('searchbox1');
	// autocomplete1 = new google.maps.places.Autocomplete(searchbox1, options);
	// var searchbox2 = document.getElementById('searchbox2');
	// autocomplete2 = new google.maps.places.Autocomplete(searchbox2, options);

	// options location auto complete
	var start_location = document.getElementById('start_location');
	autocomplete3 = new google.maps.places.Autocomplete(start_location);

	//window layer on top of map for tooltips
	infowindow = new google.maps.InfoWindow();
	var pos = {};

}

/*
			███████ ███████  █████  ██████   ██████ ██   ██
			██      ██      ██   ██ ██   ██ ██      ██   ██
			███████ █████   ███████ ██████  ██      ███████
			     ██ ██      ██   ██ ██   ██ ██      ██   ██
			███████ ███████ ██   ██ ██   ██  ██████ ██   ██
*/
$("#searchform1").submit(function(event){
	event.preventDefault();
	search_terms = $('#searchbox1').val();
	search_terms2 = $('#searchbox2').val();
	if(search_terms !== '' && search_terms2 !== '' && !res_flag){
		primary_search(search_terms);
	} else {
		// create error message: no search info <===============================
		search_error_response();					//##########################
		//======================================================================
	}
});

function primary_search(search_terms){
	validated_results = [];
	validated_clusters = [];
	result_indices_with_clusters = [];
	result_counter = 0;
	initMap();
	//the first search request gets sent here
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		//location = where to search near
		location: search_location,
		//how far from location to search for things
		radius: radius_from_location,
		//keyword = search term taken from searchbox1
		keyword: search_terms

	}, validate_first_results);
	//creates results and status variables for callback
}

//once first results come back
function validate_first_results(results, status) {

	if (status === google.maps.places.PlacesServiceStatus.OK) {
		//for each result from the search create a marker
		for (var i = 0; i < results.length; i++) {
			rating = results[i].rating;
			if(rating > min_rating || rating === undefined){
				//for the future: add in checks for
				//maximum distance between two places
				validated_results.push(results[i]);
			}
		}

		for (var i = 0; i < validated_results.length; i++){

			rating = validated_results[i].rating;
			latitude = validated_results[i].geometry.location.lat();
			longitude = validated_results[i].geometry.location.lng();

			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch({
				//location = where to search near
				location: {lat: latitude, lng: longitude},
				//how far from location to search for things
				radius: cluster_radius,
				//keyword = search term taken from searchbox1
				keyword: search_terms2

			}, validate_clusters.bind(null, i));
			//find out more about why this works

		}

	} else {
		search_error_response();
	}
}

function validate_clusters(i, clusters, status) {

	if (status === google.maps.places.PlacesServiceStatus.OK) {
		//for each result from the search create a marker
		for (var current_cluster = 0; current_cluster < clusters.length; current_cluster++) {
			var place = clusters[current_cluster];
			if((rating > min_rating || rating === undefined) && place.geometry.location){
				//for the future: add in checks for
				//maximum distance between two places
				validated_clusters.push(clusters[current_cluster]);
				if($.inArray(i, result_indices_with_clusters) == -1){
					result_indices_with_clusters.push(i);
					createMarker(validated_results[i], 'red');
					latitude = validated_results[i].geometry.location.lat();
					longitude = validated_results[i].geometry.location.lng();
					var coords = { lat: latitude, lng: longitude }
					createCircle(coords);
				}

			}
		}
		for (var i = 0; i < validated_clusters.length; i++){
			createMarker(validated_clusters[i], 'blue');
			latitude = validated_clusters[i].geometry.location.lat();
			longitude = validated_clusters[i].geometry.location.lng();
		}
	}

	result_counter += 1;
	//console.log(result_counter, validated_results.length, i);
	if(result_counter == validated_results.length){
		if(result_indices_with_clusters.length === 0){
			search_error_response();
		}
	}
}

/*
			███    ███  █████  ██████  ██   ██ ███████ ██████  ███████
			████  ████ ██   ██ ██   ██ ██  ██  ██      ██   ██ ██
			██ ████ ██ ███████ ██████  █████   █████   ██████  ███████
			██  ██  ██ ██   ██ ██   ██ ██  ██  ██      ██   ██      ██
			██      ██ ██   ██ ██   ██ ██   ██ ███████ ██   ██ ███████
*/

function createMarker(place, color) {
	//takes location from result object and creates a marker/displays it on map
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/'+color+'-dot.png');

	google.maps.event.addListener(marker, 'click', function() {

		var popover_content = "";
		popover_content += "";
		popover_content += "<strong style='font-size: 1.3rem;'>"
		popover_content += "<img src='"+place.icon+"' alt='icon' width='15' height='15'>";
		popover_content += " "+place.name + "</strong>";
		popover_content += "<br />";
		if(place.opening_hours !== undefined){
			if(place.opening_hours.open_now){
				popover_content += "<span style='color:green; float:right;'>Open Now!</span>";
			}else{
				popover_content += "<span style='color:red; float:right;'>Closed</span>";
			}
		}

		if (place.rating != undefined){
			for(i=1; i<=5; i++){
				if(place.rating > i - 1 && place.rating < i){
					starfill='star-half-o';
				} else if (place.rating > i){
					starfill='star';
				} else if (place.rating < i){
					starfill='star-o';
				}
				popover_content += "<i style='color:orange;' class='fa fa-"+starfill+" fa-lg'></i>";
			}
		} else {
			popover_content += "<em>No ratings to show.</em>"
		}

		lat = place.geometry.location.lat();
		lng = place.geometry.location.lng();
		// console.log(place);

		popover_content += "<br />";
		popover_content += "<strong>Address: </strong>" + place.vicinity;
		popover_content += "<br />";
		popover_content += "<div id='directions' lat='"+ lat +"' lng='"+ lng +"'>";
		popover_content += "<i class='fa fa-car fa-lg'></i>";
		popover_content += " <a href='https://www.google.com/maps/dir/"+search_location.lat+","+search_location.lng+"/"+lat+", "+lng+"/' target='_blank'>Directions</a>";
		popover_content += "</div>";

		infowindow.setContent(popover_content);
		infowindow.open(map, this);
	});
}

function createCircle(location){
	var circle = new google.maps.Circle({
		strokeColor: '#FF8533',
		strokeOpacity: 0.4,
		strokeWeight: 2,
		fillColor: '#3C4AFF',
		fillOpacity: 0.1,
		map: map,
		center: location,
		radius: cluster_radius+(cluster_radius/2)
	});
}
