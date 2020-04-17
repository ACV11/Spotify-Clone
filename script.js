var app = angular.module("Spotify",["ngRoute"]);

app.value('recommendation_song', {});

app.config(function($routeProvider){
	$routeProvider.when("/",
	{
		templateUrl : "./views/home.htm"
	})
	.when("/rec",{
		templateUrl : "./views/rec.htm",
		controller : "RecController"
	})
	.when("/printRec",{
		templateUrl : "./views/printRec.htm",
		controller : "PRController"
	})
	.when("/search",{
		templateUrl : "./views/search.htm",
		controller : "InstantSearchController"
	});
	

})

app.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});


app.controller('homeController',function($scope,$rootScope,$http)
{
	$rootScope.playThisSong = function($i){
		console.log("rootScope")
		console.log($i);
		$rootScope.song_to_play = $i['name'];
		$rootScope.artist_to_play = $i['artist'];
		$rootScope.embed_to_play = $i['embed'];
		$rootScope.image_to_play = $i['image'];
	};
	$rootScope.playlists  = 
	[
	{"name": 'Made For You',"info" : []},
	{"name": 'Top Weekly',"info" : []}
	];
	console.log("fetching ....");
	console.log($rootScope.playlists[0]);
	$rootScope.Username = "Zenkar";
	$http.get("http://127.0.0.1:5000/api/v1/top5")
	.then(function(response){
		angular.forEach(response.data,function(value,key){
			$x = value['name'];
			if($x.length > 15)
				$x = $x.slice(0,12)+'...';
			$rootScope.playlists[1]["info"].push({'image':value['image'],'name': $x,'embed':value['embed'],'artist':value['artist']});
		});
	});

	$http.get("http://127.0.0.1:5000/api/v1/top55")
	.then(function(response){
		$i = 1;
		angular.forEach(response.data,function(value,key){
			$artist = value["artist"];
			$np = {"name":"Best of " + $artist,"info":[]};
			$i=$i+1;
			angular.forEach(value["songs"],function(val,k){
				$x = val[0];
				if($x.length > 15)
					$x = $x.slice(0,12)+'...';
				$np["info"].push({'image':val[1],'name':$x,'embed':val[2], 'artist':$artist},);
			});
			$rootScope.playlists.push($np);

		});
	});
});

app.filter('searchFor', function(){return function(arr, searchString){

	if(!searchString){
		return [];
	}

	var result = [];

	searchString = searchString.toLowerCase();
	console.log("here");

		// Using the forEach helper method to loop through the array
		angular.forEach(arr, function(item){
			if(item.name.toLowerCase().indexOf(searchString) !== -1 || item.artist.toLowerCase().indexOf(searchString) !== -1){
				if(result.length < 15)
					result.push(item);
				
			}

		});
		console.log(result.length);
		return result;
	};

});

app.filter('searchFors', function(){return function(arr, searchSong){

	if(!searchSong){
		return [];
	}

	var result = [];

	searchSong = searchSong.toLowerCase();
	console.log("here");

		// Using the forEach helper method to loop through the array
		angular.forEach(arr, function(item){
			if(item.name.toLowerCase().indexOf(searchSong) !== -1 || item.artist.toLowerCase().indexOf(searchSong) !== -1){
				if(result.length < 15)
					result.push(item);
				
			}

		});
		console.log(result.length);
		return result;
	};

});

app.controller('InstantSearchController',function($scope,$rootScope,$http){
	
		$url = "http://127.0.0.1:5000/api/v1/searchsongall";
	$http.get($url).then(function(response){$scope.items=response.data;});
	/*$scope.update = function()
	{
		console.log($scope.searchString);
		$scope.items = [];
		if($scope.searchString.length > 1)
		{
			
				angular.forEach($data,function(value,key){
					if(value['name'].toLowerCase().indexOf($scope.searchString.toLowerCase()!=-1) || value['artist'].toLowerCase().indexOf($scope.searchString.toLowerCase()!=-1))
					$scope.items.push(value);
					if($scope.items.length > 15)
						return;
				}

				);

		}
	};*/
});

app.controller('RecController',function($scope,$rootScope,$http){
	$rootScope.resc = [];
	$rootScope.bool = false;
	$rootScope.printRecommendation = function($i){
		$scope.searchSong = '';
		$rootScope.resc = {'name' : $i['name'],'info':[]};
	
		console.log("recommending");
		$http.get("http://127.0.0.1:5000/api/v1/getRec/"+$i['embed']).then(function(response){
			console.log(response.data);
		$rootScope.playlists.push( {'name':$rootScope.sss,'info': response.data });})
		console.log($rootScope.playlists);
	};


		$url = "http://127.0.0.1:5000/api/v1/searchsongall";
	$http.get($url).then(function(response){$scope.items=response.data;});
	/*$scope.update = function()
	{
		console.log($scope.searchString);
		$scope.items = [];
		if($scope.searchString.length > 1)
		{
			
				angular.forEach($data,function(value,key){
					if(value['name'].toLowerCase().indexOf($scope.searchString.toLowerCase()!=-1) || value['artist'].toLowerCase().indexOf($scope.searchString.toLowerCase()!=-1))
					$scope.items.push(value);
					if($scope.items.length > 15)
						return;
				}

				);

		}
	};*/
});

app.controller('PRController',function($scope,$rootScope,$http){
	$scope.resc = [];
	console.log("embed is "+ $rootScope.recommendation_song['embed'])
	$http.get("http://127.0.0.1:5000/api/v1/getRec/"+$rootScope.recommendation_song['embed'])
	.then(function(response){
		angular.forEach(response.data,function(value,key){
			$x = value['name'];
			if($x.length > 15)
				value['name'] = $x.slice(0,12)+'...';
			$scope.resc.push({'name':$rootScope.recommendation_song['name'], 'info' : value});
		});});
});

