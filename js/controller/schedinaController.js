imdbFanta.controller('schedinaCtrl', function($scope, $http, $timeout, $filter, $sce) {

    
    $scope.loading = true;
    $scope.loadingForm = false;
    
    $http.get('service/prossimaService.php').success(function(data) {
        $scope.listaIncontri = data;
        setTimeout(function(){ 
            $( "#tabs" ).tabs();
            $( "#tabs" ).show();
             }
        , 1500);
       
    });

});