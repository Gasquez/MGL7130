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

angularApp.service('FavoriteService', function() {
	var myObj = this;

	this.allBookMark = function() { return allItems(true); }
	this.allEventJoined = function() { return allItems(false); }

	this.addBookMark = function(bookMark) { addItem(bookMark, true); }
	this.addEventJoined = function(bookMark) { addItem(bookMark, false); }

	this.deleteBookMark = function(bookMark) { deleteItem(bookMark, true); }
	this.deleteEventJoined = function(bookMark) { deleteItem(bookMark, false);  }

	this.existBookMark = function(bookMark) { return existItem(bookMark, true); }	//bookMark is a JavaScript object
	this.existEventJoined = function(bookMark) { return existItem(bookMark, false); }	//bookMark is a JavaScript object

	function getBookMarkStored() { return window.localStorage['BookMark']; }
	function setBookMarkStored(jsonObject) { window.localStorage['BookMark'] = jsonObject; }
	function getEventJoinedStored() { return window.localStorage['EventJoined']; }
	function setEventJoinedStored(jsonObject) { window.localStorage['EventJoined'] = jsonObject; }

	// isBookMark : true for bookmark (heart), false pour eventJoined

	function allItems(isBookMark) {
		var favoriteString = (isBookMark) ? getBookMarkStored() : getEventJoinedStored(); 

		if( favoriteString != null && favoriteString != "" && favoriteString != "undefined" ) {	
			return angular.fromJson(favoriteString);
		}
		return new Array();
	};

	function addItem(bookMark, isBookMark) { //bookMark is a JavaScript object
		var favoriteArray = (isBookMark) ? myObj.allBookMark() : myObj.allEventJoined();

		favoriteArray.push(bookMark);
		if (isBookMark) setBookMarkStored(angular.toJson(favoriteArray)); 
			else setEventJoinedStored(angular.toJson(favoriteArray));
	};

	function deleteItem(bookMark, isBookMark) {
		var favoriteArray = (isBookMark) ? myObj.allBookMark() : myObj.allEventJoined();

		// Look for element's index and remove element from array
		favoriteArray.forEach( function(element, index, array) {
			
			if ( angular.toJson(bookMark) == angular.toJson(element) ) {
				favoriteArray.splice(index, 1);


				if (isBookMark) setBookMarkStored(angular.toJson(favoriteArray)); 
					else setEventJoinedStored(angular.toJson(favoriteArray));
				return;
			}

		});
	};

	function existItem(bookMark, isBookMark) {	//bookMark is a JavaScript object
		if (bookMark == null || bookMark == "undefined") {
			return false;
		}

		var favoriteArray = (isBookMark) ? myObj.allBookMark() : myObj.allEventJoined();
		var exist = false;
		if (favoriteArray == null || favoriteArray == "undefined") {
			return false;
		}

		favoriteArray.forEach( function(element, index, array) {
			
			if ( angular.toJson(bookMark) == angular.toJson(element) ) {
				exist = true;
				return;
			}

		});

		return exist;
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

angularApp.service('UserService', function() {
	var profilStored = null;

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
});

angularApp.controller("AppCtrl", function($scope, $ionicHistory, UserService){
	var angularScope = $scope;
	angularScope.userNameFB = UserService.getUser().name;
	angularScope.userPictureFB= UserService.getUser().picture;

	angularScope.logged = userLogged;

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
	});

	angularScope.logOut = function() {
		facebookConnectPlugin.logout(function() {

			userLogged = false;
			angularScope.$apply(function() {
				angularScope.logged = userLogged;
			});

		}, function(msg){
			console.log(msg);
		});
	};
});

angularApp.controller("HomeCtrl", function($scope,$http, $ionicNavBarDelegate, FavoriteService, FilterMarkersService){
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
		angularScope.itemInBookMark = false;
		angularScope.itemInEventJoined = false;
	}

	angularScope.changeBookMarkStatus = function(eventObj) {
		if ( angularScope.itemInBookMark == false ) {
			FavoriteService.addBookMark(eventObj);
			angularScope.itemInBookMark = true;
		} else {
			FavoriteService.deleteBookMark(eventObj);

			angularScope.itemInBookMark = false;
		}
	};

	//Read data from dynamodb
	function loadDataFromServer() {
		if (typeof(AWS) === 'undefined') {
			return;
		}
		
        var db = new AWS.DynamoDB.DocumentClient({dynamoDbCrc32: false});
		var items = [];
        db.scan({
            TableName: 'evenements'
        }, function(err, data) {
        	if (err) {
		        console.log(JSON.stringify(err, null, 2));
		    } else {
	            for (var i = 0; i < data.Items.length; i++) {
	                var item = data.Items[i];
	                items.push(item);
	            }
		        evenementsData = items;
		        initialize();
	        }
        });
    };

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

		// Function for getting new default icon
	    function getDefaultIcon () {
	        return {
            	path: google.maps.SymbolPath.CIRCLE,
		        scale: 16,
		        fillColor: "#FF0000",
		        fillOpacity: 1,
		        strokeWeight: 0.8
		    }
	    }

	    // Function for getting new highlight icon on click
	    function getClickHighlightIcon () {
	        return {
            	path: google.maps.SymbolPath.CIRCLE,
		        scale: 16,
		        fillColor: "#00FFFF",
		        fillOpacity: 1,
		        strokeWeight: 0.8
		    }
	    }

	    // Function for getting new highlight icon on mouseover
	    function getHoverHighlightIcon () {
	        return {
            	path: google.maps.SymbolPath.CIRCLE,
		        scale: 16,
		        fillColor: "#00FF00",
		        fillOpacity: 1,
		        strokeWeight: 0.8
		    }
	    }

	    // Function for getting new default labelClass
	    function getDefaultLabelClass () {
	    	marker.set('labelClass', 'labels');			
	    }

		// Loop through the array of evenements and place each one on the map 
		for(i = 0; i < evenementsData.length; i += 1) {

			//Loading information events from bdd
			var itemSelected = evenementsData[i];
			var lab = itemSelected.dateAffichage[0]+itemSelected.dateAffichage[1]+itemSelected.dateAffichage[2]+itemSelected.dateAffichage[3]+itemSelected.dateAffichage[4];
			var Lat = itemSelected.latitude;
			var Lgn = itemSelected.longitude;

			var marker = new MarkerWithLabel({
				position: new google.maps.LatLng(Lat,Lgn),
				map: map,
				labelContent: lab,
				labelAnchor: new google.maps.Point(13, 10),
			    labelClass: "lalels", // the CSS class for the label
			    labelInBackground: false,
			    labelVisible: true,
			    isClicked: false,
				icon: getDefaultIcon()				
			});
			getDefaultLabelClass();

			// Add click action on each marcker, change color marker on click
			google.maps.event.addListener(marker, 'click', (function(itemSelected, marker, i) {
			  	return function() {
			        // Display event informations
			        angularScope.$apply(function() {
						angularScope.itemSelected = itemSelected;
						angularScope.itemInBookMark = FavoriteService.existBookMark(itemSelected);
						angularScope.itemInEventJoined = FavoriteService.existEventJoined(itemSelected);
			        });

			        //reset default icon
			        for (var j = 0; j < markers.length; j++) {
			          markers[j].setIcon(getDefaultIcon ());
			          markers[j].set('labelClass','labels');
			      	  markers[j].isClicked = false;
			        }

			        //get highlighticon
			        marker.isClicked = true;
	                marker.setIcon(getClickHighlightIcon ());
	                marker.set('labelClass', 'labels active');
				}
			})(itemSelected, marker, i));

			// deselect marker color
		    google.maps.event.addListener(marker, 'dblclick', function(e) {
		        this.set('labelClass', 'labels');
		        this.setIcon(getDefaultIcon ());
		        this.isClicked = false;
		    });

		    // change color marker on mouseover
		    google.maps.event.addListener(marker, 'mouseover', (function(marker,i) {
		    	return function() {
		        	if (this.isClicked){
		        	    //reset default labelclass
	                    marker.set('labelClass', 'labels active');
	                    marker.setIcon(getClickHighlightIcon ());
		            } else {
		                marker.set('labelClass', 'labels hover');
		                marker.setIcon(getHoverHighlightIcon ());
		            }
		        }   
		    })(marker,i));

		    //change or reset color marker on mouseout
		    google.maps.event.addListener(marker, 'mouseout', (function(marker,i) {
		        return function() {
		        	if (this.isClicked){
		        	    //reset default labelclass
			            for (var k = 0; k < markers.length; k++) {
			                markers[k].set('labelClass', 'labels');
			      	        markers[k].setIcon(getDefaultIcon ());
			            }
			            //get highlightlabelclass
	                    marker.set('labelClass', 'labels active');
	                    marker.setIcon(getClickHighlightIcon ());
		            } else {
		                marker.set('labelClass', 'labels');
		                marker.setIcon(getDefaultIcon ());
		            }
		        }   
		    })(marker,i));

		    markers.push(marker);
		}

	    markerCluster = new MarkerClusterer(map, markers, mcOptions);

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  	setPosition(position);
		  }, null, {enableHighAccuracy:true});

		angularScope.$apply(function() {
			angularScope.itemSelected = evenementsData[0];
		});
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
		google.maps.event.addDomListener(window, "load", loadDataFromServer);

		/***	Reload itemInFavorite when view loading (fix bug on itemInFavorite value when going back to home) 	***/
		angularScope.$parent.$on("$ionicView.beforeEnter", function(event) {	// $ionicView.enter can only be catched by parent controller
			if ( angularScope.itemSelected != null ) {
				angularScope.itemInBookMark = FavoriteService.existBookMark(angularScope.itemSelected);
				angularScope.itemInEventJoined = FavoriteService.existEventJoined(angularScope.itemSelected);			}
		});
	    angularScope.$parent.$on('$ionicView.afterEnter', function() {
			applyFilter();
			if(markerCluster != null){
				markerCluster.redraw();
			}
		});
	}
});

