var app = angular.module("Spotify",[]);
app.controller('homeController',function($scope,$http)
{
	$scope.playlists  = 
	[
	{"name": 'Made For You',"info" : []},
	{"name": 'Top Weekly',"info" : []}
	];
	console.log("fetching ....");
	console.log($scope.playlists[0]);
	$http.get("http://127.0.0.1:5000/api/v1/top5")
	.then(function(response){
		angular.forEach(response.data,function(value,key){
			$scope.playlists[1]["info"].push({'image':value['imageURL'],'name':value['track_name']});
		});
	});
	console.log($scope.playlists[0]);

});
