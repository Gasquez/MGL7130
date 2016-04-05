angular.module('starter', ['ionic', 'ngCordova']);
var angularApp = angular.module('MenuNav', ['ionic']);

var App = angular.module('App', []);
var evenementsData = new Array();
var map;
var markers = new Array(); 
var MyPosition = null;

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
	this.chekDistance = function(distance, evenement){
		if(distance != "none"){
			var distanceUserAndParameters = MathsService.distanceBetweenUserAndParameters(evenement.latitude,evenement.longitude,MyPosition);
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
	this.filterMarkers = function(){
		var preferences = PreferencesService.all();
		var periodicity = "none";
		var temps = "none";
		var populationCible = "none";
		var distance = "none";
		var returnValue = "none";
		
		if(preferences == null || preferences.toString() == ""){
			//set visiblity for each markers
			markers.forEach(function(element, index, array) {
			    markers[index].setMap(map);
			});
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
			//apply preference on filter
			for(indexMarker = 0; indexMarker < evenementsData.length; indexMarker ++) {
				if(CheckEvenementService.checkEvenement(periodicity, temps, populationCible, distance, evenementsData[indexMarker],MyPosition)){
					markers[indexMarker].setMap(map);
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
			//TODO A retirer
			//var p1lat = MyPosition.coords.latitude;
			//var p1long = MyPosition.coords.longitude;
			var p1lat = 45.501689;
			var p1long = -73.567256;
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
				"latitude": "45.514887",
				"longitude": "-73.559727",
				"organisme": "UdeM",
				"siege": "adresse du siege",
				"emplacement": ["UQAM", "2100 St-Urb"],
				"jours": ["mardi"],
				"date": ["20-02"],
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
				"latitude": "45.503452",
				"longitude": "-73.621021",
				"organisme": "UdeM",
				"siege": "adresse du siege",
				"emplacement": ["UQAM", "2100 St-Urb"],
				"jours": ["lundi"],
				"date": ["19-02"],
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
			},	
			{
				"titre": "Old help cause for student",
				"id": 100006,
				"cibles": ["jeune"],
				"latitude": "45.490764",
				"longitude": "-73.581272",
				"organisme": "CLSC Lasalle",
				"siege": "adresse du siege",
				"emplacement": "at the place",
				"jours": ["vendredi"],
				"date": ["23-02"],
				"heureDeFin": "18h00",
				"heureDeDebut":"20h00",
				"duree":"2h00",
				"dateDeBut":"12368522587",
				"dateDeFin":"123685146545",
				"langues": ["french","english"],
				"causes": ["Old Help"],
				"activities": ["aide","accueil"],
				"avantages": ["contact avec les gens","plaisir de sortir"],
				"periodicity": "bi-hebdomadaire",
				"contacts": {
					"tel":"123456789",
					"mail":"contact@clsc.ca",
					"site":"clsc.ca"
				},
				"handicape":true,
				"access": ["Metro Atwarer","bus numero 46"],
				"descriptifShort":"Un evenement pour aider les personnes handicapées à faire les papiers ainsi que leurs courses",
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

angularApp.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'home.html',
		controller: 'HomeCtrl'
	})

	.state('filter', {
		url: '/filter',
		templateUrl: 'filter.html',
		controller: 'AppCtrl'
	})

	.state('homeEvent', {
		url: '/homeEventlter',
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
	//Close nav bar every time you load the view
	angularScope.$on('$ionicView.beforeEnter', function() {
		if(window.matchMedia("(min-width: 768px)").matches)
		{
			$ionicNavBarDelegate.showBar(false);
		}
	});
});

angularApp.controller("HomeCtrl", function($scope,$http, $ionicNavBarDelegate,FilterMarkersService){
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

	function setPosition(NewPosition){
		MyPosition = NewPosition;
	}

	function loadData(){
		$http.get('data.json')
	    .then(function(res){
	    	evenementsData = res.data;
	    	initialize();
	    });
	}

	function initialize() {
		if(markers.length !=0){//This test is for escape if it's not the first time you go in initialize methode
			return;
		}
		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(45.514887, -73.559727),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};

		map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		angularScope.itemSelected = evenementsData[0];
		// Loop through the array of evenements and place each one on the map 
		for(i = 0; i < evenementsData.length; i += 1) {

			//Loading information events from bdd
			var itemSelected = evenementsData[i];

			var lab = itemSelected.date[0];

			var marker = new MarkerWithLabel({
				position: new google.maps.LatLng(itemSelected.latitude,itemSelected.longitude),
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
			    },					
			});
			markers.push(marker);
			// Add click action on each marcker
			google.maps.event.addListener(markers[i], 'click', (function(evenementsData,i) {
			  	return function() {
			      // Display event informations
			      angularScope.$apply(function() {
			      	angularScope.itemSelected = evenementsData[i];
			      });
				}
			})(evenementsData,i));
		}

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  	setPosition(position);
		  }, null, {enableHighAccuracy:true});
		WidthChange(window.matchMedia("(min-width: 768px)"));
		FilterMarkersService.filterMarkers();
	};

	// media query event handler
	if (matchMedia) {
	  var mq = window.matchMedia("(min-width: 768px)");
	  mq.addListener(WidthChange);
	  WidthChange(mq);
	}

	// change in fonction of width
	function WidthChange(mq) {

	  if (mq.matches) {
	  	// if screen >= 768px, hidde nav bar
	  	 $ionicNavBarDelegate.showBar(false);
	  } else {
	  	// if screen < 768px, show nav bar
	  	$ionicNavBarDelegate.showBar(true);
	  }

	};
	google.maps.event.addDomListener(window, "load", loadData);
	//Close nav bar every time you load the view
	angularScope.$on('$ionicView.beforeEnter', function(map) {
		if(window.matchMedia("(min-width: 768px)").matches)
		{
			$ionicNavBarDelegate.showBar(false);
		}
	});
	angularScope.$on('$ionicView.afterEnter', function(map) {
		var valueOfFirstMarker = FilterMarkersService.filterMarkers();
		google.maps.event.trigger(map,'resize');
		if(valueOfFirstMarker != "none"){
			angularScope.itemSelected =  evenementsData[valueOfFirstMarker];
			angularScope.$apply();
		}
	});

});