angularApp.controller("HomeEventCtrl", function($scope, $state, $stateParams, $ionicHistory, FavoriteService){
	var angularScope = $scope;
	var eventId = $stateParams.eventId;

	if ( $stateParams.hasOwnProperty("eventId") && eventId.trim() != "" ) {

		evenementsData.forEach( function(element, index, array) {

			if ( element.hasOwnProperty("id") && element.id == eventId ) {
				angularScope.itemSelected = array[index];
				angularScope.itemInBookMark = FavoriteService.existBookMark(angularScope.itemSelected);
				angularScope.itemInEventJoined = FavoriteService.existEventJoined(angularScope.itemSelected);
				return;
			}

		});
	} else {
		console.log("Error: no eventId parameter!");
	}

	angularScope.changeBookMarkStatus = function(eventObj) {
		if ( angularScope.itemInBookMark == false ) {
			FavoriteService.addBookMark(eventObj);

			angularScope.itemInBookMark = true;
		} else {
			FavoriteService.deleteBookMark(eventObj);

			angularScope.itemInBookMark = false;
		}
	};
});

angularApp.controller("detailEventCtrl", function($scope, UserService, FavoriteService) {
	var angularScope = $scope;
	angularScope.showLoginView = false;
	angularScope.participationPending = false;

	angularScope.participateToEvent = function() {
		// if not logged
		if (userLogged == false) {
			angularScope.showLoginView = true;
			angularScope.participationPending = true;
		} else {
			joiningEvent(false);
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

				angularScope.$apply(function() {
					angularScope.$parent.$parent.$parent.userNameFB = UserService.getUser().name;
					angularScope.$parent.$parent.$parent.userPictureFB= UserService.getUser().picture;
				});

			}, function(msg){		
				console.log(msg);
			});
		}, function(msg){		
			console.log(msg);
		});

		if (angularScope.participationPending == true) {
			joiningEvent(true);
		}

		angularScope.$apply(function() {
			angularScope.showLoginView = false;
			angularScope.$parent.$parent.$parent.logged = true;
		});
	}

	function joiningEvent(isAsynchronous) {	//isAsynchronous notice if the function is a callback or not, usefull for using $apply or not (error if using in a non-asynchronous mode).
		// If event already joined, abort
		if ( FavoriteService.existEventJoined(angularScope.itemSelected) ) {
			return;
		} 

		FavoriteService.addEventJoined(angularScope.itemSelected);

		if (isAsynchronous) {
			angularScope.$apply(function() {
				angularScope.$parent.$parent.itemInEventJoined = true;
			});
		} else {
			angularScope.$parent.$parent.itemInEventJoined = true;
		}
	}
});

