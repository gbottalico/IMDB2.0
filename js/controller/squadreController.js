imdbFanta.controller('squadreCtrl', function($scope, $http) {
	$scope.loading = true;
	
	$scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];

	$http.get('service/squadreService.php').success(function(data) {
		$scope.loading = false;
		$scope.squadre = data;
		$scope.visualizzaSquadra('1');
	});

	$scope.visualizzaSquadra = function(squadraSelected) {
		$('.menuItem').removeClass('selected');
		var infoSquadra = $scope.squadre.filter(function(row) {
			if (row.idSquadra == squadraSelected) {
				return true
			} else {
				return false;
			}
		});
		
		if (infoSquadra.length != 0){
			$scope.rosa = infoSquadra[0];
			$('#fotoPresidente').attr("src", $scope.rosa.foto);
		}
		$('#squadra-'+squadraSelected).addClass('selected');
	}
	
	$scope.getDescrizioneRuolo = function(idRuolo){
		return $scope.ruolo[idRuolo-1];
	}
});