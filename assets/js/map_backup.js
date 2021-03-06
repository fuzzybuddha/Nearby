var map;
var infowindow;

var validated_results = [];
var validated_clusters = [];
var result_indices_with_clusters = [];
var search_terms = "";
var search_terms2 = "";
var user_position;
var search_location;

// options
var default_center = {lat: 37.377, lng: -121.914};
var search_radius = 1000;
var distance_from_user = 5000;
var map_zoom_level = 12;

// $("#options-link").click(function(){
// 	$("#distance_from_user").val(distance_from_user);
// 	$("#search_radius").val(search_radius);
// })

// new options code
$("#options").submit(function(event){
	event.preventDefault();
	if (user_position){
		var address = $("start_location").val();
		user_position = pos_from_address(address);
		distance_from_user = $('#distance_from_user').val();
		search_radius = $('#search_radius').val();

		console.log(user_position);
		console.log(distance_from_user);
		console.log(search_radius);

		initMap();

		$('#options').closeModal();
	}
})

function pos_from_address(address){
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK){
			position = {
				lat:results[0].geometry.location.latitude,
				lng:results[0].geometry.location.longitude
			};
			set_user_position(position);
		} else {
			return false;
		}
	});
}
//========================== end options code

$("#searchform1").submit(function(event){
	event.preventDefault();
	search_terms = $('#searchbox1').val();
	search_terms2 = $('#searchbox2').val();
	if(search_terms !== '' && search_terms2 !== ''){
		init_search(search_terms);
	}
});

function initMap() {
	get_geolocation_of_user();

	//create a new map and set zoom level
	map = new google.maps.Map(document.getElementById('map'), {
		center: user_position,
		zoom: map_zoom_level
	});

	google.maps.event.addDomListener(window, 'resize', function(){
		var new_center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(new_center);
	});

	// search boxes
	// var input1 = document.getElementById('searchbox1');
	// autocomplete1 = new google.maps.places.Autocomplete(input1);
	// var input2 = document.getElementById('searchbox2');
	// autocomplete2 = new google.maps.places.Autocomplete(input2);

	// options location auto complete
	var start_location = document.getElementById('start_location');
	autocomplete3 = new google.maps.places.Autocomplete(start_location);

	//window layer on top of map for tooltips
	infowindow = new google.maps.InfoWindow();
	var pos = {};

}

function set_user_position(location){
	user_position = location;
	// console.log(user_position);
	var lng = user_position.lng;
	var lat = user_position.lat;
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyBLpRWMwoxfXI4F2hJ6g2jWoKMMjvdj-S0"
	var address;
	$.get(url, function(result){
		address = result.results[0].formatted_address;
		document.getElementById('start_location').value = address;
	}, "json");
}

function add_user_marker(user_position){

	var marker = new google.maps.Marker({
		map: map,
		position: user_position
	});
	marker.setIcon('/assets/userdot.png');
	create_user_Circle(user_position);
}


function init_search(search_terms){
	validated_results = [];
	validated_clusters = [];
	result_indices_with_clusters = [];
	initMap();
	//the first search request gets sent here
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		//location = where to search near
		location: user_position,
		//how far from location to search for things
		radius: distance_from_user,
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
			if(rating > 2){
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
				radius: search_radius,
				//keyword = search term taken from searchbox1
				keyword: search_terms2

			}, validate_clusters.bind(null, i));
			//find out more about why this works
		}
	}
}

function validate_clusters(i, clusters, status) {

	if (status === google.maps.places.PlacesServiceStatus.OK) {
		//for each result from the search create a marker
		for (var current_cluster = 0; current_cluster < clusters.length; current_cluster++) {
			var place = clusters[current_cluster];
			if(rating > 2 && place.geometry.location){
				//for the future: add in checks for
				//maximum distance between two places
				validated_clusters.push(clusters[current_cluster]);
				if($.inArray(i, result_indices_with_clusters) == -1){
					result_indices_with_clusters.push(i);
					createMarker(validated_results[i], 'red');
					latitude = validated_results[i].geometry.location.lat();
					longitude = validated_results[i].geometry.location.lng();
					var coords = { lat: latitude,
						lng: longitude }
						createCircle(coords);
					}

				}
			}
			// console.log("result!", result_indices_with_clusters);
			// console.log("validated_results");
			// console.log(validated_results);
			// console.log(validated_results.length);
			// console.log("validated_clusters");
			// console.log(validated_clusters);
			// console.log(validated_clusters.length);
			// console.log(validated_results.length, " validated_results: ", validated_results);
			for (var i = 0; i < validated_clusters.length; i++){
				createMarker(validated_clusters[i], 'blue');
				latitude = validated_clusters[i].geometry.location.lat();
				longitude = validated_clusters[i].geometry.location.lng();
			}
		}
	}




	function get_geolocation_of_user(){
		var pos;
		// Try HTML5 geolocation.
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {

				pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				infowindow.setPosition(pos);
				infowindow.setContent('Location found.');

				map.setCenter(pos);
				set_user_position(pos);
				add_user_marker(pos);

			}, function() {
				map.setCenter(default_center);
				set_user_position(default_center);
				add_user_marker(default_center);

				handleLocationError(true, infowindow, map.getCenter());
			});
		} else {
			// Browser doesn't support Geolocation

			handleLocationError(false, infowindow, map.getCenter());
			//ask for current location if geolocation isn't working
		}

	}

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
			if(place.opening_hours != undefined){
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
			popover_content += " <a href='https://www.google.com/maps/dir/"+user_position.lat+","+user_position.lng+"/"+lat+", "+lng+"/' target='_blank'>Directions</a>";
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
			radius: search_radius+600
		});
	}

	function create_user_Circle(location){
		var circle = new google.maps.Circle({
			strokeColor: '#999999',
			strokeOpacity: 0.3,
			strokeWeight: 2,
			fillColor: '#3C4AFF',
			fillOpacity: 0.0,
			map: map,
			center: location,
			radius: distance_from_user+2500
		});
	}





	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ?
			'Error: The Geolocation service failed.' :
			'Error: Your browser doesn\'t support geolocation.');
		}
