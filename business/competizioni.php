<?php

class Competizione {    

    	private static $initialized = false;
    	private static $idCampionato = "";

	    private static function initialize() {
	    	if (self::$initialized) {
	    		return;
	    	}
	    	$lines = file('http://imalatidelbari.netsons.org/js/fcmCompetizioniDati.js');

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
        
        public static function getIdCampionato() {
        	self::initialize();				
			return self::$idCampionato;
    	}
}

?>