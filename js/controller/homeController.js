	imdbFanta.controller('HomeCtrl', function($scope, $http, $timeout) {

	$scope.loading = true;
	
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
	}		
});