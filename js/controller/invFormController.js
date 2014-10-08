imdbFanta.controller('invFormCtrl', function($scope, $http) {
	$scope.loading = true;
	$scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
	$scope.formazione = [];

	$http.get('service/squadreService.php').success(function(data) {
		$scope.loading = false;
		$scope.squadre = data;
	});

	$scope.visualizzaSquadra = function() {		
		var infoSquadra = $scope.squadre.filter(function(row) {
			if (row.idSquadra == $scope.squadraSelected) {
				return true
			} else {
				return false;
			}
		});
		
		if (infoSquadra.length != 0){
			$scope.rosa = infoSquadra[0];
			angular.forEach($scope.rosa.rosa, function (v) {
                v.selected = false;
                v.disabled = false;
            });			
		}
	}	

	$scope.getDescrizioneRuolo = function(idRuolo){
		return $scope.ruolo[idRuolo-1];
	}

	$scope.clickGiocatore = function(calciatore) {
		$scope.formazione = [];
		calciatore.disabled = !calciatore.disabled;
		calciatore.selected = !calciatore.selected;
		var cognome = calciatore.nome.split(" ")[0];
		if (calciatore.selected) {
			if (calciatore.ruolo == 1) {
				$('.campo-portiere').text(cognome).show();
			} else if (calciatore.ruolo == 2) {
				$('.campo-difensore-1').text(cognome).show();				
			} else if (calciatore.ruolo == 3) {
				$('.campo-centrocampista-1').text(cognome).show();
			} else if (calciatore.ruolo == 4) {
				$('.campo-attaccante-1').text(cognome).show();
			}
		} else {
			if (calciatore.ruolo == 1) {
				$('.campo-portiere').hide();
			} else if (calciatore.ruolo == 2) {
				$('.campo-difensore-1').hide();
			} else if (calciatore.ruolo == 3) {
				$('.campo-centrocampista-1').hide();
			} else if (calciatore.ruolo == 4) {
				$('.campo-attaccante-1').hide();
			}
		}		
		angular.forEach($scope.rosa.rosa, function (v) {
            if (v.selected) {
            	$scope.formazione.push(v.codice);
            }
        });	
	}
});