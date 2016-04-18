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
	},

    this.clear = function(){
    	localStorage.clear();
    }
});

angularApp.service('CheckEvenementService', function(MathsService) {
	this.checkPeriodicity = function(periodicity, evenement){
		if(periodicity != "none"){
			if(evenement.periodicity == periodicity){
				return true;
			}
		} else {
			return true;
		}
		return false;
	},
	this.checkTime = function(temps, evenement){
		if(temps != "none"){
			var valueOfEvenementTime = "none";
			var valueOfTemps = "none";
			var valueOfEvenementTimeDayOrHours = "none";

			//Evenement time traitment
			if(evenement.duree.indexOf("h") != -1){
				valueOfEvenementTime = evenement.duree.split("h");
				valueOfEvenementTimeDayOrHours = "h";
			} else {
				valueOfEvenementTime = evenement.duree.split("j");
				valueOfEvenementTimeDayOrHours = "j";
			}
			//Filter time traitment
			if(temps == "++"){
				//Case time fitler is more than one days
				if(valueOfEvenementTimeDayOrHours != "h" && valueOfEvenementTime[0] > 1){
					return true;
				}
			} else if(temps.indexOf("h") != -1){
				//Case time filter in hours
				valueOfTemps = temps.split("h");
				if(valueOfEvenementTimeDayOrHours == "h"){
					if(valueOfEvenementTime[0] < valueOfTemps[0]){
						return true;
					} else if (valueOfEvenementTime[0] == valueOfTemps[0]){
						if(valueOfEvenementTime[1] <= valueOfTemps[1]){
							return true;
						}
					}
				}
			} else {
				//Case time filter in days
				if(valueOfEvenementTimeDayOrHours == "h"){
					return true;
				} else {
					valueOfTemps = temps.split("j");
					if(valueOfEvenementTime[0] < valueOfTemps[0]){
						return true;
					} else if (valueOfEvenementTime[0] == valueOfTemps[0]){
						if(valueOfEvenementTime[1] <= valueOfTemps[1]){
							return true;
						}
					}
				}
			}
		} else {
			return true;
		}
		return false;
	},
	this.checkPopulationCible = function(populationCible, evenement){
		if(populationCible != "none"){
			if(evenement.cibles == populationCible){
				return true;
			}
		} else {
			return true;
		}
		return false;
	},
	this.chekDistance = function(distance, evenement, myPosition){
		if(distance != "none"){
			var distanceUserAndParameters = MathsService.distanceBetweenUserAndParameters(evenement.latitude,evenement.longitude,myPosition);
			if(distance == "++"){
				if(distanceUserAndParameters > 30){
					return true;
				}
			} else if(distanceUserAndParameters <= distance){
				return true;
			};
		} else {
			return true;
		}
		return false;
	},
	this.checkEvenement = function(periodicity, temps, populationCible, distance, evenement, myPosition){
		return this.checkTime(temps, evenement) 
				&& this.checkPeriodicity(periodicity, evenement) 
				&& this.checkPopulationCible(populationCible, evenement) 
				&& this.chekDistance(distance, evenement, myPosition);
	}
});

