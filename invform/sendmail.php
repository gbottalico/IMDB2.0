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

$result = gatherData();
$result = sendMail();
$result = saveLineUp();

function saveLineUp()
{
	$idSquadra = $_REQUEST['idSquadra'];
	$giornataDiA = $_REQUEST['giornataDiA'];
	$idIncontro = $_REQUEST['idIncontro'];

	if (($fp = fopen("../js/fcmFormazioniDati$giornataDiA.js", 'r+')) == false)
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


function gatherData()
{
	global $fantasquadra, $competizione, $lega;

	$body = explode("\n", stripslashes($_REQUEST['body']));
	list($null, $competizione, $null) = explode(', ', $_REQUEST['subject'], 3);
	if (preg_match('/^Lega: (.+)$/', $body[0], $regs)) $lega = $regs[1];
	if (preg_match('/^Squadra: (.+)$/', $body[1], $regs)) $fantasquadra = $regs[1];
}

function sendMail()
{
	global $fantasquadra, $competizione, $lega;

	$mail = new PHPMailer();
	$mail->From = $_REQUEST['sender'];
	$mail->FromName = '';
	$mail->Subject = $_REQUEST['subject'];
	$mail->Body = stripslashes($_REQUEST['body']);
	foreach (split('; ', $_REQUEST['recipient']) as $add) $mail->AddAddress($add);

	return $mail->Send() ? '' : 'Errore durante durante l\'invio della e-mail!';
}

function checkPassword()
{
	$username = $_REQUEST['username'];
	$password = $_REQUEST['password'];

	if (($fp = fopen('../js/fcmInvioFormazioneDati.js', 'rt')) == false)
		return 'File password non trovato!';

	$found = false;
	while (!feof ($fp) && !$found) {
		$buffer = fgets($fp, 4096);
		$found = ereg('^a=passwords;', $buffer);
	}

	if (!$found)
		return 'File password non valido!';

	$found = false;
	$passwords = array();
	while (!feof ($fp) && !$found) {
		$buffer = fgets($fp, 4096);
		if ($buffer == "\n")
			$found = true;
		else {
			$result = ereg('a\[(.+)\]=\"(.+)\"', $buffer, $regs);
			if ($result) $passwords[$regs[1]] = $regs[2];
		}
	}

	if (crypt($password, 'jd') != $passwords[$username])
		return 'Password non valida!';

	return '';
}

?>
