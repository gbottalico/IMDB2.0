imdbFanta.controller('schedinaCtrl', function($scope, $http, $timeout, $filter, $sce) {

    
    $scope.loading = true;
    $scope.loadingForm = false;
    $scope.giornataCorrente = null;
    $scope.invioScaduto = true;
    $scope.schedina = [];
    $scope.invioEnabled = false;

    $http.get('service/giornataCorrenteService.php').success(function(data) {
        $scope.giornataCorrente = data;
        var termineInvio = $scope.giornataCorrente.scadenza.substring(6, 10) + $scope.giornataCorrente.scadenza.substring(3, 5) +
            $scope.giornataCorrente.scadenza.substring(0, 2) + $scope.giornataCorrente.scadenza.substring(11, 13) + $scope.giornataCorrente.scadenza.substring(14, 16);
        var data = new Date();
        var ora = "" + data.getFullYear() + formatNumber(data.getMonth() + 1) + formatNumber(data.getDate()) +
            formatNumber(data.getHours()) + formatNumber(data.getMinutes());
        if (ora < termineInvio) {
            $scope.invioScaduto = false;
        }
        $http.get('service/prossimaService.php').success(function(data) {
            $scope.listaIncontri = data;
            $scope.initializeSchedina($scope.listaIncontri.filter((par) => par.idGiornata == $scope.giornataCorrente.idGiornata));
            setTimeout(function(){ 
                $( "#tabs" ).tabs({active: $scope.giornataCorrente.idGiornata - 1});
                $( "#tabs" ).show();
                 }
            , 1500);
           
        });
    });
    
    

    $scope.initializeSchedina = function(incontri){
        for (i=0; i<= incontri.length-1; i++){
            if (incontri[i].risultato_ins != null){
                $scope.pronostico (incontri[i].idPartita, incontri[i].risultato_ins);
            }
        }
    }

    /*
     *	Seleziona il pronostico per la partita 
     */
    $scope.pronostico = function(idPartita, pronostico) {
        $('.' + idPartita).removeClass('selected');
        $('#' + idPartita + '-' + pronostico).addClass('selected');
        partita = {};
        partita.idPartita =  idPartita;
        partita.pronostico = pronostico;
        $scope.schedina = $scope.schedina.filter((par) => par.idPartita != idPartita);
        $scope.schedina.push(partita);
        if ($scope.schedina.length == 5){
            $scope.invioEnabled = true;
        }
    }

    /*
     *	Seleziona il pronostico per la partita 
     */
    $scope.inviaSchedina = function() {
        $.post('service/saveSchedinaService.php', {
            schedina: $scope.schedina,
            idGiornata : $scope.giornataCorrente.idGiornata
        }).success(function(data) {
            if (data.trim()=='OK'){
                alert("Schedina inserita con successo");
            }else{
                alert("Errore durante l'inserimento della schedina");
            }
           
        });
    }

});