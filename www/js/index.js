angular.module('starter', ['ionic', 'ngCordova']);
var angularApp = angular.module('MenuNav', ['ionic']);

var userLogged = false;
var evenementsData = new Array();

angularApp.service('PreferencesService', function() {
    this.all =  function() {
		if(window.localStorage.getItem('Preferences') == null){
			return new Array();
		} else{
			return angular.fromJson(window.localStorage.getItem('Preferences'));
		}
    },
    this.add = function(category,item) {
		var success = false;
		if(window.localStorage.getItem('Preferences') == null){
			var object = new Array();
			object.push([category,item]);
			window.localStorage.setItem('Preferences',angular.toJson(object));
		} else{
			var myPreferences = angular.fromJson(window.localStorage.getItem('Preferences'));
			myPreferences.forEach(function (element, index, array) {
				//element is one couple of category and item
				if(element[0].toString() == category.toString()){
					if(element[1].text.toString() == item.text.toString()){
						success = true;
						return;
					} else {
						myPreferences[index] = [category,item];
						success = true;
						return;
					}
				}
			});
			window.localStorage.removeItem('Preferences');
			if(success != true){
				if(myPreferences == null || myPreferences.toString() == ""){
					var object = new Array([category,item]);
					window.localStorage.setItem('Preferences',angular.toJson(object));
				} else {
					myPreferences.push([category,item]);
					window.localStorage.setItem('Preferences',angular.toJson(myPreferences));
				}
			} else {
				window.localStorage.setItem('Preferences',angular.toJson(myPreferences));
			}
		}
	},

	this.delete = function(category) {
		if(!window.localStorage.getItem('Preferences')){
			return;
		} else{
			var myPreferences = angular.fromJson(window.localStorage.getItem('Preferences'));
			myPreferences.forEach(function (element, index, array) {
				//element is one couple of category and item
				if(element[0] == category){
					myPreferences.splice(index, 1);
					return;
				}
			});
			window.localStorage.removeItem('Preferences');
			if(myPreferences.toString() != "undefined" ){
				window.localStorage.setItem('Preferences',angular.toJson(myPreferences));
			}
		}
    },

    this.getPreferences = function (category) {
		if(window.localStorage.getItem('Preferences') == null){
			return;
		} else{
			var returnValue = "none";
			var myPreferences = angular.fromJson(window.localStorage.getItem('Preferences'));
			myPreferences.forEach(function (element, index, array) {
				//element is one couple of category and item
				if(element[0].toString() == category.toString()){
					returnValue = element[1].value;
					return
				}
			});
			return returnValue;
		}
	};

    this.clear = function(){
    	localStorage.clear();
    }
});

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
    			return;
    		}

		});

		return exist;
    }
  }
});

