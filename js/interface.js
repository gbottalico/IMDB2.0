var pwd;

function initializeMenu(){
	$('#menuClassifica').click(loadPageClassifica);
	$('#menuSquadre').click(loadPageSquadre);
	$('#menuCalendario').click(loadPageCalendario);
	$('#menuInvForm').click(loadPageInvForm);
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

function loadPageInvForm(){
	window.location = "invia_formazione.html";
}

function formatNumber(n) {
	return n < 10 ? '0' + n : '' + n;
}