imdbFanta.controller('calendarioCtrl', function($scope, $http) {
	$scope.loading = true;

	$http.get('service/calendarioService.php').success(function(data) {
		$scope.loading = false;
		$scope.calendario = data;
	});

	
});