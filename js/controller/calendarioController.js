imdbFanta.controller('calendarioCtrl', function($scope, $http, scrollPageTo, $timeout, $filter) {
	$scope.loading = true;
	$scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];	

	$scope.initCompetizione =  function(){
		$http.get('service/calendarioService.php').success(function(data) {
			$scope.loading = false;
			$scope.calendario = data;
			$scope.competizioneSelected = $scope.calendario[0].competizione;
			$scope.calendarioComp = $scope.calendario.filter(function(row) {
				if (row.competizione == $scope.competizioneSelected) {
					return true;
				} else {
					return false;
				}
			});
			//recupero la prima giornata non giocata
			$scope.giorSelected = $scope.calendarioComp.filter(function(row) {
				if (row.giocata == '0') {
					return true;
				} else {
					return false;
				}
			})[0].idGiornata;
			$scope.visualizzaGiornata($scope.giorSelected);
		});
	}
	
	$scope.caricaCompetizione =  function(competizione){
		$scope.infoGiornata = new Object();
		$('.menuItem').removeClass('selected');
		$scope.competizioneSelected = competizione;
		$scope.calendarioComp = $scope.calendario.filter(function(row) {
			if (row.competizione == $scope.competizioneSelected) {
				return true;
			} else {
				return false;
			}
		});
		$('#'+competizione).addClass('selected');
		
		//recupero la prima giornata non giocata
		$scope.giorSelected = $scope.calendarioComp.filter(function(row) {
			if (row.giocata == '0') {
				return true;
			} else {
				return false;
			}
		})[0].idGiornata;
		$scope.visualizzaGiornata($scope.giorSelected);
	}
	
	$scope.visualizzaGiornata = function(idGiorn) {
		$scope.chiudiDettaglio();
		$scope.loadingGiornata = true;
		$scope.infoGiornata = $scope.calendario.filter(function(row) {
			if (row.idGiornata == idGiorn && row.competizione == $scope.competizioneSelected) {
				return true;
			} else {
				return false;
			}
		});
		$scope.numGiornata = parseInt($scope.infoGiornata[0].giornata);
		$('li[id^=giornata]').removeClass('selected');
		$timeout(function() {
			$('.giornata-' + idGiorn).addClass('selected');
		});		
	}
	
	$scope.caricaDettaglio = function(idPartita, idGiornata, giocata, idCasa, idFuori, event){
		$scope.chiudiDettaglio();
		$http.get('service/tabellinoService.php?partita='+idPartita+'&giornata='+idGiornata+'&giocata='+giocata).success(function(data) {
			$scope.loading = false;
			$scope.infoPartita = $scope.infoGiornata.filter(function(row) {
				if (row.idPartita == idPartita) {
					return true;
				} else {
					return false;
				}
			});
			$scope.infoPartita = $scope.infoPartita[0];
			$scope.tabellino = data;
			$scope.squadraCasa = $scope.tabellino.filter(function(row) {
				if (row.squadra == idCasa) {
					return true;
				} else {
					return false;
				}
			});
			$scope.squadraFuori = $scope.tabellino.filter(function(row) {
				if (row.squadra == idFuori) {
					return true;
				} else {
					return false;
				}
			});
			
			$scope.panchinaCasa = $scope.tabellino.filter(function(row) {
				if (row.squadra == idCasa) {
					return true;
				} else {
					return false;
				}
			});
			$scope.panchinaFuori = $scope.tabellino.filter(function(row) {
				if (row.squadra == idFuori) {
					return true;
				} else {
					return false;
				}
			});
			
			$scope.panchinaCasa = $scope.sortByKeys($scope.panchinaCasa, 'ruolo', 'titolare');
			$scope.panchinaFuori = $scope.sortByKeys($scope.panchinaFuori, 'ruolo', 'titolare');
			
			$('.riepilogoContainer').css('position','absolute');
			$('.riepilogoContainer').css('top',$('#'+idPartita).height()+$('#'+idPartita).offset().top);
			$('.riepilogoContainer').css('display','block');
			$('.riepilogoContainer').css('width',$('#elencoGiornate').width());
			scrollPageTo('#' + idPartita);
		});
	}
	
	$scope.chiudiDettaglio = function(){
		$('.riepilogoContainer').css('display','none');
	}
	
	$scope.getDescrizioneRuolo = function(idRuolo) {
		return $scope.ruolo[idRuolo-1];
	}

	$scope.getAbbreviazioneRuolo = function(idRuolo, ruoloS) {
		if (idRuolo != undefined) {
			ruolo = $scope.ruolo[idRuolo-1].substring(0,1);
			if (ruoloS > 4){
				ruolo = ruolo + 'r';
			}
			return ruolo;
		} else {
			return "X";
		}		
	}
	
	$scope.getAbbreviazioneRuoloPanchina = function(idRuolo, ruoloS) {
		if (idRuolo != undefined) {
			ruolo = $scope.ruolo[idRuolo - 1].substring(0,1);
			if (ruoloS > -5 && ruoloS < 0) {
				ruolo = ruolo +'s';
			}
			return ruolo;
		}		
	}

	$scope.swipeGiornata = function(segno) {
		if (segno == 'piu') {
			$scope.numGiornata++;
		} else {
			$scope.numGiornata--;
		}
		$scope.giorSelected = $scope.calendarioComp.filter(function(row) {
			if (row.giornata == $scope.numGiornata) {
				return true;
			} else {
				return false;
			}
		})[0].idGiornata;
		$scope.visualizzaGiornata($scope.giorSelected);
	}
	
	$scope.sortByKey = function(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}

	$scope.sortByKeys = function(array, key1, key2) {
	    return array.sort(function(a, b) {
	        var x1 = a[key1]; var y1 = b[key1];
	        var x2 = a[key2]; var y2 = b[key2];
	        if (x1 < y1) {
	        	return -1;
	        } else if (x1 > y1) {
	        	return 1;
	        } else {
	        	return ((x2 < y2) ? -1 : ((x2 > y2) ? 1 : 0));
	        }
	    });
	}
});