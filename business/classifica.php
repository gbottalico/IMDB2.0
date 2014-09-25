<?php

class RigaClassifica{
	var $squadra;

	function RigaClassifica() {
	}
	
	
}

$lines = file('../../js/fcmClassificaDati.js');
// Ciclo attraverso l'array, si visualizzerà il sorgente come html ed i numeri di linea
foreach($lines as $line_num => $line) {
    if (strpos($line,']=new C(') !== false){
    	$riga = explode(",", $line);
    	if ($riga[1] == '14'){
    		$rigaClas = new RigaClassifica();
    		$rigaClas->squadra = str_replace('"',"",$riga[4]);
    		echo json_encode($rigaClas);
    	}
    	
    	
    }
}

?>