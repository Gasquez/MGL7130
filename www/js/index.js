angular.module('starter', ['ionic', 'ngCordova']);
var angularApp = angular.module('MenuNav', ['ionic']);

var evenementsData = new Array();

angularApp.factory('BookMarkFactory', function() {
  return { 
    all: function() {
		var projectString = window.sessionStorage['BookMark'];
		if( projectString != null && projectString != "" && projectString != "undefined" ) {	
			return angular.fromJson(projectString);
		}
		return new Array();
    },
    add: function(bookMark) { //bookMark is a JavaScript object
    	var bookMarkArray = this.all();
    	bookMarkArray.push(bookMark);
    	window.sessionStorage['BookMark'] = angular.toJson(bookMarkArray);
	},
	delete: function(bookMark) {
		var bookMarkArray = this.all();

		// Look for element's index and remove element from array
		bookMarkArray.forEach( function(element, index, array) {
    		
    		if ( angular.toJson(bookMark) == angular.toJson(element) ) {
    			bookMarkArray.splice(index, 1);
    			window.sessionStorage['BookMark'] = angular.toJson(bookMarkArray);
    			return;
    		}

		});
    },
    exist: function(bookMark) {	//bookMark is a JavaScript object
    	var bookMarkArray = this.all();
    	var exist = false;

    	bookMarkArray.forEach( function(element, index, array) {
    		
    		if ( angular.toJson(bookMark) == angular.toJson(element) ) {
    			exist = true;
    			return
    		}

		});

		return exist;
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

	.state('homeEvent', {
		url: '/homeEvent/:eventId',
		templateUrl: 'homeEvent.html',
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

angularApp.controller("AppCtrl", function($scope, $ionicNavBarDelegate,$ionicHistory){
	angularScope = $scope;

	angularScope.navigation = {
		pageHeaderLeft1: {
			icon: "button button-icon icon ion-android-globe",
			titleShort: 'Carte',
			directionState: "home"
		},
		pageHeaderLeft2: {
			icon: "button button-icon icon ion-ios-list-outline",
			titleShort: 'Liste',
			directionState: "list"
		},
		pageHeaderLeft3: {
			icon: "button button-icon icon ion-ios-heart-outline",
			titleShort:'Favoris',
			directionState: "favorite"
		},
		pageHeaderRight: {
			icon: "button button-icon icon ion-android-options",
			titleShort:'Filtres',
			directionState: "filter"
		}
	};

	angularScope.goBack = function(){
		$ionicHistory.goBack();
	};

	$scope.distance = [
	    { text: "rayon 1 km", value: "1km" },
	    { text: "rayon 5 km", value: "5km" },
	    { text: "rayon 10 km", value: "10km" },
	    { text: "rayon > 10 km", value: "10km++" }
	];

	$scope.temps = [
	    { text: "< 1 heure", value: "1hre" },
	    { text: "< 3 heures", value: "3hres" },
	    { text: "< 1 jour", value: "1jr" },
	    { text: ">= 1 jour", value: "1jr++" }
	];

	$scope.populationCible = [
		{ text: "Jeune", value: "jeun" },
	    { text: "Vielle", value: "viel" },
	    { text: "Handicapee", value: "handi" }
	];

  	$scope.periodicity = [
	    { text: "Jounaliere", value: "jour" },
	    { text: "Quotidienne", value: "quot" },
	    { text: "Mensuelle", value: "mens" }
	];

    $scope.data = {
    distance: '5km'
    //temps: '1jr'
 	};
 		  
	$scope.serverSideChange = function(item) {
		console.log("Selected Serverside, text:", item.text, "value:", item.value);
	};

	//Close nav bar every time you load the view
	angularScope.$on('$ionicView.beforeEnter', function() {
		if(window.matchMedia("(min-width: 768px)").matches)
		{
			$ionicNavBarDelegate.showBar(false);
		}
	});
});

angularApp.controller("HomeCtrl", function($scope,$http, $ionicNavBarDelegate, BookMarkFactory){
	var angularScope = $scope;
	angularScope.itemSelected = null;
	angularScope.itemInFavorite = false;

	/***	Reload itemInFavorite when view loading (fix bug on itemInFavorite value when going back to home) 	***/
	angularScope.$parent.$on("$ionicView.beforeEnter", function(event) {	// $ionicView.enter can only be catched by parent controller
		if ( angularScope.itemSelected != null ) {
			angularScope.itemInFavorite = BookMarkFactory.exist(angularScope.itemSelected);
		}
	});

	angularScope.changeBookMark = function(eventObj) {
		if ( angularScope.itemInFavorite == false ) {
			BookMarkFactory.add(eventObj);

			angularScope.itemInFavorite = true;
		} else {
			BookMarkFactory.delete(eventObj);

			angularScope.itemInFavorite = false;
		}
	};

	function loadData(){
		$http.get('data.json')
	    .then(function(res){
	    	evenementsData = res.data;
	    	initialize();
	    });
	}


	function initialize() {
		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(45.514887, -73.559727),
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			disableDefaultUI: true
		};

		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		angularScope.itemSelected = evenementsData[0];
		// Loop through the array of evenements and place each one on the map 
		for(i = 0; i < evenementsData.length; i += 1) {

			//Loading information events from bdd
			var itemSelected = evenementsData[i];

			var lab = itemSelected.date[0];

			var marker = new MarkerWithLabel({
				position: new google.maps.LatLng(itemSelected.latitude,itemSelected.longitude),
				map: map,
				labelContent: lab,
				labelAnchor: new google.maps.Point(13, 10),
			    labelClass: "labels", // the CSS class for the label
			    labelInBackground: false,
				icon: {
                	path: google.maps.SymbolPath.CIRCLE,
			        scale: 16,
			        fillColor: "#FF0000",
			        fillOpacity: 1,
			        strokeWeight: 0.8
			    }					
			});
		
			// Add click action on each marcker
			google.maps.event.addListener(marker, 'click', (function(itemSelected) {
			  	return function() {
			      // Display event informations
			      angularScope.$apply(function() {
			      	angularScope.itemSelected = itemSelected;

			      	angularScope.itemInFavorite = BookMarkFactory.exist(angularScope.itemSelected);
			      });
				}
			})(itemSelected));
		}

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  }, null, {enableHighAccuracy:true});
		handleNavBarVisibility(window.matchMedia("(min-width: 768px)"));

	};

	// media query event handler
	if (matchMedia) {
	  var mq = window.matchMedia("(min-width: 768px)");
	  mq.addListener(handleNavBarVisibility);
	  handleNavBarVisibility(mq);
	}

	// change in fonction of width
	function handleNavBarVisibility(mq) {

	  if (mq.matches) {
	  	// if screen >= 768px, hidde nav bar
	  	 $ionicNavBarDelegate.showBar(false);
	  } else {
	  	// if screen < 768px, show nav bar
	  	$ionicNavBarDelegate.showBar(true);
	  }

	};
	google.maps.event.addDomListener(window, "load", loadData);
});

angularApp.controller("HomeEventCtrl", function($scope, $state, $stateParams){
	var angularScope = $scope;
	var eventId = $stateParams.eventId;

	if ( $stateParams.hasOwnProperty("eventId") && eventId.trim() != "" ) {

		evenementsData.forEach( function(element, index, array) {

			if ( element.hasOwnProperty("id") && element.id == eventId ) {
				angularScope.itemSelected = array[index];
				return;
			}

		});

	} else {
		console.log("Error: no eventId parameter!");
	}
});

angularApp.controller("FavoriteCtrl", function($scope, $window, $state, BookMarkFactory){
	var angularScope = $scope;
	angularScope.items = BookMarkFactory.all();
	angularScope.itemSelected = null;
	angularScope.itemInFavorite = true; 

	angularScope.changeBookMark = function(eventObj) {
		// In this controller, items always are in favorite
		if ( angularScope.itemInFavorite == false ) {
			// Nothing to do, cannot add event to favorite from here
		} else {
			BookMarkFactory.delete(eventObj);

			if (navigator.notification) {
				navigator.notification.alert( "Favoris supprimé.", null, '', 'Ok' );
			}
			else {
				alert( "Favoris supprimé." );
			}
			
			// Switch to next favorite if exists, otherwise refresh page
			var favoriteList = BookMarkFactory.all();

			if ( favoriteList.length != 0 ) {
				angularScope.itemSelected = favoriteList[0];
			} else {
				$state.go("home");
			}
		}
	};

	angularScope.masterToDetailMode = function($index) {
		$('#view').addClass('mode-detail');

		var childNumber = $index + 1; //In angular, $index starts at 0 but starts at 1 with :nth-child 
		$(".master-item-favorite:nth-child(" + childNumber + ")").addClass('master-item-favorite-selected').siblings().removeClass('master-item-favorite-selected');
	
		angularScope.itemSelected = BookMarkFactory.all()[$index];
	};

	angularScope.detailModeToMaster = function() {
		$('#view').removeClass('mode-detail');
	};

	/* For test : open automaticaly first event (we know it exists because data.json is hard-coded)*/
	if(window.matchMedia("(min-width: 768px)").matches)
	{
		angularScope.masterToDetailMode(0);
	}
});

angularApp.controller("ListCtrl", function($scope, BookMarkFactory){
	var angularScope = $scope;
	angularScope.items = evenementsData;
	angularScope.itemSelected = evenementsData[0];
	angularScope.itemInFavorite = false;

	angularScope.changeBookMark = function(eventObj) {
		if ( angularScope.itemInFavorite == false ) {
			BookMarkFactory.add(eventObj);

			angularScope.itemInFavorite = true;
		} else {
			BookMarkFactory.delete(eventObj);

			angularScope.itemInFavorite = false;
		}
	};

	angularScope.masterToDetailMode = function($index) {
		angularScope.itemInFavorite = false;

		$('#viewList').addClass('mode-detail');

		var childNumber = $index + 1; //In angular, $index starts at 0 but starts at 1 with :nth-child 
		$(".master-item-list:nth-child(" + childNumber + ")").addClass('master-item-list-selected').siblings().removeClass('master-item-list-selected');
	
		angularScope.itemSelected = evenementsData[$index];

		// Check if the new event selected is already inside favorite list
		if ( BookMarkFactory.exist(angularScope.itemSelected) ) {
			angularScope.itemInFavorite = true;
		} else {
			angularScope.itemInFavorite = false;
		}
	};

	angularScope.detailModeToMaster = function() {
		$('#viewList').removeClass('mode-detail');
	};

	/* For test : open automaticaly first event (we know it exists because data.json is hard-coded)*/
	if(window.matchMedia("(min-width: 768px)").matches)
	{
		angularScope.masterToDetailMode(0);
	}

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