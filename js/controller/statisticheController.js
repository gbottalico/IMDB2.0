imdbFanta.controller('statisticheCtrl', function($scope, $http, $filter) {
	$scope.loading = true;		

	$scope.initData = function() {
		$http.get('service/squadreService.php').success(function(data) {		
			$scope.squadre = data;
		});

		$http.get('service/classificaService.php').success(function(data) {		
			$scope.classifica = data;
		});

		$scope.loading = false;
	}

	$scope.caricaStat = function(stat) {
		$scope.loading = true;
		if (stat == 'seavessiavuto') {
			$http.get('service/seavessiavutoService.php').success(function(data) {			
				$scope.seavessi = data;
				$scope.generaSeAvessi();						
				$scope.loading = false;
				$scope.statistica = stat;
			});
		} else if (stat == 'schedina') {
			$http.get('service/schedinaService.php').success(function(data) {			
				$scope.schedina = data;
				$scope.loading = false;
				$scope.statistica = stat;							
			});			
		} else if (stat == 'mercato') {
			$http.get('service/giocatoriLiberiService.php').success(function(data) {			
				$scope.svincolati = data;
				/*$('#giocatoriliberi').dataTable({
					bDestroy : true,
					sPaginationType : "full_numbers",
					bAutoWidth : false,
					sScrollX: "100%"
				});*/
				$scope.loading = false;
				$scope.statistica = stat;							
			});			
		}			
	}

	$scope.getSquadraNameById = function(idsquadra) {
		return $scope.squadre.filter(function(row) {
			if (row.idSquadra == idsquadra) {
				return true;
			}
		})[0].nome;
	}

	$scope.getSquadraPuntiById = function(idsquadra) {
		return parseInt($scope.classifica.filter(function(row) {
			if (row.idSquadra == idsquadra) {
				return true;
			}
		})[0].punti);
	}

	$scope.generaSeAvessi = function() {
		var i, j, stile, buffer1, buffer2;
		var media = new Array();
		var nomitassodisfiga = new Array();
		var calendariokiller = new Array();
		var nomicalendario = new Array();
		for (i = 0; i < $scope.seavessi.length; i++) {
				media[i] = 0;
				nomitassodisfiga[i] = $scope.seavessi[i].squadraA;
				nomicalendario[i] = $scope.seavessi[i].squadraA;
				calendariokiller[i] = 0;
		}
		//generazione tasso di sfiga
		for (i = 0; i < $scope.seavessi.length; i++) {
			for (j = 0; j < $scope.seavessi.length; j++) {
				media[i] = media[i] + parseInt($scope.seavessi[i].array[j].punti);
				calendariokiller[i] = calendariokiller[i] + parseInt($scope.seavessi[j].array[i].punti);
			}
			media[i] = media[i] / ($scope.seavessi.length - 1);
			media[i] = parseInt($scope.seavessi[i].array[i].punti) - media[i];
			calendariokiller[i] = calendariokiller[i] / ($scope.seavessi.length - 1);
		}
		for (i = 0; i < $scope.seavessi.length; i++) {
			for (j = i + 1; j < $scope.seavessi.length; j++) {
				if (media[j] > media[i]) {
					buffer1 = media[i];
					media[i] = media[j];
					media[j] = buffer1;
					buffer2 = nomitassodisfiga[i];
					nomitassodisfiga[i] = nomitassodisfiga[j];
					nomitassodisfiga[j] = buffer2;
				}
				if (calendariokiller[j] > calendariokiller[i]) {
					buffer1 = calendariokiller[i];
					calendariokiller[i] = calendariokiller[j];
					calendariokiller[j] = buffer1;
					buffer2 = nomicalendario[i];
					nomicalendario[i] = nomicalendario[j];
					nomicalendario[j] = buffer2;
				}	
			}
		}
		$scope.squadraPiuFortunata = $scope.getSquadraNameById(nomitassodisfiga[0]);		
		$scope.squadraPiuSfortunata = $scope.getSquadraNameById(nomitassodisfiga[$scope.seavessi.length - 1]);
		$scope.calendarioPiuFacile = $scope.getSquadraNameById(nomicalendario[0]);
		$scope.calendarioPiuDifficile = $scope.getSquadraNameById(nomicalendario[$scope.seavessi.length - 1]);
	}

	$scope.orderSvincolati = function(predicate, reverse) {
    	$scope.svincolati = $filter('orderBy')($scope.svincolati, predicate, reverse);
  	};
});