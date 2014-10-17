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

function assegnaPassword(password) {
	pwd = password;
}

function verificaPassword() {
	var originale = $('#originalPwd').val();
	var crypted = Javacrypt.crypt("jd", $('input[name=password]').val());
	if (crypted[0] != originale) {
		alert("Impossibile inviare la formazione: password non valida");
		return false;
	}	
	return true;
}