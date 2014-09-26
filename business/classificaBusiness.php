<?php require (__DIR__.'/../utils/utils.php') ?>

<?php

class RigaClassifica {

	var $squadra;
    var $allenatore;
    var $punti;
    var $logo;
    var $foto;

	function RigaClassifica() {
	}	
	
}

class ClassificaBusiness {        

    /*
    *   Restituisce un JSONArray contenente la classifica attuale
    */
    public static function getClassifica() {
        $squadraClassifica = array();
        // Ciclo attraverso l'array, si visualizzerà il sorgente come html ed i numeri di linea
        $lines = file(host . js_folder . classifica_file);
        $counter = 0;
        foreach($lines as $line_num => $line) {
            if (strpos($line,']=new C(') !== false){
                $riga = explode(",", $line);        
                if ($riga[1] == ImdbUtils::getIdCampionato()){            
                    $rigaClas = new RigaClassifica();             
                    $rigaClas->squadra = str_replace('"',"",$riga[4]);            
                    $rigaClas->allenatore = str_replace('"', "", $riga[5]);            
                    $rigaClas->punti = str_replace('"', "", $riga[6]);            
                    $rigaClas->logo = ImdbUtils::getLogoImageUrl($rigaClas->squadra);            
                    $rigaClas->foto = ImdbUtils::getCoachImageUrl($rigaClas->squadra);            
                    array_push($squadraClassifica, $rigaClas);            
                }
            }
        }
        return json_encode($squadraClassifica);
    }
}

?>