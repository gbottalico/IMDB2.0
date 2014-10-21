<?php

//-----------------------------------------------------------------------------
// sendmail.php
//
// Copyright (C) 2005 Marcello 'John Doe' Puri
//
// Versione 0.9.0 (15/09/2005)
// Versione 0.9.5 (28/09/2005)
//  * aggiunto il modulo di salvataggio automatico delle formazioni
// Versione 0.9.6 (07/10/2005)
//  * modificata la modalità di passaggio parametri al modulo d'invio e
//    salvataggio formazione per garantire la compatibilità anche con
//    Internet Explorer
//  * la pagina HTML generata dal modulo d'invio e salvataggio formazione
//    è completa anche in caso di errore
// Versione 1.0.0 (02/12/2005)
//  * aggiunto messaggio di debug visualizzato se nessun parametro
//    viene specificato
// Versione 1.1.0 (08/09/2006)
//-----------------------------------------------------------------------------
// saveLineUp() e' liberamente ispirata a SalvaFormazione.php di
// Giuseppe "mR`gImO" (http://www.legadeiforti.info/skindownload.htm)
//-----------------------------------------------------------------------------

require('class.phpmailer.php');

$fantasquadra = '';
$competizione = '';
$lega = '';

$result = sendMail();
if ($result != '') {
	return $result;
} else {
	$result = saveLineUp();
}

function saveLineUp()
{
	$idSquadra = $_REQUEST['idSquadra'];
	$giornataDiA = $_REQUEST['giornataDiA'];
	$idIncontro = $_REQUEST['idIncontro'];

	if (($fp = fopen("../../js/fcmFormazioniDati$giornataDiA.js", 'r+')) == false)
		return 'Impossibile aprire il file formazioni!';
	if (!flock($fp, LOCK_EX)) {
		return 'Impossibile bloccare il file formazioni!';
		fclose($fp);
	}

	$oldStaticLines = array();
	$oldLineUpsLines = array();
	while (!feof ($fp)) {
		$l = fgets($fp, 4096);
		if (!preg_match('/^a\[\d+\]=new Z\((\d+),(\d+),([^\)]+)\)/', $l, $regs)) array_push($oldStaticLines, $l);
		else if ($regs[1] != $idIncontro || $regs[2] != $idSquadra) array_push($oldLineUpsLines, "$regs[1],$regs[2],$regs[3]");
	}

	fseek($fp, 0);

	$i = 1;
	foreach($oldStaticLines as $l) if (trim($l) != '') fputs($fp, $l);
	foreach($oldLineUpsLines as $l) {
		fputs($fp, "a[$i]=new Z($l)\n");
		$i++;
	}
	$newLineUpsLines = explode('|', $_REQUEST['saveData']);
	foreach($newLineUpsLines as $l) {
		fputs($fp, "a[$i]=new Z($l)\n");
		$i++;
	}

	ftruncate($fp, ftell($fp));

	flock($fp, LOCK_UN);
	fclose($fp);
}

function sendMail()
{
	global $fantasquadra, $competizione, $lega;

	$mail = new PHPMailer();
	$mail->From = $_POST['sender'];
	$mail->FromName = '';
	$mail->Subject = $_POST['subject'];
	$mail->Body = stripslashes($_POST['body']);
	foreach (split('; ', $_POST['recipient']) as $add) $mail->AddAddress($add);

	return $mail->Send() ? '' : 'Errore durante durante l\'invio della e-mail!';
}

?>
