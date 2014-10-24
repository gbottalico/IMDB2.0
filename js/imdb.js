var imdbFanta = angular.module('IMDB', ['ngTouch']);
(function (angular, imdbFanta) {
  'use strict';
  imdbFanta.factory('scrollPageTo', function () {
        return function (target, delay) {
            var $target = $(target), _delay = delay === '' || delay === undefined ? 500 : delay, duration = parseInt(_delay, 10);
            if ($target.length) {
                $('html, body').animate({ scrollTop: $target.offset().top }, duration, 'easeInOutQuad');
            }
        };  
    });
}(window.angular, window.imdbFanta));
imdbFanta.filter('unique', function() {
    return function(input, key) {
        var unique = {};
        var uniqueList = [];
        if (input!=undefined){
	        for(var i = 0; i < input.length; i++){
	            if(typeof unique[input[i][key]] == "undefined"){
	                unique[input[i][key]] = "";
	                uniqueList.push(input[i]);
	            }
	        }
        }
        return uniqueList;
    };
});