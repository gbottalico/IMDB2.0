function initializeMenu(){
	$('#menuClassifica').click(loadPageClassifica);
	$('#menuSquadre').click(loadPageSquadre);
}


function loadPageClassifica(){
	window.location = "classifica.html";
}

function loadPageSquadre(){
	window.location = "squadre.html";
}