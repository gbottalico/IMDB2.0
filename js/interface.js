var pwd;

function initializeMenu(){
	$('#menuClassifica').click(loadPageClassifica);
	$('#menuSquadre').click(loadPageSquadre);
	$('#menuCalendario').click(loadPageCalendario);
	$('#menuInvForm').click(loadPageInvForm);
	$('#menuVotiAssist').click(loadPageVoti);
	$('#menuProbabili').click(loadPageProbabili);
	$('#menuStatistiche').click(loadPageStats);
}


function loadPageClassifica(){
	window.location = "classifica.html?a=" + Math.random();
}

function loadPageSquadre(){
	window.location = "squadre.html?b=" + Math.random();
}

function loadPageCalendario(){
	window.location = "calendario.html?c=" + Math.random();
}

function loadPageInvForm(){
	window.location = "invia_formazione.html?d=" + Math.random();
}

function loadPageVoti() {
	window.location = "voti_assist.html?e=" + Math.random();
}

function loadPageProbabili() {
	window.location = "probabili.html?f=" + Math.random();
}

function loadPageStats() {
	window.location = "statistiche.html?g=" + Math.random();
}

function formatNumber(n) {
	return n < 10 ? '0' + n : '' + n;
}

function DataOraCorrente() {
	var dataOra = new Date();

	var g = "0" + dataOra.getDate();
	g = g.substr(g.length - 2, 2);
	var m = "0" + (dataOra.getMonth() + 1);
	m = m.substr(m.length - 2, 2);
	var a = "000" + dataOra.getFullYear();
	a = a.substr(a.length - 4, 4);

	var hh = "0" + dataOra.getHours();
	hh = hh.substr(hh.length - 2, 2);
	var mm = "0" + dataOra.getMinutes();
	mm = mm.substr(mm.length - 2, 2);
	var ss = "0" + dataOra.getSeconds();
	ss = ss.substr(ss.length - 2, 2);

	return g + "/" + m + "/" + a + " " + hh + "." + mm + "." + ss;
}