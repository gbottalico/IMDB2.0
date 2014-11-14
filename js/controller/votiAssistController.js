imdbFanta.controller('votiAssistCtrl', function($scope, $http) {
	$scope.loading = true;	

	$scope.caricaSito = function(sito) {
		if (sito == 'voti') {
			$('#frameSito').attr('src', 'http://www.pianetafantacalcio.it/Voti_Ufficiosi.asp');
		} else if (sito == 'assist') {
			$('#frameSito').attr('src', 'http://www.gazzetta.it/calcio/fantanews/assist/serie-a-2014-15').attr('sandbox', 'allow-same-origin allow-scripts');
		}
		$scope.loading = false;
	}
});