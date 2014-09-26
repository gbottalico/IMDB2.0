<?php require '../utils/utils.php' ?>

<?php

class RigaClassifica{
	var $squadra;
    var $allenatore;
    var $punti;
    var $logo;
    var $foto;

	function RigaClassifica() {
	}
	
	
}

$lines = file(host . js_folder . classifica_file);
$squadraClassifica = array();

// Ciclo attraverso l'array, si visualizzerà il sorgente come html ed i numeri di linea
print "<table class=\"class_table\">";
print "<th>Posizione</th><th>Squadra</th><th>Allenatore</th><th>Punti</th><th>Logo</th><th>Foto</th>";
$counter = 0;
foreach($lines as $line_num => $line) {
    if (strpos($line,']=new C(') !== false){
    	$riga = explode(",", $line);        
    	if ($riga[1] == ImdbUtils::getIdCampionato()){
            print "<tr><td>" . ++$counter . "</td>";
    		$rigaClas = new RigaClassifica(); 
            print "<td>";           
    		$rigaClas->squadra = str_replace('"',"",$riga[4]);
            print $rigaClas->squadra . "</td>";
            print "<td>";
            $rigaClas->allenatore = str_replace('"', "", $riga[5]);
            print $rigaClas->allenatore . "</td>";
            print "<td>";
            $rigaClas->punti = str_replace('"', "", $riga[6]);
            print $rigaClas->punti . "</td>";
            print "<td>";
            $rigaClas->logo = ImdbUtils::getLogoImageUrl($rigaClas->squadra);
            print "<img src=\"" . $rigaClas->logo . "\" style=\"width: 20%; height: 20%\"/></td>";
            print "<td>";
            $rigaClas->foto = ImdbUtils::getCoachImageUrl($rigaClas->squadra);
            print "<img src=\"" . $rigaClas->foto . "\" style=\"width: 20%; height: 20%\"/></td>";
    		array_push($squadraClassifica, $rigaClas);
            print "</tr>";
    	}
    }
}
print "</table>";

?>

