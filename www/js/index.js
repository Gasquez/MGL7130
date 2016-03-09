angular.module('starter', ['ionic', 'ngCordova']);
var angularApp = angular.module('MenuNav', ['ionic']);

/* For test, waiting for JSON data */
var evenement1 = new Object();
 evenement1.titre ="Old help cause for student";
 evenement1.ID = "236554";
 evenement1.lat = "45.514887";
 evenement1.lng = "-73.559727";
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
 evenement2.lat = "45.52243499999999"
 evenement2.lng = "-73.60211099999998";
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

var evenementsData = new Array(evenement1,evenement2);
/* ********************** */

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
				nom: "Test 1",
				desc: "Information sur test 1"
			},
			{
				nom: "Test 2",
				desc: "Information sur test 2"
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
	angularScope = $scope;

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
			title: "Filter",
			directionState: "filter"
		}
	};

	angularScope.goBack = function(){
		$ionicHistory.goBack();
	}
});

angularApp.controller("HomeCtrl", function($scope, $ionicNavBarDelegate){
	var angularScope = $scope;;

	function initialize() {
		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(45.514887, -73.559727),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};

		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		// Loop through the array of evenements and place each one on the map 
		for(i = 0; i < evenementsData.length; i += 1) {

			//Loading information events from bdd
			var currentEvenement = evenementsData[i];

			var marker = new MarkerWithLabel({
					position: new google.maps.LatLng(currentEvenement.lat,currentEvenement.lng),
					map: map,
					labelContent: currentEvenement.date,
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
			google.maps.event.addListener(marker, 'click', (function(currentEvenement) {
			  	return function() {
			      // Display event informations
			      angularScope.$apply(function() {
			      	angularScope.eventSelected = {
			      		name: currentEvenement.titre,
						afterName: ', ' +currentEvenement.date + ', ' + currentEvenement.heure,
			      		desc: '<b> Descriptif : </b>' + currentEvenement.descriptif + 
			      		'<br />' + 
			      		'<b>Activités : </b>'+ currentEvenement.activity
			      	};
			      });
				}
			})(currentEvenement));
		}

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
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

angularApp.controller("FavoriteCtrl", function($scope, BookMarkFactory){
	var angularScope = $scope;
	
	angularScope.items = BookMarkFactory.all();

	angularScope.masterToDetailMode = function() {
		$('#view').addClass('mode-detail');
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