<?php require '../utils/costanti.php' ?>
<?php

class ImdbUtils {    

    	private static $initialized = false;
    	private static $idCampionato = "";

    	/*
    	*	Recupera l'id del campionato
    	*/
	    private static function initialize() {
	    	if (self::$initialized) {
	    		return;
	    	}
	    	$lines = file(host . js_folder . competizioni_file);

			// Ciclo per trovare l'id del campionato
			foreach($lines as $line_num => $line) {
			    if (strpos($line,']=new Competizione(') !== false) {
			    	$riga = explode(",", $line);    	
			    	if ($riga[1] == '"Campionato"') {
			    		self::$idCampionato = $riga[3];
			    		break;
			    	}
			    }
			}	        
	    	self::$initialized = true;
	    }
        
        /*
        *	Restituisce l'id del campionato
        */        
        public static function getIdCampionato() {
        	self::initialize();				
			return self::$idCampionato;
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