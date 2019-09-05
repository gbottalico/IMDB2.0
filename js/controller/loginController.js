imdbFanta.controller('loginCtrl', function($scope, $http, $timeout, $filter, $sce) {
    $scope.pwdErrata = false;
    /*
     *	Verifica la correttezza della password
     */
    $scope.verificaCredenziali = function() {
        var userInserita = $('input[name=username]').val() 
        var pwdInserita = $('input[name=password]').val();
        $.post('service/loginService.php', {
            user: userInserita,
            pwd: pwdInserita,
        }).success(function(data) {
            if (data.trim()=='OK'){
                window.location="schedina.php";
            }else{
                $scope.pwdErrata = true;
            }
           
        });
    }
    
    

});