angularApp.controller("FavoriteCtrl", function($scope, $window, $state, FavoriteService){
	var angularScope = $scope;
	angularScope.itemsBookMark = FavoriteService.allBookMark();
	angularScope.itemsEventJoined = FavoriteService.allEventJoined();
	angularScope.itemSelected = null;

	angularScope.changeBookMarkStatus = function(eventObj) {
		// In this controller, items always are in favorite
		if ( angularScope.itemInBookMark == false ) {
			// Nothing to do, cannot add event to favorite from here
		} else {
			FavoriteService.deleteBookMark(eventObj);

			if (navigator.notification) {
				navigator.notification.alert( "Favoris supprimé.", null, '', 'Ok' );
			}
			else {
				alert( "Favoris supprimé." );
			}
			
			// Switch to next favorite if exists, otherwise refresh page
			var favoriteList = FavoriteService.allBookMark();

			if ( favoriteList.length != 0 ) {
				angularScope.itemSelected = favoriteList[0];
			} else {
				$state.go("home");
			}
		}
	};

	angularScope.masterToDetailMode = function(isBookMark, $index) {
		$('#view').addClass('mode-detail');

		var childNumber = $index + 1; //In angular, $index starts at 0 but starts at 1 with :nth-child 
		$(".master-item-favorite:nth-child(" + childNumber + ")").addClass('master-item-favorite-selected').siblings().removeClass('master-item-favorite-selected');
	
		angularScope.itemSelected = (isBookMark) ? FavoriteService.allBookMark()[$index] : FavoriteService.allEventJoined()[$index];

		angularScope.itemInBookMark = FavoriteService.existBookMark(angularScope.itemSelected); 
		angularScope.itemInEventJoined = FavoriteService.existEventJoined(angularScope.itemSelected); 
	};

	angularScope.detailModeToMaster = function() {
		$('#view').removeClass('mode-detail');
	};

	/* For test : open automaticaly first event (we know it exists because data.json is hard-coded)*/
	if(window.matchMedia("(min-width: 768px)").matches)
	{
		angularScope.masterToDetailMode(true, 0);
	}
});

