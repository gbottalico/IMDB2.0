imdbFanta.controller('votiAssistCtrl', function($scope, $http) {
	$scope.loading = true;		

	$scope.caricaSito = function(sito) {
		if (sito == 'voti') {
			$('#voti').attr('src', 'images/voti.png');
			$('#assist').attr('src', 'images/assist_base.png');
			$('#frameSito').attr('src', 'http://www.pianetafantacalcio.it/Voti_Ufficiosi.asp');
			$('#frameSito').css('width', $(window).width());			
		} else if (sito == 'assist') {
			$('#assist').attr('src', 'images/assist.png');
			$('#voti').attr('src', 'images/voti_base.png');
			$('#frameSito').attr('src', 'http://www.gazzetta.it/calcio/fantanews/assist/serie-a-2014-15').attr('sandbox', 'allow-same-origin allow-scripts');
			$('#frameSito').css('width', $(window).width());
		}
		$scope.loading = false;
	}
});