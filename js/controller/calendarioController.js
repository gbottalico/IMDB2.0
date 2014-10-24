imdbFanta.controller('calendarioCtrl', function($scope, $http, scrollPageTo) {
	$scope.loading = true;
	$scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
	
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
		$scope.chiudiDettaglio();
		$scope.loadingGiornata = true;
		$scope.infoGiornata = $scope.calendario.filter(function(row) {
			if (row.idGiornata == idComp && row.competizione == $scope.competizioneSelected) {
				return true
			} else {
				return false;
			}
		});
	}
	
	$scope.caricaDettaglio = function(idPartita, idGiornata, giocata, idCasa, idFuori, event){
		$scope.chiudiDettaglio();
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
			
			$('.riepilogoContainer').css('position','absolute');
			$('.riepilogoContainer').css('top',$('#'+idPartita).height()+$('#'+idPartita).offset().top);
			$('.riepilogoContainer').css('width',$('#elencoGiornate').width());
			$('.riepilogoContainer').css('display','block');
			scrollPageTo('#' + idPartita);
		});
	}
	
	$scope.chiudiDettaglio = function(){
		$('.riepilogoContainer').css('display','none');
	}
	
	$scope.getDescrizioneRuolo = function(idRuolo) {
		return $scope.ruolo[idRuolo-1];
	}

	$scope.getAbbreviazioneRuolo = function(idRuolo) {
		return $scope.ruolo[idRuolo-1].substring(0,1);
	}
});