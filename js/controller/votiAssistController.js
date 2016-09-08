imdbFanta.controller('votiAssistCtrl', function($scope, $http, $filter) {
	$scope.loading = true;		
	$scope.ultimaGiornata = null;

	$scope.initGiornata =  function(){
		$http.get('service/calendarioService.php').success(function(data) {			
			$scope.calendario = data;
			$scope.competizioneSelected = $scope.calendario[0].competizione;
			$scope.calendarioComp = $scope.calendario.filter(function(row) {
				if (row.competizione == $scope.competizioneSelected) {
					return true;
				} else {
					return false;
				}
			});
			//recupero la prima giornata non giocata
			$scope.ultimaGiornata = $scope.calendarioComp.filter(function(row) {
				if (row.giocata == '0') {
					return true;
				} else {
					return false;
				}
			})[0].giornata;			
		});
	}

	$scope.caricaSito = function(sito) {		
		if (sito == 'voti') {			
			$('#voti').attr('src', 'images/voti.png');
			$('#assist').attr('src', 'images/assist_base.png');
			if ($(window).width() < 768) {
				$('#frameSito').attr('src', 'http://www.pianetafantacalcio.it/Voti_Ufficiosi.asp?Tipolink=0&TipoVoti=M&GiornataA=' + $scope.ultimaGiornata);
			} else {
				$('#frameSito').attr('src', 'http://www.pianetafantacalcio.it/Voti_Ufficiosi.asp?Tipolink=0&GiornataA=' + $scope.ultimaGiornata);
			}			
			$('#frameSito').css('width', $(window).width());			
			$('#frameSito').css('height', $(window).height());
		} else if (sito == 'assist') {
			$('#assist').attr('src', 'images/assist.png');
			$('#voti').attr('src', 'images/voti_base.png');
			$('#frameSito').attr('src', 'http://www.gazzetta.it/calcio/fantanews/assist/serie-a-2016-17').attr('sandbox', 'allow-same-origin allow-scripts');
			$('#frameSito').css('width', $(window).width());
			$('#frameSito').css('height', $(window).height());
		}
		$scope.loading = false;
	}
});