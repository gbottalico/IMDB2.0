
	imdbFanta.controller('invFormCtrl', function($scope, $http, $timeout, $filter) {

	$scope.loading = true;
	$scope.showSquadra = false;
	$scope.inviabile = true;	
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
	$scope.moduloOk = false;

	$scope.titolari = [];
	$scope.riserve = [];

	$http.get('service/squadreService.php').success(function(data) {		
		$scope.loading = false;
		$scope.squadre = data;		
	});

	$http.get('service/termineService.php').success(function(data) {		
		$scope.termine = data.trim();			
	});

	$http.get('service/prossimaService.php').success(function(data) {											
		$scope.listaIncontri = data.filter(function(row) {
			if (row.competizione == 'Campionato') {
				return true;
			} else {
				return false;
			}
		});
	});

	/*
	*	Apre il pannellino per l'inserimento della password della squadra selezionata. Se il termine di invio è scaduto, mostra un messaggio di errore
	*/
	$scope.inserisciPassword = function(squadraSelected) {
		var termineInvio = $scope.termine.substring(6, 10) + $scope.termine.substring(3,5) + 
			$scope.termine.substring(0,2) + $scope.termine.substring(11,13) + $scope.termine.substring(14,16);
		var data = new Date();		
		var ora = "" + data.getFullYear() + formatNumber(data.getMonth() + 1) + formatNumber(data.getDate()) + 
			formatNumber(data.getHours()) + formatNumber(data.getMinutes());
		if (ora < termineInvio) {						
			$('#divPassword').addClass('imdb-visible');
			$scope.inviabile = true;
			$('input[name=password]').val('');
			$scope.squadraSelected = squadraSelected;
		} else {
			$('#divConferma').addClass('imdb-visible');
			$('#confermaTitle').text('Termine invio scaduto');
			$('#confermaText').text('Il termine per inviare la formazione è scaduto!');
		}
		$('.imdb-overlay').show();
	}

	$scope.closePasswordDiv = function() {
		$('.imdb-overlay').hide();
		$('#divPassword').removeClass('imdb-visible');			
	}

	$scope.closeSchedinaDiv = function() {
		$('.imdb-overlay').hide();
		$('#divSchedina').removeClass('imdb-visible');			
	}

	$scope.closeConfermaDiv = function() {
		$('.imdb-overlay').hide();
		$('#divConferma').removeClass('imdb-visible');			
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
			angular.forEach($scope.rosa.rosa, function(cal) {
				cal.pos = -1;
			});
		}
		$('#squadra-'+squadraSelected).addClass('selected');
	}	

	$scope.getDescrizioneRuolo = function(idRuolo) {
		return $scope.ruolo[idRuolo-1];
	}

	$scope.getAbbreviazioneRuolo = function(idRuolo) {
		return $scope.ruolo[idRuolo-1].substring(0,1);
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
				$('.imdb-overlay').show();
				$('#divConferma').addClass('imdb-visible');	
				$('#confermaTitle').text('Errore Formazione');					
				$('#confermaText').text('Formazione completata! Per cambiare qualche giocatore, deseleziona prima il giocatore da sostituire');				
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
			calciatore.pos = 0;
			$scope.ridisegnaModulo(calciatore);			
		} else {
			calciatore.pos = -1;
			calciatore.disabled = !calciatore.disabled;
			calciatore.selected = !calciatore.selected;
		}       		
	}

	/*
	*	Inserisce una riserva
	*/
	$scope.inserisciRiserva = function(calciatore) {		
		$scope.riserve.push(calciatore);
		calciatore.pos = $scope.riserve.length + 11;
		$scope.ridisegnaPanchina(calciatore);		
	}

	/*
	*	Gestisce l'eliminazione di un giocatore dalla formazione
	*/
	$scope.rimuoviGiocatore = function(calciatore) {
		for (var i = $scope.titolari.length - 1; i >= 0; i--) {
		    if ($scope.titolari[i].idFcm == calciatore.idFcm) {		    	
		        $scope.titolari.splice(i, 1);
		        calciatore.pos = -1;
		        $scope.moduloInserito[calciatore.ruolo - 1]--;
		        $scope.ridisegnaModulo(calciatore);		        
		        break;
		    }
		}
		for (var i = $scope.riserve.length - 1; i >= 0; i--) {
		    if ($scope.riserve[i].idFcm == calciatore.idFcm) {		    	
		        $scope.riserve.splice(i, 1);
		        calciatore.pos = -1;
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
			$('.imdb-overlay').show();
			$('#divConferma').addClass('imdb-visible');	
			$('#confermaTitle').text('Errore Formazione');					
			$('#confermaText').text('Impossibile inserire il giocatore in formazione: il modulo che ne deriverebbe non è ammesso nella competizione');			
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
	$scope.verificaPassword = function(originale) {		
		var crypted = Javacrypt.crypt("jd", $('input[name=password]').val());
		if (crypted[0] != originale) {			
			$scope.inviabile = false;
		} else {	
			$scope.inviabile = true;		
			$scope.visualizzaSquadra($scope.squadraSelected.idSquadra);
			$scope.closePasswordDiv();
		}
	}

	/*
	*	Verifica che sia stata inserita la formazione correttamente e mostra il div per l'inserimento della schedina e invio della formazione
	*/
	$scope.inserisciSchedina = function() {
		if ($scope.titolari.length == 11 && $scope.riserve.length == 7) {
    		$('.imdb-overlay').show();
			$('#divSchedina').addClass('imdb-visible');

    	} else {
    		$('.imdb-overlay').show();
			$('#divConferma').addClass('imdb-visible');	
			$('#confermaTitle').text('Errore Formazione');					
			$('#confermaText').text('Attenzione! Formazione incompleta');			
    	}						
	}

	/*
	*	Invia la formazione
	*/
	$scope.inviaFormazione = function() {
		var schedinaOk = true;
		$scope.inviabile = true;
		var idIncontro = 0;
		var sqCasa;
		var sqFuori;
		var schedinaMail = "";
		angular.forEach($scope.listaIncontri, function(inc) {
			var idSch = $('.schedina-pron.' + inc.idPartita + '.selected').attr('id');
			if (idSch == undefined) {
				schedinaOk = false;
			} else {
				inc.pronostico = idSch.replace(inc.idPartita + '-', '');
				schedinaMail += inc.squadraCasa + " - " + inc.squadraFuori + "   " + inc.pronostico + "\n";
				if (inc.idSquadraCasa == $scope.squadraSelected.idSquadra || inc.idSquadraFuori == $scope.squadraSelected.idSquadra) {
					idIncontro = inc.idPartita;
					sqCasa = inc.squadraCasa;
					sqFuori = inc.squadraFuori;
				}
			}
		});
		if (schedinaOk) {			
			var destinatari = "";
			angular.forEach($scope.squadre, function(sq) {
				destinatari += sq.mail + "; ";
			});			
			var mailBody = "Lega: I Malati Del Bari \n";
			mailBody += "Squadra: " + $scope.squadraSelected.nome + "\n";
			mailBody += "Giornata: " + $scope.listaIncontri[0].giornata + "a\n";
			mailBody += "Match: "+ sqCasa + " - "+ sqFuori +"\n";
			mailBody += "Data e ora compilazione: " + DataOraCorrente() + "\n\n";
			// Costruisce la parte del messaggio contenente la formazione
			mailBody += "--- Titolari ---\n";
			for (i = 0; i < 11; i++) {
				mailBody += $scope.getAbbreviazioneRuolo($scope.titolari[i].ruolo) + " " + $scope.titolari[i].nome + " (" + $scope.titolari[i].squadraDiA + ") \n";
			}
			mailBody += "\n--- Riserve ---\n";
			for (i = 0; i < 7; i++) {
				mailBody += $scope.getAbbreviazioneRuolo($scope.riserve[i].ruolo) + " " + $scope.riserve[i].nome + " (" + $scope.riserve[i].squadraDiA + ") \n";
			}
			mailBody += "\nSchedina: \n" + schedinaMail;
			// Costruisce la formazione da salvare sul sito			
			var formazioneSalvata = new Array();
			for (i = 0; i < $scope.rosa.rosa.length; i++) {
				formazioneSalvata.push(idIncontro + "," + $scope.squadraSelected.idSquadra + ",0," + $scope.rosa.rosa[i].codice + "," + 
					$scope.rosa.rosa[i].squadraDiACod + "," + $scope.rosa.rosa[i].ruolo + "," + $scope.rosa.rosa[i].pos + ",0");
			}

			$.post('invform/sendmail.php', {
				recipient : destinatari,
				subject : 'Formazioni ' + $scope.listaIncontri[0].giornata + 'a Giornata',
				giornataDiA : $scope.listaIncontri[0].giornata,
				idSquadra : $scope.squadraSelected.idSquadra,
				idIncontro : idIncontro,
				body : mailBody,
				sender : 'formazioni@imdb.it',
				saveData : formazioneSalvata.join("|")
			})
			.success(function(data) {
				if (data != '') {
					$('#confermaTitle').text('Errore Invio Formazione');					
					$('#confermaText').text(data);
				} else {
					$('#confermaTitle').text('Invio Formazione');
					$('#confermaText').addClass('success');
					$('#confermaText').text('Formazione inviata con successo!');
				}				
				$scope.closeSchedinaDiv();
				$('.imdb-overlay').show();
				$('#divConferma').addClass('imdb-visible');				
			})
			.error(function(data) {
				console.error('FUCK!');
			});			
		} else {
			$scope.inviabile = false;
		}
	}

	/*
	*	Seleziona il pronostico per la partita 
	*/
	$scope.pronostico = function(idPartita, pronostico) {
		$('.' + idPartita).removeClass('selected');
		$('#' + idPartita + '-' + pronostico).addClass('selected');
	}
});