imdbFanta.controller('calendarioCtrl', function($scope, $http) {
	$scope.loading = true;
	
	$scope.initCompetizione =  function(){
		$http.get('service/calendarioService.php').success(function(data) {
			$scope.loading = false;
			$scope.calendario = data;
			$scope.competizioneSelected = $scope.calendario[0].competizione;
			$scope.calendarioComp = $scope.calendario.filter(function(row) {
				if (row.competizione == $scope.competizioneSelected) {
					return true
				} else {
					return false;
				}
			});			
		});
	}
	
	$scope.caricaCompetizione =  function(competizione){
		
		$scope.competizioneSelected = competizione;
		$scope.calendarioComp = $scope.calendario.filter(function(row) {
			if (row.competizione == $scope.competizioneSelected) {
				return true
			} else {
				return false;
			}
		});
	}
	
	$scope.visualizzaGiornata = function(idComp) {
		$scope.loadingGiornata = true;
		$scope.infoGiornata = $scope.calendario.filter(function(row) {
			if (row.idGiornata == idComp && row.competizione == $scope.competizioneSelected) {
				return true
			} else {
				return false;
			}
		});
	}
	
});