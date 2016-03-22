angular.module('starter', ['ionic', 'ngCordova']);
var angularApp = angular.module('MenuNav', ['ionic']);

var App = angular.module('App', []);
var evenementsData = new Array();

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
		controller: 'AppCtrl'
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
		    { text: "Handicapee", value: "hdicap" }
		];

	  	$scope.periodicity = [
		    { text: "Jounaliere", value: "jour" },
		    { text: "Quotidienne", value: "quot" },
		    { text: "Mensuelle", value: "mens" }
		];

		$scope.lieu = [
		    { text: "Postal code", value: "pcode" },
		    { text: "City", value: "city" },
		    { text: "State", value: "state" },
		    { text: "Pays", value: "pays" }
		];

	    $scope.data = {
	    distance: '5km'
	    };
	 		  
		$scope.serverSideChange = function(item) {
			console.log("Selected Serverside, text:", item.text, "value:", item.value);
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

angularApp.controller("HomeCtrl", function($scope,$http, $ionicNavBarDelegate){
	var angularScope = $scope;
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
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};

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
			      });
				}
			})(itemSelected));
		}

		if (navigator.geolocation)
		  var watchId = navigator.geolocation.watchPosition(function(position){
		  	//Move map to position
		  	map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  }, null, {enableHighAccuracy:true});
		WidthChange(window.matchMedia("(min-width: 768px)"));

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