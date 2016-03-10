angular.module('starter', ['ionic', 'ngCordova']);
var angularApp = angular.module('MenuNav', ['ionic']);

angularApp.factory('BookMarkFactory', function() {
  return {
    all: function() {
		var projectString = window.sessionStorage['BookMark'];
		if(projectString) {
			return angular.fromJson(projectString);
		}
		/* Hard-codé pour utilisation sans la fonctionnalité d'ajout de favori */
		//return [];
		return [
			{
				"titre": "Old help cause for student 1",
				"id": 100002,
				"cibles": ["jeune"],
				"longitude": "45.505638",
				"latitude": "-73.613770",
				"organisme": "UdeM",
				"siege": "adresse du siege",
				"emplacement": ["UQAM", "2100 St-Urb"],
				"jours": ["mardi"],
				"heureDeFin": "18h00",
				"heureDeDebut": "20h00",
				"duree": "2h00",
				"dateDebut": "12368522587",
				"dateDeFin": "123685146545",
				"langues": ["france", "anglais"],
				"causes": ["Old Help"],
				"activities": ["aide,", "accueil"],
				"avantages": ["contact avec les gens,", "plaisir de sortir"],
				"periodicity": "bi-hebdomadaire",
				"contacts": {
					"tel": "123456789",
					"mail": "contact@udem.ca",
					"site": "udem.ca"
				},
				"handicape": "oui",
				"access": ["Metro University of Montreal", "bus numero 42"],
				"descriptifShort": "Un evenement pour aider les personnes handicapées à faire les papiers ainsi que leurs courses",
				"descriptifLong": "Un evenement pour aider les personnes handicapées à faire les papiers ainsi que leurs courses bla blabla blablablanlanlealgzrigjoegibeghbqhegbehr"
			},
			{
				"titre": "Old help cause for student 2",
				"id": 100003,
				"cibles": ["jeune"],
				"longitude": "45.505638",
				"latitude": "-73.613770",
				"organisme": "UdeM",
				"siege": "adresse du siege",
				"emplacement": ["UQAM", "2100 St-Urb"],
				"jours": ["mardi"],
				"heureDeFin": "18h00",
				"heureDeDebut": "20h00",
				"duree": "2h00",
				"dateDebut": "12368522587",
				"dateDeFin": "123685146545",
				"langues": ["france", "anglais"],
				"causes": ["Old Help"],
				"activities": ["aide", "accueil"],
				"avantages": ["contact avec les gens", "plaisir de sortir"],
				"periodicity": "bi-hebdomadaire",
				"contacts": {
					"tel": "123456789",
					"mail": "contact@udem.ca",
					"site": "udem.ca"
				},
				"handicape": "non",
				"access": ["Metro University of Montreal", "bus numero 42"],
				"descriptifShort": "Un evenement pour aider les personnes handicapées à faire les papiers ainsi que leurs courses",
				"descriptifLong": "Un evenement pour aider les personnes handicapées à faire les papiers ainsi que leurs courses bla blabla blablablanlanlealgzrigjoegibeghbqhegbehr"
			}
		];
    },
    add: function(bookMark) {
    	var bookMarkArray = this.all();
    	bookMarkArray.push(bookMark);
    	window.sessionStorage['BookMark'] = angular.toJson(bookMarkArray);
	},
	/* delete non testé */
	delete: function(index) {
		var bookMarkArray = this.all();
		var newBookMarkArray = bookMarkArray.splice(index, 1);
		window.sessionStorage['BookMark'] = angular.toJson(newBookMarkArray);
		return newBookMarkArray;
    }
  }
});

//Objet evenemnt pour tester les descriptifs - For test, waiting for Json Data
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
evenement.descriptif ="Un evenement pour aider les personnes agées à faire les papiers ainsi que leurs courses blabla blabla";
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
		templateUrl: 'filter.html',
		controller: 'AppCtrl'
	})
	.state('list', {
		url: '/list',
		templateUrl: 'list.html',
		controller: 'AppCtrl'
	})

	.state('favorite', {
		url: '/favorite',
		templateUrl: 'favorite.html',
		controller: 'AppCtrl'
	});

	$urlRouterProvider.otherwise('/home');
})

angularApp.controller("AppCtrl", function($scope, $ionicHistory){
	var angularScope = $scope;

	angularScope.navigation = {
		pageHeaderLeft1: {
			icon: "button button-icon icon ion-android-globe",
			title: 'Carte de recherche de volontariat',
			directionState: "home"
		},
		pageHeaderLeft2: {
			icon: "button button-icon icon ion-ios-list-outline",
			title: 'Liste de recherche de volontariat',
			directionState: "list"
		},
		pageHeaderLeft3: {
			icon: "button button-icon icon ion-ios-heart-outline",
			title: 'Mes favoris',
			directionState: "favorite"
		},
		pageHeaderRight: {
			icon: "button button-icon icon ion-android-options",
			directionState: "filter"
		}
	};

	angularScope.goBack = function(){
		$ionicHistory.goBack();
	}
});

angularApp.controller("HomeCtrl", function($scope, $ionicHistory){
	var angularScope = $scope;

	function initialize() {
		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(45.514887, -73.559727),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
		var markers = [
			['Old help, 23/02/16 10:00 PM', 45.514887, -73.559727, 4],
			['Other Event, 21/02/16 15:00 PM', 45.522434, -73.602112],
			['Old help, 25/02/16 09:00 PM', 45.623736, -73.769054],
			['New Event, 27/02/16 11:00 PM', 45.536887, -73.559727],
			['Old help, 29/02/16 14:00 PM', 45.568887, -73.559727],
			['New help, 05/03/16 08:00 PM', 45.557678, -73.864627]
		];

		// Info windows displayed above each markers
		var infowindow = new google.maps.InfoWindow();

		// Loop through the array of markers and place each one on the map 
		for(i = 0; i < markers.length; i += 1) {
		
			var marker = new MarkerWithLabel({
					position: new google.maps.LatLng(markers[i][1], markers[i][2]),
					map: map,
					labelContent: "21-02",
					labelAnchor: new google.maps.Point(13, 10),
				    labelClass: "labels", // the CSS class for the label
				    labelInBackground: false,
					icon: {
	                	path: google.maps.SymbolPath.CIRCLE,
				        scale: 16,
				        fillColor: "#FF0000",
				        fillOpacity: 1,
				        strokeWeight: 0.8
				    },					
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

angularApp.controller("FavoriteCtrl", function($scope, BookMarkFactory){
	var angularScope = $scope;
	
	angularScope.items = BookMarkFactory.all();
	angularScope.itemSelected = null;

	angularScope.masterToDetailMode = function($index) {
		$('#view').addClass('mode-detail');

		var childNumber = $index + 1; //In angular, $index starts at 0 but starts at 1 with :nth-child 
		$(".master-item:nth-child(" + childNumber + ")").addClass('master-item-selected').siblings().removeClass('master-item-selected');
	
		angularScope.itemSelected = BookMarkFactory.all()[$index];
	};

	angularScope.detailModeToMaster = function() {
		$('#view').removeClass('mode-detail');
	};
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
	}
};
app.initialize();