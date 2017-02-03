<?php require (__DIR__.'/schedinaBusiness.php') ?>

<?php
	
	class RigaGiocatore {

		var $idFcm;
		var $codice;
		var $nome;
		var $nomeAbbr;
		var $ruolo;
		var $squadraDiACod;
		var $squadraDiA;		
		var $prezzo;
		var $idSquadra;
		var $foto;
		var $squadraDiAfoto;
		var $mediaVoto;
		var $fantamediaVoto;
		var $prossimoAvversario;

		function RigaGiocatore() {
		}		
	}

	class RigaSquadra {

		var $idSquadra;
		var $nome;
		var $logo;
		var $presidente;
		var $foto;
		var $mail;
		var $creditiResidui;
		var $creditiTotali;
		var $password;
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
	                $rigaSq->nome = trim(str_replace('"',"",$riga[1]));	                
	                $rigaSq->logo = ImdbUtils::getLogoImageUrl($rigaSq->nome);
	                $rigaSq->presidente = str_replace('"',"",$riga[2]);
	                $rigaSq->foto = ImdbUtils::getCoachImageUrl($rigaSq->nome);
	                $rigaSq->mail = str_replace('"',"",$riga[6]);
	                $creditiResiduiSquadra = substr($riga[8], 0, strlen($riga[8]) - 2);
	                $creditiAcquisitiSquadra = SchedinaBusiness::getSchedinaSquadra($rigaSq->idSquadra); 
	                $rigaSq->creditiResidui = $creditiResiduiSquadra;
	                $rigaSq->creditiTotali =  $creditiResiduiSquadra + $creditiAcquisitiSquadra; 
	                $rigaSq->password = ImdbUtils::getPassword($rigaSq->idSquadra);	                
	                array_push($squadre, $rigaSq);
	            } else if (strpos($line,']=new R(') !== false) {
	            	$riga = explode(",", $line);
	            	if ($riga[5] == 0) { // Aggiungo solo i giocatori non svincolati
	            		$rigaPl = new RigaGiocatore();
	            		$rigaPl->codice = $riga[2];
	            		$rigaPl->nome = trim(ImdbUtils::getPlayerNameByCode($rigaPl->codice));
	            		$rigaPl->nomeAbbr = ImdbUtils::getNomeAbbreviato($rigaPl->nome);
	            		$rigaPl->ruolo = $riga[1];
	            		$rigaPl->prezzo = $riga[7];
	            		$rigaPl->idFcm = ImdbUtils::getPlayerIdByCode($riga[2]);
	            		$rigaPl->foto = ImdbUtils::getPlayerImageUrl($rigaPl->idFcm);
	            		$rigaPl->squadraDiACod = trim($riga[3]);
	            		$rigaPl->squadraDiA = trim(ImdbUtils::getPlayerNameByCode($riga[3]));
	            		$rigaPl->squadraDiAfoto = ImdbUtils::getSquadraImageUrl(strtolower($rigaPl->squadraDiA));
	            		$rigaPl->idSquadra = substr($riga[0], strpos($riga[0], '(') + 1);
	            		$rigaPl->mediaVoto = ImdbUtils::getMediaVoto($rigaPl->codice);
	            		$rigaPl->fantamediaVoto = ImdbUtils::getFantamediaVoto($rigaPl->codice);
	            		$rigaPl->prossimoAvversario = ImdbUtils::getAvversario(ImdbUtils::getProssimaGiornata(), $riga[3]);
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