<?php require (__DIR__.'/../business/tabellinoBusiness.php') ?>

<?php 
	$partita = $_REQUEST['partita'];
	$giornata = $_REQUEST['giornata'];
	$giocata = $_REQUEST['giocata'];
	echo TabellinoBusiness::getFormazioniGiornata($partita, $giornata, $giocata);
?>