angularApp.controller("HomeEventCtrl", function($scope){
	angularScope.itemSelected = evenementsData[1];
});

angularApp.controller("FavoriteCtrl", function($scope, BookMarkFactory){
	var angularScope = $scope;
	
	angularScope.items = BookMarkFactory.all();
	angularScope.itemSelected = null;

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

angularApp.controller("ListCtrl", function($scope){
	var angularScope = $scope;
	
	angularScope.items = evenementsData;
	angularScope.itemSelected = evenementsData[0];

	angularScope.masterToDetailMode = function($index) {
		$('#viewList').addClass('mode-detail');

		var childNumber = $index + 1; //In angular, $index starts at 0 but starts at 1 with :nth-child 
		$(".master-item-list:nth-child(" + childNumber + ")").addClass('master-item-list-selected').siblings().removeClass('master-item-list-selected');
	
		angularScope.itemSelected = evenementsData[$index];
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
	    { text: "None", value: "none"}
	];

	angularScope.temps = [
	    { text: "< 1 heure", value: "1h00" },
	    { text: "< 3 heures", value: "3h00" },
	    { text: "< 1 jour", value: "1j00" },
	    { text: ">= 1 jour", value: "++" },
	    { text: "None", value: "none"}
	];

	angularScope.populationCible = [
		{ text: "Jeune", value: "jeune" },
	    { text: "Vielle", value: "vielle" },
	    { text: "Handicapee", value: "handicapee" },
	    { text: "None", value: "none"}
	];

  	angularScope.periodicity = [
	    { text: "Jounaliere", value: "journalieres" },
	    { text: "Quotidienne", value: "quotidienne" },
	    { text: "Mensuelle", value: "mensuelle" },
	    { text: "None", value: "none"}
	];

    angularScope.data = {
	    distance: PreferencesService.getPreferences('distance'),
	    temps: PreferencesService.getPreferences('temps'),
	    populationCible: PreferencesService.getPreferences('populationCible'),
	    periodicity: PreferencesService.getPreferences('periodicity')
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
	onDeviceReady: function($http) {
		// L'API Cordova est prête
	}
};
app.initialize();