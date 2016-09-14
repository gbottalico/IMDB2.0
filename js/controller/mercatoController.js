
	imdbFanta.controller('mercatoCtrl', function($scope, $http, $timeout, $filter) {

	var pwdTest = 'testinvio';
	$scope.loading = true;
	$scope.loadingForm = false;
	$scope.showSquadra = false;
	$scope.squadraDstSelected = false;
	$scope.viewProposte = false;
	$scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
	

	$http.get('service/squadreService.php').success(function(data) {		
		$scope.loading = false;
		$scope.squadre = data;		
	});

	/*
	*	Apre il pannellino per l'inserimento della password della squadra selezionata.
	*/
	$scope.inserisciPassword = function(squadraSelected) {
							
		$('#divPassword').addClass('imdb-visible');
		$scope.inviabile = true;
		$('input[name=password]').val('');
		$scope.squadraSelected = squadraSelected;
		
		$('.imdb-overlay').show();
	}

	$scope.closePasswordDiv = function() {
		$('.imdb-overlay').hide();
		$('#divPassword').removeClass('imdb-visible');			
	}
	
	$scope.closePropostaDiv = function() {
		$('.imdb-overlay').hide();
		$scope.viewProposte = !$scope.viewProposte;
	}

	$scope.verificaProposte = function() {
		//$http.get('service/mercatoService.php?azione=getProposte&squadra='+$scope.squadraSelected.idSquadra).success(function(data) {
			//console.log('Data = ' + JSON.stringify(data));
			$scope.retProposte = [{"idProposta":"8","squadraSrc":"3","squadraDst":"4","creditiSrc":"10","creditiDst":"20","giocatoriSrc":["10928", "123399", "135307", "142552"],"giocatoriDst":["13899", "136646", "10903", "118863"]}];
			$scope.proposte = [];
			var proposta = {};			
			var giocatoriAvere = [];
			var giocatoriDare = [];			
			angular.forEach($scope.retProposte, function(prop) {
				var infoSquadra = $scope.squadre.filter(function(row) {
					if (row.idSquadra == prop.squadraSrc) {
						return true;
					} else {
						return false;
					}
				});
				angular.forEach(prop.giocatoriSrc, function(gioc) {
					var infoGioc = infoSquadra[0].rosa.filter(function(row) {
						if (row.idFcm == gioc) {
							return true;							
						} else {
							return false;
						}
					});
					giocatoriAvere.push(infoGioc[0]);
				});
				angular.forEach(prop.giocatoriDst, function(gioc) {
					var infoGioc = $scope.squadraSelected.rosa.filter(function(row) {
						if (row.idFcm == gioc) {
							return true;							
						} else {
							return false;
						}
					});
					giocatoriDare.push(infoGioc[0]);
				});
				proposta = {
					idProposta : prop.idProposta,
					squadraSrc : infoSquadra[0],
					squadraDst : $scope.squadraSelected,
					creditiSrc : prop.creditiSrc,
					creditiDst : prop.creditiDst,
					giocatoriSrc : giocatoriAvere,
					giocatoriDst : giocatoriDare		
				};
				$scope.proposte.push(proposta);				
		});
		//	});
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
		$scope.verificaProposte();
	}		

	$scope.getDescrizioneRuolo = function(idRuolo) {
		return $scope.ruolo[idRuolo-1];
	}

	$scope.getAbbreviazioneRuolo = function(idRuolo) {
		return $scope.ruolo[idRuolo-1].substring(0,1);
	}	

	/*
	*	Verifica la correttezza della password
	*/
	$scope.verificaPassword = function(originale) {
		var pwdInserita = $('input[name=password]').val();		
		var crypted = Javacrypt.crypt("jd", pwdInserita);
		if (pwdInserita == pwdTest) {
			$scope.invioFake = true;
		}
		if (!$scope.invioFake && crypted[0] != originale) {			
			$scope.inviabile = false;
		} else {	
			$scope.inviabile = true;		
			$scope.visualizzaSquadra($scope.squadraSelected.idSquadra);
			$scope.closePasswordDiv();
		}
	}
	
	/*
	*	Mostra la rosa della squadra clickata
	*/
	$scope.mostraRosa = function(squadraSelected){
		$scope.squadraDstSelected = true;
		$scope.squadraDst = squadraSelected;
		var infoSquadra = $scope.squadre.filter(function(row) {
			if (row.idSquadra == squadraSelected) {
				return true;
			} else {
				return false;
			}
		});
		
		if (infoSquadra.length != 0){
			$scope.rosaDst = infoSquadra[0];
			angular.forEach($scope.rosaDst.rosa, function(cal) {
				cal.pos = -1;
			});
		}
		
	}
	
	/*
	*	Richiede lo scambio
	*/
	$scope.richiediScambio = function() {
		//effettuo controlli ruolo
		if ($('input[name=srcSelected]:checked').length==0 || ($('input[name=srcSelected][ruolo=1]:checked').length != $('input[name=dstSelected][ruolo=1]:checked').length  ||
			$('input[name=srcSelected][ruolo=2]:checked').length != $('input[name=dstSelected][ruolo=2]:checked').length  ||
			$('input[name=srcSelected][ruolo=3]:checked').length != $('input[name=dstSelected][ruolo=3]:checked').length  ||
			$('input[name=srcSelected][ruolo=4]:checked').length != $('input[name=dstSelected][ruolo=4]:checked').length)) {
			alert ('I ruoli non coincidono');
		} else {
			$scope.scambio = {
					'squadraSrc'  : $scope.squadraSelected.idSquadra,
					'squadraDst'  : $scope.squadraDst,
					'soldiDare'   : $scope.srcMoney ? $scope.srcMoney : 0,
					'soldiAvere'  : $scope.dstMoney ? $scope.dstMoney : 0,
					'playerDare'  : [],
					'playerAvere' : [],
					'azione'      : 'richiediScambio' 					
			}
			$('input[name=srcSelected]:checked').each(function() {
				$scope.scambio.playerDare.push($(this).val());
			});
			$('input[name=dstSelected]:checked').each(function() {
				$scope.scambio.playerAvere.push($(this).val());
			});
			console.log($scope.scambio);
			$http({
				method : 'POST',
				url : 'service/mercatoService.php',
				data : $scope.scambio
			}).then(function(data) {		
				console.log('OK' + data.data);
			}, function(data) {
				console.log('KO' + data.data);
			});
		}
	}
	
	/*
	*	Accetta la proposta selezionata
	*/
	$scope.accettaProposta = function(proposta){
		$scope.closePropostaDiv();

		var destinatari = "";
		angular.forEach($scope.squadre, function(sq) {
			destinatari += sq.mail + "; ";
		});

		var mailBody = "I club ufficializzano il seguente scambio:\n";
		mailBody += proposta.squadraSrc.nome + " cede alla squadra " + proposta.squadraDst.nome + " i giocatori ";
		angular.forEach(proposta.giocatoriSrc, function(gioc) {
			mailBody += gioc.nomeAbbr + ', ';
		});
		mailBody = mailBody.substring(0, mailBody.length - 2) + "\n";
		mailBody += proposta.squadraDst.nome + " cede alla squadra " + proposta.squadraSrc.nome + " i giocatori ";
		angular.forEach(proposta.giocatoriDst, function(gioc) {
			mailBody += gioc.nomeAbbr + ', ';
		});
		mailBody = mailBody.substring(0, mailBody.length - 2) + "\n";
		if (proposta.creditiSrc > 0 || proposta.creditiDst > 0) {
			if (proposta.creditiSrc > 0) {
				mailBody += "Inoltre " + proposta.squadraSrc.nome + " paga alla squadra " + proposta.squadraDst.nome + " un totale di " + proposta.creditiSrc + " crediti come conguaglio\n";
			} else {
				mailBody += "Inoltre " + proposta.squadraDst.nome + " paga alla squadra " + proposta.squadraSrc.nome + " un totale di " + proposta.creditiDst + " crediti come conguaglio\n";
			}
		}

		$.post('invform/sendmail.php', {
			recipient : 'bottalico.gi@gmail.com; luca.angelini85@gmail.com', //destinatari
			subject : 'Scambio avvenuto tra ' + proposta.squadraSrc.nome + ' e ' + proposta.squadraDst.nome,
			body : mailBody,
			sender : 'mercato-fantacalcio@imdb.it'
		})
		.success(function(data) {
			if (data != '') {
				$('#confermaTitle').text('Errore Conferma scambio');					
				$('#confermaText').html(data);
			} else {
				$http.get('service/mercatoService.php?azione=accettaProposta&proposta=' + proposta.idProposta)
				.success(function(data) {
					if (data != '') {
						$('#confermaTitle').text('Errore scambio');					
						$('#confermaText').html(data);
					} else {
						$('#confermaTitle').text('Scambio');
						$('#confermaText').addClass('success');
						$('#confermaText').text('Scambio avvenuto con successo!');
					}
					$('.imdb-overlay').show();
					$('#divConferma').addClass('imdb-visible');		
				})
				.error(function(data) {
					console.error('FUCK!');
				});				
			}
			$('.imdb-overlay').show();
			$('#divConferma').addClass('imdb-visible');				
		})
		.error(function(data) {
			console.error('FUCK!');
		});				
	}
	
	/*
	*	Gestisce il rifiuto di una proposta
	*/
	$scope.rifiutaProposta = function(proposta) {

		var mailBody = "Il club " + proposta.squadraDst.nome + " ha rifiutato la tua proposta:\n";		
		angular.forEach(proposta.giocatoriDst, function(gioc) {
			mailBody += gioc.nomeAbbr + ', ';
		});
		if (proposta.creditiDst > 0) {
			mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + proposta.creditiDst + " crediti per ";		
		} else {
			mailBody = mailBody.substring(0, mailBody.length - 2) + " per ";
		}		
		angular.forEach(proposta.giocatoriSrc, function(gioc) {
			mailBody += gioc.nomeAbbr + ', ';
		});
		if (proposta.creditiSrc > 0) {
			mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + proposta.creditiSrc + " crediti.\n";		
		} else {
			mailBody = mailBody.substring(0, mailBody.length - 2) + ".\n";
		}	

		$.post('invform/sendmail.php', {
			recipient : 'bottalico.gi@gmail.com; luca.angelini85@gmail.com', //proposta.squadraSrc.mail
			subject : 'Scambio rifiutato da ' + proposta.squadraDst.nome,
			body : mailBody,
			sender : 'mercato-fantacalcio@imdb.it'
		})
		.success(function(data) {
			if (data != '') {
				$('#confermaTitle').text('Errore Conferma scambio');					
				$('#confermaText').html(data);
			} else {
				$http.get('service/mercatoService.php?azione=rifiutaProposta&proposta=' + proposta.idProposta)
				.success(function(data) {
					if (data != '') {
						$('#confermaTitle').text('Errore Rifiuto scambio');					
						$('#confermaText').html(data);
					} else {
						$('#confermaTitle').text('Scambio');
						$('#confermaText').addClass('success');
						$('#confermaText').text('Scambio Rifiutato!');
					}
					$('.imdb-overlay').show();
					$('#divConferma').addClass('imdb-visible');		
				})
				.error(function(data) {
					console.error('FUCK!');
				});				
			}
			$('.imdb-overlay').show();
			$('#divConferma').addClass('imdb-visible');				
		})
		.error(function(data) {
			console.error('FUCK!');
		});	
	}
	
	$scope.closeConfermaDiv = function() {
		$('.imdb-overlay').hide();
		$('#divConferma').removeClass('imdb-visible');			
	}

});