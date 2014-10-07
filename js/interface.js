function initializeMenu(){
	$('#menuClassifica').click(loadPageClassifica);
	$('#menuSquadre').click(loadPageSquadre);
	$('#menuCalendario').click(loadPageCalendario);
}


function loadPageClassifica(){
	window.location = "classifica.html";
}

function loadPageSquadre(){
	window.location = "squadre.html";
}

function loadPageCalendario(){
	window.location = "calendario.html";
}