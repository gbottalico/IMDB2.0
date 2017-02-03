imdbFanta.controller('probabiliCtrl', function($scope, $http) {
	$scope.loading = true;		

	$scope.caricaSito = function(sito) {
		if (sito == 'gazzetta') {
			$('#gazzetta').attr('src', 'images/gazzetta.jpg');
			$('#fantagazzetta').attr('src', 'images/fantagazzetta_base.png');
			$('#sportmediaset').attr('src', 'images/sportmediaset_base.png');
			$('#fantaformazione').attr('src', 'images/fantaformazione_base.png');
			$('#frameSito').attr('src', 'http://www.gazzetta.it/Calcio/prob_form/');
			$('#frameSito').css('width', $(window).width());
			$('#frameSito').css('height', $(window).height());
		} else if (sito == 'fantagazzetta') {
			$('#fantagazzetta').attr('src', 'images/fantagazzetta.png');
			$('#gazzetta').attr('src', 'images/gazzetta_base.png');
			$('#sportmediaset').attr('src', 'images/sportmediaset_base.png');
			$('#fantaformazione').attr('src', 'images/fantaformazione_base.png');
			$('#frameSito').attr('src', 'http://m.fantagazzetta.com/probabili-formazioni.vbhtml').attr('sandbox', 'allow-same-origin allow-scripts');
			$('#frameSito').css('width', $(window).width());
			$('#frameSito').css('height', $(window).height());
		} else if (sito == 'sportmediaset') {
			$('#sportmediaset').attr('src', 'images/sportmediaset.png');
			$('#fantagazzetta').attr('src', 'images/fantagazzetta_base.png');
			$('#gazzetta').attr('src', 'images/gazzetta_base.png');
			$('#fantaformazione').attr('src', 'images/fantaformazione_base.png');
			$('#frameSito').attr('src', 'http://www.sportmediaset.mediaset.it/squadre/probabili_formazioni.shtml').attr('sandbox', 'allow-same-origin allow-scripts');
			$('#frameSito').css('width', $(window).width());
			$('#frameSito').css('height', $(window).height());			
		} else if (sito == 'fantaformazione') {
			$('#fantaformazione').attr('src', 'images/fantaformazione.png');
			$('#fantagazzetta').attr('src', 'images/fantagazzetta_base.png');
			$('#gazzetta').attr('src', 'images/gazzetta_base.png');
			$('#sportmediaset').attr('src', 'images/sportmediaset_base.png');
			$('#frameSito').attr('src', 'http://www.fantaformazione.com/fantacalcio.calendari/probabili/Home.htm').attr('sandbox', 'allow-same-origin allow-scripts');
			$('#frameSito').css('width', $(window).width());
			$('#frameSito').css('height', $(window).height());			
		}
		$scope.loading = false;
	}
});