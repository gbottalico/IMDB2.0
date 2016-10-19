	imdbFanta.controller('HomeCtrl', function($scope, $http, $timeout) {

	$scope.finito = false;
	/*$scope.loading = true;
	
	$http.get('service/squadreService.php').success(function(data) {		
		$scope.loading = false;
		$scope.squadre = data;
		$timeout(function() {
			$('.wheelSquadre').circleMenu({
			  trigger: 'click',
			  item_diameter: 40,
			  circle_radius: 150,
			  direction: 'bottom-left'
			});	
		});
	});

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
	}*/

	$http.get('service/fantamisterService.php?tipo=top').success(function(data) {				
		$scope.top = "http://imalatidelbari.netsons.org/img/allenatori/" + data + ".png";
		$http.get('service/fantamisterService.php?tipo=flop').success(function(data2) {				
			$scope.flop = "http://imalatidelbari.netsons.org/img/allenatori/" + data2 + ".png";
			$scope.finito = true;
		});	
	});		
});