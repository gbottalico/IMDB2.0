imdbFanta.controller('classificaCtrl', function ($scope, $http) {
	$scope.loading = true;
	
	$http.get('service/classificaService.php').success(function(data) {
		$scope.loading = false;
	    $scope.squadre = data;
	  });
});