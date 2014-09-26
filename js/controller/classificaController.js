imdbFanta.controller('classificaCtrl', function ($scope, $http) {
	$http.get('service/classificaService.php').success(function(data) {
	    $scope.squadre = data;
	  });
});