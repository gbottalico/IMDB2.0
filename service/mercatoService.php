<?php require (__DIR__.'/../business/mercatoBusiness.php') ?>

<?php 
	$post = file_get_contents('php://input');
	$data = json_decode($post);
	if ($data && $data->azione == 'richiediScambio') {
		MercatoBusiness::insertProposta($data->squadraSrc, $data->squadraDst, $data->soldiDare, $data->soldiAvere, $data->playerDare, $data->playerAvere, $data->messaggio); 
	} else {
		$azione = $_REQUEST['azione'];
		if ($azione == 'getProposteRicevute') {
			$squadra = $_REQUEST['squadra'];
			echo MercatoBusiness::getProposteRicevute($squadra);
		} else if ($azione == 'getProposteFatte') {
			$squadra = $_REQUEST['squadra'];
			echo MercatoBusiness::getProposteFatte($squadra);
		} else {
			$proposta = $_REQUEST['proposta'];
			if ($azione == 'rifiutaProposta') {				
				echo MercatoBusiness::esitoProposta($proposta, 0);
			} else if ($azione == 'accettaProposta') {		
				echo MercatoBusiness::esitoProposta($proposta, 1);		
			}
		}
	}	
 ?>