angularApp.service('FilterMarkersService', function(PreferencesService, CheckEvenementService){
	this.filterMarkers = function(markers, markerCluster, map, myPosition){
		var preferences = PreferencesService.all();
		var periodicity = "none";
		var temps = "none";
		var populationCible = "none";
		var distance = "none";
		var returnValue = "none";

		if(preferences == null || preferences.length == 0){
			//set visiblity for each markers
			markers.forEach(function(element, index, array) {
			    markers[index].setMap(map);
			});

			markerCluster.clearMarkers();
			markerCluster.addMarkers(markers,true);
			return returnValue;
		} else {//filter to apply
			markers.forEach(function(element, index, array) {
			    markers[index].setMap(null);
			});
			for(i = 0; i < preferences.length ; i++){//catch preference
				if(preferences[i][0] == "periodicity"){
					periodicity = preferences[i][1].value;
				} else if (preferences[i][0] == "temps"){
					temps = preferences[i][1].value;
				} else if (preferences[i][0] == "populationCible"){
					populationCible = preferences[i][1].value;
				} else if (preferences[i][0] == "distance"){
					distance = preferences[i][1].value;
				}
			}

			markerCluster.clearMarkers();
			//apply preference on filter
			for(indexMarker = 0; indexMarker < evenementsData.length; indexMarker ++) {
				if(CheckEvenementService.checkEvenement(periodicity, temps, populationCible, distance, evenementsData[indexMarker],myPosition)){
					markers[indexMarker].setMap(map);
					markerCluster.addMarker(markers[indexMarker],true);

					if(returnValue == "none"){
						returnValue = indexMarker;
					}
				}
			}
			return returnValue;
		}
	}
});

