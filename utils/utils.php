<?php require 'costanti.php' ?>

<?php

class RigaNome {
    var $codice;
    var $nome;

    function RigaNome() {                
    }
}

class RigaFormazione {
    var $partita;
    var $codice;
    var $squadra;
    var $nome;
    var $nomeAbbreviato;    
    var $squadraDiA;
    var $ruolo;
    var $titolare;
    var $voto;
    var $bonusMalus;
    var $votoTotale;

    function RigaFormazione() {        
    }
}

class RigaIncontroA {
    var $giornata;
    var $squadra;
    var $avversario;
}

class RigaMedie {
    var $codiceGiocatore;
    var $media;
    var $fantamedia;
}

class ImdbUtils {    

        private static $initializedSerieA = false;
        private static $initializedDettSerieA = false;
        private static $initializedCalendario = false;
        private static $initializedIncontri = false;
        private static $idCampionato = 0;
        private static $prossimaGiornata = 0;
        private static $nomi = array();
        private static $giocatori = array();
        private static $turni = array();
        private static $passwords = array();
        private static $incontri = array();        
        private static $medie = array();

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
        *   Inizializza l'array dei prossimi incontri
        */
        private static function initializeIncontri() {
            if (self::$initializedIncontri) {
              return;
            }
            $lines = file(host . js_folder . incontri_file);
            
            foreach($lines as $line_num => $line) {
                // passwords
                if (strpos($line,']="') !== false) {                
                    $pwd = explode("=", $line);
                    array_push(self::$passwords, substr($pwd[1], 1, strlen($pwd[1]) - 4));
                }
                // calendario serie A
                if (strpos($line, 'new Array') !== false) {
                    $riga = explode(",", $line);
                    if (count($riga) > 7) {
                        for ($i = 1; $i < 39; $i++) {
                            $inc = new RigaIncontroA();
                            $inc->giornata = $i;
                            $inc->squadra = substr($riga[0], 2, (strpos($riga[0], ']') - 2));
                            $inc->avversario = $riga[$i];
                            array_push(self::$incontri, $inc);
                        }                        
                    }
                }
                // fantamedie
                if (strpos($line, 'new ifG') !== false) {
                    $riga = explode(",", $line);
                    $dati = explode("%", $riga[5]);                                        
                    $med = new RigaMedie();
                    $med->codiceGiocatore = 'xg' . $riga[1];
                    $med->media = substr($dati[0], 1);
                    $med->fantamedia = $dati[2];
                    array_push(self::$medie, $med);                    
                }
            }           
            self::$initializedIncontri = true;
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
                return 'images/Scudetto.png';               
            } else {
                return 'images/Coppa.png';
            }
        }

        /*
        *   Restituisce il nome del giocatore identificato dal codice passato in input
        */
        public static function getPlayerNameByCode($code) {
            self::initializeSerieA();
            foreach (self::$nomi as $nome) {
                if ($nome->codice == $code) {
                    return trim($nome->nome);
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

        /*
        *   Restituisce il nome del giocatore abbreviato (COGNOME + INIZIALI NOMI)
        */
        public static function getNomeAbbreviato($nome) {
            $riga = explode(" ", $nome);
            $nomeAbbreviato = "";
            for ($i = 0; $i < count($riga); $i++) {
                if (ctype_upper(str_replace("'", "", $riga[$i]))) {
                    $nomeAbbreviato .= $riga[$i] . ' ';
                } else {
                    $nomeAbbreviato .= ' ' . substr($riga[$i], 0, 1);
                }                
            }
            return $nomeAbbreviato;
        }

        /*
        *   Restituisce il nome dell'avversario della prossima giornata
        */
        public static function getAvversario($giornata, $squadra) {
            self::initializeIncontri();            
            foreach (self::$incontri as $incontro) {                            
                if ($incontro->giornata == $giornata && 'xa' . $incontro->squadra == $squadra) {
                    $nomeAvversario = ImdbUtils::getPlayerNameByCode('xa' . $incontro->avversario % 100);
                    return $incontro->avversario >= 100 ? $nomeAvversario : strtoupper($nomeAvversario);
                }
            }
        }

        /*
        *   Calcola la prossima giornata da giocare
        */  
        public static function getProssimaGiornata() {
            if (self::$prossimaGiornata == 0) {            
                $lines = file(host . js_folder . calendario_file);            
                foreach($lines as $line_num => $line) {
                    if (strpos($line,'new I') !== false) {                
                        $riga = explode(",", $line);
                        if ($riga[3] == 0) {
                            self::$prossimaGiornata = $riga[10];
                            break;
                        }
                    }
                }
            }
            return self::$prossimaGiornata;
        }

        /*
        *   Recupera la media voto del giocatore
        */
        public static function getMediaVoto($giocatore) {
            self::initializeIncontri();            
            foreach (self::$medie as $media) {                            
                if ($media->codiceGiocatore == $giocatore) {                    
                    return str_replace('"', '', $media->media);
                }
            }
        }

         /*
        *   Recupera la fantamedia voto del giocatore
        */
        public static function getFantamediaVoto($giocatore) {
            self::initializeIncontri();            
            foreach (self::$medie as $media) {                            
                if ($media->codiceGiocatore == $giocatore) {                    
                    return $media->fantamedia;
                }
            }
        }

        /*
        *   Verifica che la password inserita sia corretta
        */
        public static function getPassword($squadra) {
            self::initializeIncontri();
            $password = self::$passwords[($squadra-1)];
            return $password;
        }

        /*
        *   Recupera la data di scadenza per l'invio delle prossime formazioni
        */
        public static function getTermineInvio() {
            $lines = file(host . js_folder . variabili_file);
            $dataTermine = "";            
            foreach($lines as $line_num => $line) {
                if (strpos($line,'var TermineInviog') !== false) {                
                    $riga = explode("=", $line);                    
                    $dataTermine .= substr($riga[1], 2, strlen($riga[1]) - 4) . '/';
                } else if (strpos($line,'var TermineInviomm') === false && strpos($line,'var TermineInviom') !== false) {                
                    $riga = explode("=", $line);                    
                    $dataTermine .= substr($riga[1], 2, strlen($riga[1]) - 4) . '/';
                } else if (strpos($line,'var TermineInvioa') !== false) {                
                    $riga = explode("=", $line);                    
                    $dataTermine .= substr($riga[1], 2, strlen($riga[1]) - 4) . ' ';
                } else if (strpos($line,'var TermineInviohh') !== false) {                
                    $riga = explode("=", $line);                    
                    $dataTermine .= substr($riga[1], 2, strlen($riga[1]) - 4) . ':';
                } else if (strpos($line,'var TermineInviomm') !== false) {              
                    $riga = explode("=", $line);                    
                    $dataTermine .= substr($riga[1], 2, strlen($riga[1]) - 4);
                }
            }            
            return $dataTermine;
        }

        /*
        *   Ritorna l'ora attuale nel formato dd/MM/yyyy hh:mm
        */
        public static function getNow() { 
            return date('d').'/'.date('m').'/'.date('Y').' '.date('H').':'.date('i');
        }
}

?>