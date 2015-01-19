<?php require (__DIR__.'/../utils/utils.php') ?>
<?php require (__DIR__.'/../Excel/reader.php') ?>

<?php

class RigaSchedina {
	var $giornata;
	var $punti;
}

class RigaSquadra {
	var $idSquadra;	
	var $puntiGuadagnati;
	var $creditiResidui;
	var $creditiAcquisiti;
	var $totaleCrediti;
}

class SchedinaBusiness {

	/*
	*	Popola l'oggetto per stampare la schedina
	*/
	public static function getSchedina() {
		$data = new Spreadsheet_Excel_Reader();
		$data->setOutputEncoding('CP1251'); // Set output Encoding.
		$data->read(host . 'schedina.xls');
		$celle = $data->sheets[0]['cells'];
		error_reporting(E_ALL ^ E_NOTICE);
		$squadreSchedina = array();
		$i = 12;
		$j = 7;
		$rigaResidui = 189;
		$rigaAcquisiti = 190;
		$rigaTotale = 191;		
		$countSquadra = 1;
		while ($j < 44) {
			$squadra = new RigaSquadra();
			$squadra->idSquadra = $countSquadra;
			$squadra->creditiResidui = $celle[$rigaResidui][(4*($countSquadra - 1) + 7)];
			$squadra->creditiAcquisiti = $celle[$rigaAcquisiti][(4*($countSquadra - 1) + 7)];
			$squadra->totaleCrediti = $celle[$rigaTotale][(4*($countSquadra - 1) + 7)];
			$arrayPunti = array();		
			while ($i < 186) {				
				$rigaPunti = new RigaSchedina();
				$rigaPunti->giornata = $celle[$i][1];
				$rigaPunti->punti = $celle[$i][$j];
				array_push($arrayPunti, $rigaPunti);
				$i = $i + 6;
			}
			$squadra->puntiGuadagnati = $arrayPunti;
			array_push($squadreSchedina, $squadra);
			$countSquadra++;
			$j = $j + 4;
			$i = 12;
		}		
        return json_encode($squadreSchedina);
	}
}

?>