
	imdbFanta.controller('invFormCtrl', function($scope, $http, $timeout) {

	$scope.loading = true;
	$scope.showSquadra = false;
	$scope.inviabile = false;
	$scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
	$scope.moduloInserito = new Array(0,0,0,0);
	$scope.moduliAmmessi = [new Array(1,3,4,3), new Array(1,3,5,2), new Array(1,3,6,1), new Array(1,4,3,3), new Array(1,4,4,2),
		new Array(1,4,5,1), new Array(1,5,2,3), new Array(1,5,3,2), new Array(1,5,4,1), new Array(1,6,3,1)];
	$scope.disegnoCampo = [{ruolo: 1, num: 1, ids: '1'}, 
						   {ruolo: 2, num: 1, ids: '1'},
						   {ruolo: 2, num: 2, ids: '1,2'},
						   {ruolo: 2, num: 3, ids: '1,2,3'},
						   {ruolo: 2, num: 4, ids: '1,2,4,5'},
						   {ruolo: 2, num: 5, ids: '1,2,3,4,5'},
						   {ruolo: 2, num: 6, ids: '1,2,3,4,5,6'},
						   {ruolo: 3, num: 1, ids: '2'},
						   {ruolo: 3, num: 2, ids: '2,3'},
						   {ruolo: 3, num: 3, ids: '1,2,3'},
						   {ruolo: 3, num: 4, ids: '2,3,5,6'},
						   {ruolo: 3, num: 5, ids: '1,2,3,5,6'},
						   {ruolo: 3, num: 6, ids: '1,2,3,4,5,6'},
						   {ruolo: 4, num: 1, ids: '1'},
						   {ruolo: 4, num: 2, ids: '2,3'},
						   {ruolo: 4, num: 3, ids: '1,2,3'}];	
	$scope.moudloOk = false;

	$scope.titolari = [];
	$scope.riserve = [];

	$http.get('service/squadreService.php').success(function(data) {		
		$scope.loading = false;
		$scope.squadre = data;		
	});

	$scope.inserisciPassword = function(squadraSelected) {
		$('.imdb-overlay').show();
		$('#divPassword').addClass('imdb-visible');
		$scope.squadraSelected = squadraSelected;			
	}

	$scope.closePasswordDiv = function() {
		$('.imdb-overlay').hide();
		$('#divPassword').removeClass('imdb-visible');			
	}

	$scope.visualizzaSquadra = function(squadraSelected) {		
		$('.menuItemInv').removeClass('selected');
		var infoSquadra = $scope.squadre.filter(function(row) {
			if (row.idSquadra == squadraSelected) {
				return true;
			} else {
				return false;
			}
		});
		
		if (infoSquadra.length != 0){
			$scope.rosa = infoSquadra[0];
		}
		$('#squadra-'+squadraSelected).addClass('selected');
	}	

	$scope.getDescrizioneRuolo = function(idRuolo){
		return $scope.ruolo[idRuolo-1];
	}

	$scope.clickGiocatore = function(calciatore) {	
		calciatore.disabled = !calciatore.disabled;
		calciatore.selected = !calciatore.selected;		       
		if (calciatore.selected) {
			// Verifico il modulo
			if ($scope.titolari.length < 11) {
        		$scope.inserisciTitolare(calciatore);
        	} else if ($scope.riserve.length < 7) {
        		$scope.inserisciRiserva(calciatore);
        	} else {
        		calciatore.disabled = !calciatore.disabled;
				calciatore.selected = !calciatore.selected;
				alert('Formazione completata! Per cambiare qualche giocatore, deseleziona prima il giocatore da sostituire');
        	}						
		} else {			
			$scope.rimuoviGiocatore(calciatore);
		}	
	}

	/*
	*	Aggiunge un giocatore alla formazione titolare inserita se il modulo e' ok
	*/	
	$scope.inserisciTitolare = function(calciatore) {
		$scope.moduloInserito[calciatore.ruolo - 1]++;
		$scope.checkModulo(calciatore.ruolo - 1);		
		if ($scope.moduloOk) {
			$scope.titolari.push(calciatore);
			$scope.ridisegnaModulo(calciatore);			
		} else {
			calciatore.disabled = !calciatore.disabled;
			calciatore.selected = !calciatore.selected;
		}       		
	}

	/*
	*	Inserisce una riserva
	*/
	$scope.inserisciRiserva = function(calciatore) {		
		$scope.riserve.push(calciatore);
		$scope.ridisegnaPanchina(calciatore);		
	}

	/*
	*	Gestisce l'eliminazione di un giocatore dalla formazione
	*/
	$scope.rimuoviGiocatore = function(calciatore) {
		for (var i = $scope.titolari.length - 1; i >= 0; i--) {
		    if ($scope.titolari[i].idFcm == calciatore.idFcm) {		    	
		        $scope.titolari.splice(i, 1);
		        $scope.moduloInserito[calciatore.ruolo - 1]--;
		        $scope.ridisegnaModulo(calciatore);		        
		        break;
		    }
		}
		for (var i = $scope.riserve.length - 1; i >= 0; i--) {
		    if ($scope.riserve[i].idFcm == calciatore.idFcm) {		    	
		        $scope.riserve.splice(i, 1);
		        $scope.ridisegnaPanchina(calciatore);
		        break;
		    }
		}
	}

	/*
	*	Verifica che il modulo inserito sia ammesso
	*/	
	$scope.checkModulo = function(idruolo) {
		var compatibile = false;		
		angular.forEach($scope.moduliAmmessi, function(mod) {			
			if ($scope.moduloInserito[0] <= mod[0] &&
					$scope.moduloInserito[1] <= mod[1] &&
					$scope.moduloInserito[2] <= mod[2] &&
					$scope.moduloInserito[3] <= mod[3]) {
				compatibile = true;				
			}
		});
		$scope.moduloOk = compatibile;
		if (!compatibile) {
			$scope.moduloInserito[idruolo]--;
			alert("Impossibile inserire il giocatore in formazione: il modulo che ne deriverebbe non è ammesso nella competizione");
		}
	}

	/*
	*	Ridisegna i giocatori in campo a seconda del nuovo modulo selezionato
	*/
	$scope.ridisegnaModulo = function(calciatore) {
		var cognome = calciatore.nome.split(" ")[0];		
		var num = $scope.moduloInserito[calciatore.ruolo - 1];
		var nomi = [];
		var foto = [];				
		$('div[class*=campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + ']').hide();
		$scope.titolari.filter(function(tit) {
			if (tit.ruolo == calciatore.ruolo) {
				nomi.push(tit.nome.split(" ")[0]);
				foto.push(tit.foto);
			}
		});
		$scope.disegnoCampo.filter(function(row) {
			if (row.ruolo == calciatore.ruolo && row.num == num) {
				var ids = row.ids.split(',');
				for (var i = 0; i < ids.length; i++) {						
					//$('.campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + '-' + ids[i] + ' > p').text(nomi[i]).css('margin-left', (nomi[i].length > 5 ? 3 - nomi[i].length : nomi[i].length));
					$('.campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + '-' + ids[i]).css("background-image", "url(" + foto[i] + ")");
					$('.campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + '-' + ids[i]).show();
				}
			}
		});		
	}

	/*
	*	Ridisegna i giocatori in panchina a seconda del giocatore selezionato
	*/
	$scope.ridisegnaPanchina = function(calciatore) {
		var cognome = calciatore.nome.split(" ")[0];
		var num = $scope.riserve.length;
		var nomi = [];
		$('div[class*=campo-riserva]').hide();
		$scope.riserve.filter(function(ris) {
			nomi.push(ris.nome.split(" ")[0]);
		});
		for (var i = 0; i < $scope.riserve.length; i++) {
			$('.campo-riserva-' + (i+1) + ' > p').text(nomi[i]).css('margin-left', (nomi[i].length > 6 ? -4 - nomi[i].length : -nomi[i].length));
			$('.campo-riserva-' + (i+1)).show();
		}		
	}

	/*
	*	Verifica la correttezza della password
	*/
	$scope.verificaPassword = function(inserita, originale) {		
		var crypted = Javacrypt.crypt("jd", inserita);
		if (crypted[0] != originale) {
			alert("Impossibile inviare la formazione: password non valida");
			$scope.inviabile = false;
		}	
		$scope.inviabile = true;
	}
});