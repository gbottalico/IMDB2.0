imdbFanta.controller('risultatiCtrl', function ($scope, $http) {		

	$scope.verificaVoti = function() {
		$scope.loading = true;		
		$http.get('service/risultatiService.php').success(function(data) {
			if (data.trim().indexOf('is not readable') > 0)	{
				$scope.votoImmobile = "File non presente";
			} else {
				$scope.votoImmobile = data;
			}			
			$scope.loading = false;								
		});
	}
});