<?php require 'costanti.php' ?>

<?php

class ImdbUtils {    
    	    	   
        /*
        *	Restituisce l'id del campionato
        */        
        public static function getIdCampionato() {
        	$lines = file(host . js_folder . competizioni_file);

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

    	/*
    	*	Restituisce l'url del logo della squadra passata in input
    	*/
    	public static function getLogoImageUrl($squadra) {
    		return host . img_folder . loghi_folder . $squadra . '.gif';
    	}    

    	/*
    	*	Restituisce l'url della foto dell' allenatore della squadra passata in input
    	*/
    	public static function getCoachImageUrl($squadra) {
    		return host . img_folder . allenatori_folder . $squadra . '.png';
    	}
}

?>