imdbFanta.controller('probabiliCtrl', function($scope, $http) {
	$scope.loading = true;	

	$scope.caricaSito = function(sito) {
		if (sito == 'gazzetta') {
			$('#gazzetta').attr('src', 'images/gazzetta.jpg');
			$('#fantagazzetta').attr('src', 'images/fantagazzetta_base.png');
			$('#frameSito').attr('src', 'http://www.gazzetta.it/Calcio/prob_form/');
		} else if (sito == 'fantagazzetta') {
			$('#fantagazzetta').attr('src', 'images/fantagazzetta.png');
			$('#gazzetta').attr('src', 'images/gazzetta_base.png');
			$('#frameSito').attr('src', 'http://m.fantagazzetta.com/probabili-formazioni.vbhtml').attr('sandbox', 'allow-same-origin allow-scripts');
		}
		$scope.loading = false;
	}
});