angularApp.controller("ListCtrl", function($scope, FavoriteService){
	var angularScope = $scope;
	angularScope.items = evenementsData;
	angularScope.itemSelected = evenementsData[0];
	angularScope.itemInBookMark = false;
	angularScope.itemInEventJoined = false;

	angularScope.changeBookMarkStatus = function(eventObj) {
		if ( angularScope.itemInBookMark == false ) {
			FavoriteService.addBookMark(eventObj);

			angularScope.itemInBookMark = true;
		} else {
			FavoriteService.deleteBookMark(eventObj);

			angularScope.itemInBookMark = false;
		}
	};

	angularScope.masterToDetailMode = function($index) {
		angularScope.itemInBookMark = false;

		$('#viewList').addClass('mode-detail');

		var childNumber = $index + 1; //In angular, $index starts at 0 but starts at 1 with :nth-child 
		$(".master-item-list:nth-child(" + childNumber + ")").addClass('master-item-list-selected').siblings().removeClass('master-item-list-selected');
	
		angularScope.itemSelected = evenementsData[$index];
		angularScope.itemInEventJoined = FavoriteService.existEventJoined(angularScope.itemSelected);

		// Check if the new event selected is already inside favorite list
		if ( FavoriteService.existBookMark(angularScope.itemSelected) ) {
			angularScope.itemInBookMark = true;
		} else {
			angularScope.itemInBookMark = false;
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
	onDeviceReady: function() {
		// L'API Cordova est prête
		console.log("onDeviceReady");

		var success = function(status) {
            console.log('Message: ' + status);
        }

        var error = function(status) {
            console.log('Error: ' + status);
        }

        window.cache.clear( success, error );

		if(typeof(google) !== 'undefined') {
			//Here online mode
			$( '#wrapper_offline' ).css( "display", "none" );
		} else {
			//Here offline mode
			$( '#map_content' ).css( "display", "none" );
			$( '#description_event_wrapper' ).css( "display", "none" );
			$( '#description_event' ).css( "display", "none" );
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