angularApp.service('MathsService', function() {
	// Calculate distance (in km) between two points specified by latitude/longitude with Haversine formula source : http://www.developpez.net/forums/d272814/php/langage/fonctions/traduire-fonction-js-php-distance-km-entre-longitudes-latitudes/
	this.distanceBetweenUserAndParameters = function(p2lat, p2long, MyPosition) {
		if(MyPosition != null){
			var p1lat = MyPosition.coords.latitude;
			var p1long = MyPosition.coords.longitude;
		} else{ // Default Montreal value
			var p1lat = 45.501689;
			var p1long = -73.567256;
		}

		var R = 6371; // earth's mean radius in km
		var dLat  = p2lat - p1lat;
		var dLong = p2long - p1long;

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(p1lat) * Math.cos(p2lat) * Math.sin(dLong/2) * Math.sin(dLong/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		return d;
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

angularApp.controller("AppCtrl", function($scope, $ionicNavBarDelegate, $ionicHistory, UserService){
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
	
	if(typeof(google) !== 'undefined'){
		angularScope.disabled = false;
	} else {
		angularScope.disabled = true;
	}

	angularScope.goBack = function(){
		$ionicHistory.goBack();
	};

	angularScope.$on('$ionicView.beforeEnter', function() {
		if(typeof(google) !== 'undefined') {
			// Update user profil info
			angularScope.userNameFB = UserService.getUser().name;
			angularScope.userPictureFB= UserService.getUser().picture;

			angularScope.logged = userLogged;
		}
		//Close nav bar every time you enter the view
		if(window.matchMedia("(min-width: 768px)").matches)
		{
			$ionicNavBarDelegate.showBar(false);
		}
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

angularApp.controller("HomeCtrl", function($scope,$http, $ionicNavBarDelegate, BookMarkFactory, FilterMarkersService){
	var angularScope = $scope;
	var map = null;
	var markers = new Array(); 
	var myPosition = null;
	var markerCluster = null;

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
	var mcOptions = {gridSize: 100, maxZoom: 16, styles: styles};

	function setPosition(NewPosition){
		myPosition = NewPosition;
	}

	if(typeof(google) !== 'undefined') {
		angularScope.itemSelected = null;
		angularScope.itemInFavorite = false;
	}


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
		if(typeof(google) !== 'undefined') {
			$http.get('data.json')
		    .then(function(res){
		    	evenementsData = res.data;
		    	initialize();
		    });
		} else {
			//Here offline mode
			handleNavBarVisibility(window.matchMedia("(min-width: 768px)"));


		}
	}

	function initialize() {

		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(45.514887, -73.559727),
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			styles: [
			    {/*Style for remove Point Of Interest of google map*/
			      "featureType": "poi",
			      "elementType": "labels",
			      "stylers": [
			        { "visibility": "off" }
			      ]
			    }
		  	]
		};

		map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

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
			google.maps.event.addListener(markers[i], 'click', (function(evenementsData,i) {
			  	return function() {
			      // Display event informations
			      angularScope.$apply(function() {
			      	angularScope.itemSelected = evenementsData[i];

			      	angularScope.itemInFavorite = BookMarkFactory.exist(angularScope.itemSelected);
			      });
				}
			})(evenementsData,i));

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

	    markerCluster = new MarkerClusterer(map, markers, mcOptions);

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  	setPosition(position);
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

	function applyFilter(){
		if(markers.length == 0){
			return;
		}
		var valueOfFirstMarker = FilterMarkersService.filterMarkers(markers, markerCluster, map, myPosition);
		google.maps.event.trigger(map,'resize');
		if(valueOfFirstMarker != "none"){
			angularScope.itemSelected =  evenementsData[valueOfFirstMarker];
		}
	}
	if(typeof(google) !== "undefined"){
		google.maps.event.addDomListener(window, "load", loadData);
		/***	Reload itemInFavorite when view loading (fix bug on itemInFavorite value when going back to home) 	***/
		angularScope.$parent.$on("$ionicView.beforeEnter", function(event) {	// $ionicView.enter can only be catched by parent controller
			if ( angularScope.itemSelected != null ) {
				angularScope.itemInFavorite = BookMarkFactory.exist(angularScope.itemSelected);
			}
		});
	    angularScope.$parent.$on('$ionicView.afterEnter', function() {
			applyFilter();
			if(markerCluster != null){
				markerCluster.redraw();
			}
		});
	}
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
		angularScope.showLoginView = false;
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

angularApp.controller("FilterCtrl", function($scope, PreferencesService){
	var angularScope = $scope;


	angularScope.distance = [
	    { text: "rayon 1 km", value: "1" },
	    { text: "rayon 5 km", value: "5" },
	    { text: "rayon 10 km", value: "10" },
	    { text: "rayon 30 km", value: "30" },
	    { text: "rayon > 30 km", value: "++" },
	    { text: "Aucun", value: "none"}
	];

	angularScope.temps = [
	    { text: "< 1 heure", value: "1h00" },
	    { text: "< 3 heures", value: "3h00" },
	    { text: "< 1 jour", value: "1j00" },
	    { text: "> 1 jour", value: "++" },
	    { text: "Aucun", value: "none"}
	];

	angularScope.populationCible = [
		{ text: "Jeune", value: "jeune" },
	    { text: "Vieille", value: "vieille" },
	    { text: "Handicapée", value: "handicapee" },
	    { text: "Aucun", value: "none"}
	];

  	angularScope.periodicity = [
	    { text: "Jounalière", value: "journalieres" },
	    { text: "Quotidienne", value: "quotidienne" },
	    { text: "Mensuelle", value: "mensuelle" },
	    { text: "Aucun", value: "none"}
	];

    angularScope.data = {
	    distance: PreferencesService.getPreferences('distance'),
	    temps: PreferencesService.getPreferences('temps'),
	    populationCible: PreferencesService.getPreferences('populationCible'),
	    periodicity: PreferencesService.getPreferences('periodicity'),
 	};

	angularScope.changePreferences = function(category,item) {
		if (item.text == "None"){
			PreferencesService.delete(category);
		} else {
			PreferencesService.add(category,item);
		}
	};
});

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function($cordovaNetwork) {
		 var success = function(status) {
		 	console.log("Clear :" +status);
            alert('Message: ' + status);
        }

        var error = function(status) {
            alert('Error: ' + status);
        }

        window.cache.clear( success, error );
		// L'API Cordova est prête
		console.log("onDeviceReady");
		if(typeof(google) !== 'undefined') {
			//Here online mode
			$( '#wrapper_offline' ).css( "display", "none" );
		} else {
			//Here offline mode
			$( '#map_content' ).css( "display", "none" );
			$( '#description_event_wrapper' ).css( "display", "none" );
			$( '#description_event' ).css( "display", "none" );
	//		$( '#buttonTwo' ).setAttribute("ng-disabled", "true");
	//		$( '#buttonThree' ).setAttribute("ng-disabled", "true");
		}

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