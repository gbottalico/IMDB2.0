<?php require (__DIR__.'/../utils/utils.php') ?>

<?php
	
	class RigaGiocatore {

		var $idFcm;
		var $codice;
		var $nome;
		var $ruolo;
		var $squadraDiA;		
		var $prezzo;
		var $idSquadra;
		var $foto;

		function RigaGiocatore() {
		}		
	}

	class RigaSquadra {

		var $idSquadra;
		var $nome;
		var $presidente;
		var $mail;
		var $creditiResidui;
		var $rosa;		

		function RigaSquadra() {			
		}
	}

	class SquadraBusiness {

		/*
	     *  Restituisce un JSONArray contenente la lista di squadre
	    */
	    public static function getSquadre() {
	    	$squadre = array();
	    	$giocatori = array();       
	        $lines = file(host . js_folder . squadre_file);
	        foreach($lines as $line_num => $line) {
	        	if (strpos($line,']=new F(') !== false) {
	                $riga = explode(",", $line);
	                $rigaSq = new RigaSquadra();
	                $rigaSq->idSquadra = substr($riga[0], strpos($riga[0], '(') + 1);
	                $rigaSq->nome = str_replace('"',"",$riga[1]);
	                $rigaSq->presidente = str_replace('"',"",$riga[2]);
	                $rigaSq->mail = str_replace('"',"",$riga[6]);
	                $rigaSq->creditiResidui = substr($riga[8], 0, strlen($riga[8]) - 2);                
	                array_push($squadre, $rigaSq);
	            } else if (strpos($line,']=new R(') !== false) {
	            	$riga = explode(",", $line);
	            	if ($riga[5] == 0) { // Aggiungo solo i giocatori non svincolati
	            		$rigaPl = new RigaGiocatore();
	            		$rigaPl->codice = $riga[2];
	            		$rigaPl->nome = ImdbUtils::getPlayerNameByCode($rigaPl->codice);
	            		$rigaPl->ruolo = $riga[1];
	            		$rigaPl->prezzo = $riga[7];
	            		$rigaPl->idFcm = ImdbUtils::getPlayerIdByCode($riga[2]);
	            		$rigaPl->foto = ImdbUtils::getPlayerImageUrl($rigaPl->idFcm);
	            		$rigaPl->squadraDiA = ImdbUtils::getPlayerNameByCode($riga[3]);
	            		$rigaPl->idSquadra = substr($riga[0], strpos($riga[0], '(') + 1);
	            		array_push($giocatori, $rigaPl);
	            	}            	
	            }
	        }	        	       
	        foreach ($squadre as $sq) {	        	
	        	$rosa_squadra = array();
	        	foreach ($giocatori as $pl) {	        		
	        		if ($sq->idSquadra == $pl->idSquadra) {	        			
	        			array_push($rosa_squadra, $pl);
	        		}
	        	}
	        	$sq->rosa = $rosa_squadra;
	        }
	        return json_encode($squadre);
		}
	}
?>