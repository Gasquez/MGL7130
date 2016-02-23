var angularApp = angular.module('MenuNav', ['ionic']);
var angularScope;
//Objet evenemnt pour tester les descriptifs :
var evenement = new Object();
 evenement.titre ="Old help cause for student";
 evenement.ID = "236554";
 evenement.latlng = "45.514887, -73.559727";
 evenement.organisme ="UQAM";
 evenement.siege ="adresse du siege";
 evenement.webSite="uqam.ca";
 evenement.emplacement = "at the place";
 evenement.date ="23/02/2016";
 evenement.heure ="10h00";
 evenement.langue ="france";
 evenement.causes = "Old Help";
 evenement.activity= "aide et accueil";
 evenement.avantages = "contact avec les gens";
 evenement.periode ="one time";
 evenement.periodicity = "mensuel";
 evenement.contact = "contact@UQAM.ca";
 evenement.acces = "Metro place des arts";
 evenement.descriptif ="Un evenement pour aider les personnes agee a faire les papiers ainsi que leurs courses bla bla blabla bla blabla bla blabla bla blabla bla blabla bla bla bla bla blabla bla blabla bla blabla bla blabla bla blabla bla bla bla bla blabla bla blabla bla blabla bla blabla bla blabla bla bla";
 evenement.accessibleToDisabled = true;
 evenement.inscred = false;
 evenement.favored = false;



angularApp.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'home.html',
		controller: 'AppCtrl'
	})

	.state('filter', {
		url: '/filter',
		templateUrl: 'filter.html'
	});

	$urlRouterProvider.otherwise('/home');
})

angularApp.controller("AppCtrl", function($scope){
	angularScope = $scope;

	angularScope.navigation = {
		page1: {
			title: 'Volunteer Seeker Map',
			direction: "/home"
		},
		pageHeaderRight: {
			title: 'Filter',
			direction: "filter"
		}
	};

	function initialize() {
		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(45.514887, -73.559727),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		var markers = [
			['Old help, 23/02/16 10:00 PM', 45.514887, -73.559727, 4],
			['Other Event, 00/00/00 00:00 PM', 45.52243499999999, -73.60211099999998],
		];

		// Info windows displayed above each markers
		var infowindow = new google.maps.InfoWindow();

		// Loop through the array of markers and place each one on the map 
		for(i = 0; i < markers.length; i += 1) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(markers[i][1], markers[i][2]),
				map: map
			});

			// Add click action on each marcker
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
			  	return function() {
			  		infowindow.setContent(markers[i][0]);
			  		infowindow.open(map, marker);

			      // Display event informations
			      eventInfoContent = markers[i][1] + " - " + markers[i][2];
			      angularScope.$apply(function() {
			      	angularScope.eventSelected = { 
			      		name: evenement.titre,
						afterName: ', ' + evenement.date + ', ' + evenement.heure,
			      		desc: '<b> Descriptif : </b>' + evenement.descriptif + 
			      		'<br />' + 
			      		'<b>Activités : </b>'+ evenement.activity
			      	};
			      });
				}
			})(marker, i));
		}

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
//For test :var marker = new google.maps.Marker({
//			    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
//			    map: map
//		 	}); 
		  }, null, {enableHighAccuracy:true});
	};

	google.maps.event.addDomListener(window, "load", initialize);
});


var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		// L'API Cordova est prête		
		angularScope.$apply(function() {
			// angularScope.version = device.version;
		});
	}
};
app.initialize();