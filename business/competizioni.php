<?php

class Competizione {
    public function getIdCampionato() {
        $idCampionato = "";
		$lines = file('http://imalatidelbari.netsons.org/js/fcmCompetizioniDati.js');

		// Ciclo per trovare l'id del campionato
		foreach($lines as $line_num => $line) {
		    if (strpos($line,']=new Competizione(') !== false) {
		    	$riga = explode(",", $line);    	
		    	if ($riga[1] == '"Campionato"') {
		    		$idCampionato = $riga[3];
		    		break;
		    	}
		    }
		}		
		return $idCampionato;
    }
}

?>