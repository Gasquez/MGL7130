var angularApp = angular.module('MenuNav', ['ionic']);
var angularScope;
//Objet evenemnt pour tester les descriptifs :
var evenement1 = new Object();
 evenement1.titre ="Old help cause for student";
 evenement1.ID = "236554";
 evenement1.latlng = "45.514887, -73.559727";
 evenement1.organisme ="UQAM";
 evenement1.siege ="adresse du siege";
 evenement1.webSite="uqam.ca";
 evenement1.emplacement = "at the place";
 evenement1.date ="23/02/2016";
 evenement1.heure ="10h00";
 evenement1.langue ="france";
 evenement1.causes = "Old Help";
 evenement1.activity= "aide et accueil";
 evenement1.avantages = "contact avec les gens";
 evenement1.periode ="one time";
 evenement1.periodicity = "mensuel";
 evenement1.contact = "contact@UQAM.ca";
 evenement1.acces = "Metro place des arts";
 evenement1.descriptif ="Un evenement1 pour aider les personnes agee a faire les papiers ainsi que leurs courses bla bla blabla bla blabla bla blabla bla blabla bla blabla bla bla bla bla blabla bla blabla bla blabla bla blabla bla blabla bla bla bla bla blabla bla blabla bla blabla bla blabla bla blabla bla bla";
 evenement1.accessibleToDisabled = true;
 evenement1.inscred = false;
 evenement1.favored = false;

var evenement2 = new Object();
 evenement2.titre ="Other event";
 evenement2.ID = "236554";
 evenement2.latlng = "45.514887, -73.559727";
 evenement2.organisme ="UQAM";
 evenement2.siege ="adresse du siege";
 evenement2.webSite="uqam.ca";
 evenement2.emplacement = "at the place";
 evenement2.date ="23/02/2016";
 evenement2.heure ="10h00";
 evenement2.langue ="france";
 evenement2.causes = "Old Help";
 evenement2.activity= "aide et accueil";
 evenement2.avantages = "contact avec les gens";
 evenement2.periode ="one time";
 evenement2.periodicity = "mensuel";
 evenement2.contact = "contact@UQAM.ca";
 evenement2.acces = "Metro place des arts";
 evenement2.descriptif ="other event descp";
 evenement2.accessibleToDisabled = true;
 evenement2.inscred = false;
 evenement2.favored = false;


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

angularApp.controller("AppCtrl", function($scope,  $ionicNavBarDelegate){
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
			['Old help, 23/02/16 10:00 PM', 45.514887, -73.559727, 4, evenement1],
			['Other Event, 00/00/00 00:00 PM', 45.52243499999999, -73.60211099999998,4,evenement2],
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
			      	currentEvenement = markers[i][4];
			      	angularScope.eventSelected = { 
			      		name: currentEvenement.titre,
						afterName: ', ' + currentEvenement.date + ', ' + currentEvenement.heure,
			      		desc: '<b> Descriptif : </b>' + currentEvenement.descriptif + 
			      		'<br />' + 
			      		'<b>Activités : </b>'+ currentEvenement.activity
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
		WidthChange(window.matchMedia("(min-width: 640px)"));

	};

	// media query event handler
	if (matchMedia) {
	  var mq = window.matchMedia("(min-width: 640px)");
	  mq.addListener(WidthChange);
	  WidthChange(mq);
	}

	// change in fonction of width
	function WidthChange(mq) {

	  if (mq.matches) {
	  	// if screen >= 640px, hidde nav bar
	  	 $ionicNavBarDelegate.showBar(false);
	  } else {
	  	// if screen < 640px, show nav bar
	  	$ionicNavBarDelegate.showBar(true);
	  }

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