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
			center: new google.maps.LatLng(-33.89, 151.27),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		var markers = [
			['Bondi Beach, 01/30/16 2:00 PM', -33.890542, 151.274856, 4],
			['Coogee Beach, 01/30/16 2:00 PM', -33.923036, 151.259052, 5],
			['Cronulla Beach, 01/30/16 2:00 PM', -34.028249, 151.157507, 3],
			['Manly Beach, 01/30/16 2:00 PM', -33.80010128657071, 151.28747820854187, 2],
			['Maroubra Beach, 01/30/16 2:00 PM', -33.950198, 151.259302, 1]
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
			      		name: markers[i][0],
			      		desc: eventInfoContent + 
			      		'<br />' + 
			      		eventInfoContent + 
			      		'<br />' + 
			      		eventInfoContent
			      	};
			      });
				}
			})(marker, i));
		}
	}
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
		angularScope.$apply(function() {
			// angularScope.version = device.version;
		});
	}
};
app.initialize();