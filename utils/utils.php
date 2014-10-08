<?php require 'costanti.php' ?>

<?php

class RigaNome {
    var $codice;
    var $nome;

    function RigaNome() {                
    }
}

class ImdbUtils {    

        private static $initializedSerieA = false;
        private static $initializedDettSerieA = false;
        private static $initializedCalendario = false;
        private static $idCampionato = 0;
        private static $nomi = array();
        private static $giocatori = array();
        private static $turni = array();        

        /*
        *   Inizializza l'array dei nomi di squadre e giocatori una sola volta per sessione
        */
        private static function initializeSerieA() {
            if (self::$initializedSerieA) {
              return;
            }
            $lines = file(host . js_folder . serie_a_file);

            // Ciclo per trovare l'id del campionato
            foreach($lines as $line_num => $line) {                
                $riga = explode("=", $line);
                if ($riga[0] != 'MaxA') {
                    $nom = new RigaNome();                
                    $nom->codice = $riga[0];
                    $nom->nome = str_replace('"', '', $riga[1]);
                    array_push(self::$nomi, $nom);                
                } else {
                    break;
                }                
            }           
            self::$initializedSerieA = true;
        }

        /*
        *   Inizializza l'array dei codici dei giocatori
        */
        private static function initializeDettSerieA() {
            if (self::$initializedDettSerieA) {
              return;
            }
            $lines = file(host . js_folder . serie_a_dett_file);
            
            foreach($lines as $line_num => $line) {
                if (strpos($line, 'GiocatoreA') !== false) {
                    $riga = explode(",", $line);                    
                    $nom = new RigaNome();                
                    $nom->codice = substr($riga[0], strpos($riga[0], '(') + 1);
                    $nom->nome = $riga[3];                    
                    array_push(self::$giocatori, $nom);                                    
                }                        
            }           
            self::$initializedDettSerieA = true;
        }

        /*
        *   Inizializza l'array dei nomi di competizioni e giornate una sola volta per sessione
        */
        private static function initializeCalendario() {
            if (self::$initializedCalendario) {
              return;
            }
            $lines = file(host . js_folder . calendario_file);
            
            foreach($lines as $line_num => $line) {
                if (strpos($line,'var x') !== false) {                
                    $riga = explode("=", $line);                
                    $nom = new RigaNome();
                    $nom->codice = str_replace('var ', '', $riga[0]);
                    $nom->nome = str_replace('"', '', $riga[1]);
                    array_push(self::$turni, $nom);                              
                }              
            }           
            self::$initializedCalendario = true;
        }

        /*
        *	Restituisce l'id del campionato
        */        
        public static function getIdCampionato() {

            if (self::$idCampionato == 0) {
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
            }
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

        /*
        *   Restituisce l'url della foto del giocatore passato in input
        */
        public static function getPlayerImageUrl($player) {
            return host . img_folder . foto_folder . $player . '.jpg';
        }

        /*
        *   Restituisce l'url del logo della squadra passata in input
        */
        public static function getSquadraImageUrl($squadra) {
            return host . img_folder . loghi_folder . scudetti_folder . $squadra . '.png';
        } 

        /*
        *   Restituisce l'url dell'immagine della competizione
        */        
        public static function getCompetizioneImageUrl($comp) {            
            if ($comp == self::getIdCampionato()) {
                return '/images/Scudetto.png';               
            } else {
                return '/images/Coppa.png';
            }
        }

        /*
        *   Restituisce il nome del giocatore identificato dal codice passato in input
        */
        public static function getPlayerNameByCode($code) {
            self::initializeSerieA();
            foreach (self::$nomi as $nome) {
                if ($nome->codice == $code) {
                    return $nome->nome;
                }
            }            
        }

        /*
        *   Restituisce l'id FCM del giocatore in base al suo codice
        */
        public static function getPlayerIdByCode($code) {            
            self::initializeDettSerieA();
            foreach (self::$giocatori as $nome) {                
                if ($nome->codice == str_replace('xg', '', $code)) {
                    return $nome->nome;
                }
            }
        }   

        /*
        *   Restituisce il nome della competizione/turno identificato dal codice passato in input
        */
        public static function getTurnoByCode($code) {
            self::initializeCalendario();
            foreach (self::$turni as $nome) {
                if ($nome->codice == $code) {
                    return $nome->nome;
                }
            }            
        }
}

?>