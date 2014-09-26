<?php require 'competizioni.php' ?>
<?php

class RigaClassifica{
	var $squadra;
    var $allenatore;
    var $punti;

	function RigaClassifica() {
	}
	
	
}

$lines = file('http://imalatidelbari.netsons.org/js/fcmClassificaDati.js');
$squadraClassifica = array();

// Ciclo attraverso l'array, si visualizzerà il sorgente come html ed i numeri di linea
foreach($lines as $line_num => $line) {
    if (strpos($line,']=new C(') !== false){
    	$riga = explode(",", $line);        
    	if ($riga[1] == Competizione::getIdCampionato()){
    		$rigaClas = new RigaClassifica();
    		$rigaClas->squadra = str_replace('"',"",$riga[4]);
            $rigaClas->allenatore = str_replace('"', "", $riga[5]);
            $rigaClas->punti = str_replace('"', "", $riga[6]);
    		array_push($squadraClassifica, $rigaClas);
    	}
    }
}

echo json_encode($squadraClassifica);

?>