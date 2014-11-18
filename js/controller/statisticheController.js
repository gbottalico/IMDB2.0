imdbFanta.controller('statisticheCtrl', function($scope, $http) {
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
		$http.get('service/seavessiavutoService.php').success(function(data) {			
			$scope.seavessi = data;			
		});
		$scope.statistica = stat;
		$scope.loading = false;
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
});