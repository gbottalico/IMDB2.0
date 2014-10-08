imdbFanta.controller('calendarioCtrl', function($scope, $http) {
	$scope.loading = true;
	
	$scope.caricaCompetizione =  function(competizione){
		$scope.competizioneSelected = competizione;
		$http.get('service/calendarioService.php').success(function(data) {
			$scope.loading = false;
			$scope.calendario = data.filter(function(row) {
				if (row.idCompetizione == competizione) {
					return true
				} else {
					return false;
				}
			});
			
			
		});
	}
	
	$scope.visualizzaGiornata = function() {
		$scope.loadingGiornata = true;
		$scope.infoGiornata = $scope.calendario.filter(function(row) {
			if (row.idGiornata == $scope.giornataSelected && row.idCompetizione == $scope.competizioneSelected) {
				return true
			} else {
				return false;
			}
		});
	}
	
});