angularApp.service('UserService', function() {
	var profilStored = sessionStorage.getItem("facebook");

	this.getUser = function() {
		if ( profilStored == null ) {
	    	return {name: "unknow", picture: ""};
		} else {
			return profilStored;
		}
	};

	this.setUser = function(name, picture) {
	    profilStored = {name: name, picture: picture};
	};
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

angularApp.controller("AppCtrl", function($scope, $ionicHistory, UserService){
	var angularScope = $scope;

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

	angularScope.$on('$ionicView.beforeEnter', function() {
		// Update user profil info
		angularScope.userNameFB = UserService.getUser().name;
		angularScope.userPictureFB= UserService.getUser().picture;

		angularScope.logged = userLogged;
	});

	angularScope.logOut = function() {
		facebookConnectPlugin.logout(function() {
			userLogged = false;
			window.location.reload();
		}, function(msg){
			console.log(msg);
		});
	};
});

angularApp.controller("FilterCtrl", function($scope, PreferencesService){
	var angularScope = $scope;

	angularScope.distance = [
	    { text: "rayon 1 km", value: "1km" },
	    { text: "rayon 5 km", value: "5km" },
	    { text: "rayon 10 km", value: "10km" },
	    { text: "rayon > 10 km", value: "10km++" },
	    { text: "None", value: "none"}
	];

	angularScope.temps = [
	    { text: "< 1 heure", value: "1hre" },
	    { text: "< 3 heures", value: "3hres" },
	    { text: "< 1 jour", value: "1jr" },
	    { text: ">= 1 jour", value: "1jr++" },
	    { text: "None", value: "none"}
	];

	angularScope.populationCible = [
		{ text: "Jeune", value: "jeun" },
	    { text: "Vielle", value: "viel" },
	    { text: "Handicapee", value: "handi" },
	    { text: "None", value: "none"}
	];

  	angularScope.periodicity = [
	    { text: "Jounaliere", value: "jour" },
	    { text: "Quotidienne", value: "quot" },
	    { text: "Mensuelle", value: "mens" },
	    { text: "None", value: "none"}
	];

	angularScope.lieu = [
		    { text: "Postal code", value: "pcode" },
		    { text: "City", value: "city" },
		    { text: "State", value: "state" },
		    { text: "Pays", value: "pays" },
		    { text: "None", value: "none"}
		];

    angularScope.data = {
	    distance: PreferencesService.getPreferences('distance'),
	    temps: PreferencesService.getPreferences('temps'),
	    populationCible: PreferencesService.getPreferences('populationCible'),
	    periodicity: PreferencesService.getPreferences('periodicity'),
	    lieu: PreferencesService.getPreferences('lieu')
 	};

	angularScope.changePreferences = function(category,item) {
		if (item.text == "None"){
			PreferencesService.delete(category);
		} else {
			PreferencesService.add(category,item);
		}
	};
});

angularApp.controller("HomeCtrl", function($scope,$http, BookMarkFactory){
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

	var styles = [{
        url: 'img/people35.png',
        height: 35,
        width: 35,
        anchor: [0, 0],
        textColor: 'white',
        textSize: 10
      }, {
        url: 'img/people45.png',
        height: 45,
        width: 45,
        anchor: [24, 0],
        textColor: '#ff0000',
        textSize: 11
      }, {
        url: 'img/people55.png',
        height: 55,
        width: 55,
        anchor: [32, 0],
        textColor: '#ffffff',
        textSize: 12
      }];

	function initialize() {
		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(45.514887, -73.559727),
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			disableDefaultUI: true
		};

		var mcOptions = {gridSize: 100, maxZoom: 16, styles: styles};
		var markers = [];
		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		angularScope.itemSelected = evenementsData[0];
		// Loop through the array of evenements and place each one on the map 
		for(i = 0; i < evenementsData.length; i += 1) {

			//Loading information events from bdd
			var itemSelected = evenementsData[i];
			var lab = itemSelected.date[0];
			var Lat = itemSelected.latitude;
			var Lgn = itemSelected.longitude;

			var marker = new MarkerWithLabel({
				position: new google.maps.LatLng(Lat,Lgn),
				map: map,
				labelContent: lab,
				labelAnchor: new google.maps.Point(13, 10),
			    labelClass: "labels", // the CSS class for the label
			    labelInBackground: false,
			    labelVisible: true,
			    isClicked: false,
				icon: {
                	path: google.maps.SymbolPath.CIRCLE,
			        scale: 16,
			        fillColor: "#FF0000",
			        fillOpacity: 1,
			        strokeWeight: 0.8
			    }					
			});

			markers.push(marker);

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

			// change color marker on click
			google.maps.event.addListener(marker, 'click', function(e) {
				this.isClicked = true;
				this.set('labelClass', 'labels active');     	       
		    });

			// reset color marker on double click
		    google.maps.event.addListener(marker, 'dblclick', function(e) {
		    	this.isClicked = false;
		    	this.set('labelClass', 'labels');
			});

		    // change color marker on mouseover
		    google.maps.event.addListener(marker, 'mouseover', function(e) {
		        this.set('labelClass', 'labels hover');
		    });

		    // change or reset color marker on mouseout
		    google.maps.event.addListener(marker, 'mouseout', function(e) {
		        if (this.isClicked){
		            this.set('labelClass', 'labels active');
		        } else {
		            this.set('labelClass', 'labels');
		        }
		    });		
		}

		var markerCluster = new MarkerClusterer(map, markers, mcOptions);

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  }, null, {enableHighAccuracy:true});
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

angularApp.controller("detailEventCtrl", function($scope, UserService) {
	var angularScope = $scope;
	angularScope.showLoginView = false;
	angularScope.participationPending = false;

	angularScope.participateToEvent = function() {
		// if not logged
		if (userLogged == false) {
			angularScope.showLoginView = true;
			angularScope.participationPending = true;
		} else {
			joiningEvent();
		}
	}

	angularScope.connectWithFB = function() {
		// Connect with FB, participate to an event on success if participationPending is true

		facebookConnectPlugin.login(["public_profile"], connectionSucceeded, function(msg){
			console.log(msg);
		});
	}

	angularScope.goBack = function() {
      angularScope.$apply(function() {
      	angularScope.showLoginView = false;
      });
	}

	function connectionSucceeded(response) {
		userLogged = true;

		// Fetch the name
		facebookConnectPlugin.api("/me", ["public_profile"], function(data){
			// Fetch the picture
			facebookConnectPlugin.api("/me/picture?redirect=false", ["public_profile"], function(ret){
				UserService.setUser(data.name, ret.data.url);
			}, function(msg){		
				console.log(msg);
			});
		}, function(msg){		
			console.log(msg);
		});

		if (angularScope.participationPending == true) {
			joiningEvent();
		}

		// Not working, is supposed to hide the connection panel
		angularScope.goBack();
	}

	function joiningEvent() {
		//TODO Register people to the event
		console.log("participating to an event .....");




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
		console.log("onDeviceReady");

		//Initialize the JS SDK if in browser mode
		if (window.cordova.platformId == "browser") {
			facebookConnectPlugin.browserInit('101844923550027', 'v2.5', function(){
			});			
		} else {
			// Nothing to do
		}
	}
};
app.initialize();