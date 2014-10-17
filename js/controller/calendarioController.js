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
		$scope.infoGiornata = new Object();
		$('.menuItem').removeClass('selected');
		$scope.competizioneSelected = competizione;
		$scope.calendarioComp = $scope.calendario.filter(function(row) {
			if (row.competizione == $scope.competizioneSelected) {
				return true
			} else {
				return false;
			}
		});
		$('#'+competizione).addClass('selected');
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
	
	$scope.caricaDettaglio = function(idPartita, idGiornata, giocata, idCasa, idFuori){
		$http.get('service/tabellinoService.php?partita='+idPartita+'&giornata='+idGiornata+'&giocata='+giocata).success(function(data) {
			$scope.loading = false;
			$scope.infoPartita = $scope.infoGiornata.filter(function(row) {
				if (row.idPartita == idPartita) {
					return true
				} else {
					return false;
				}
			});
			$scope.infoPartita = $scope.infoPartita[0];
			$scope.tabellino = data;
			$scope.squadraCasa = $scope.tabellino.filter(function(row) {
				if (row.squadra == idCasa) {
					return true
				} else {
					return false;
				}
			});
			$scope.squadraFuori = $scope.tabellino.filter(function(row) {
				if (row.squadra == idFuori) {
					return true
				} else {
					return false;
				}
			});
		});
	}
	
});