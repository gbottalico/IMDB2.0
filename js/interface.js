function initializeMenu(){
	initializeDimension();
	$('#menuClassifica').click(loadPageClassifica);
}

function initializeDimension(){
	var altezza = $('#wrapper').height();
	var larghezza = $('#wrapper').width();
	var dimensioni;
	
	if (altezza < larghezza) { 
		$('.menu').css('width', $('#wrapper').height());
		dimensioni = ($('#wrapper').height() * 32)/100;
	}else{
		$('.menu').css('width', $('#wrapper').width());
		dimensioni = ($('#wrapper').width() * 32)/100;
	}
	
	$('.menu li').css('height', dimensioni);
	$('.menu li').css('width', dimensioni);
}

function loadPageClassifica(){
	window.location = "classifica.html";
}