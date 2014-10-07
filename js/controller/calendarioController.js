imdbFanta.controller('calendarioCtrl', function($scope, $http) {
	$scope.loading = true;

	$http.get('service/calendarioService.php').success(function(data) {
		$scope.loading = false;
		$scope.calendario = data;
	});

	$scope.visualizzaGiornata = function() {
		$scope.loadingGiornata = true;
		$scope.infoGiornata = $scope.calendario.filter(function(row) {
			if (row.idGiornata == $scope.giornataSelected) {
				return true
			} else {
				return false;
			}
		});
	}
	
});