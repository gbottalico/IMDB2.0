
	imdbFanta.controller('mercatoCtrl', function($scope, $http, $timeout, $filter) {

	var pwdTest = 'testinvio';
	$scope.loading = true;
	$scope.loadingForm = false;
	$scope.showSquadra = false;
	$scope.squadraDstSelected = false;
	

	$http.get('service/squadreService.php').success(function(data) {		
		$scope.loading = false;
		$scope.squadre = data;		
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
	
	$scope.mostraRosa = function(squadraSelected){
		$scope.squadraDstSelected = true;
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
	
	$scope.richiediScambio = function(){
		//effettuo controlli ruolo
		if ($('input[name=srcSelected][ruolo=1]:checked').length != $('input[name=dstSelected][ruolo=1]:checked').length  ||
			$('input[name=srcSelected][ruolo=2]:checked').length != $('input[name=dstSelected][ruolo=2]:checked').length  ||
			$('input[name=srcSelected][ruolo=3]:checked').length != $('input[name=dstSelected][ruolo=3]:checked').length  ||
			$('input[name=srcSelected][ruolo=4]:checked').length != $('input[name=dstSelected][ruolo=4]:checked').length ){
			alert ('I ruoli non coincidono');
		}else{
			//procedo con la richiesta di scambio
			alert('procedo');
		}
	}

	

});