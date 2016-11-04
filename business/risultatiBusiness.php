<?php require (__DIR__.'/../utils/utils.php') ?>
<?php require (__DIR__.'/../Excel/reader.php') ?>

<?php

class RisultatiBusiness {

	/*
	*	Popola l'oggetto per stampare la schedina
	*/
	public static function checkRisultati() {
		$giornataVoti = ImdbUtils::getProssimaGiornata();
		$numeroGiornata = $giornataVoti - 1;
		$urlFile = voti_file . ($numeroGiornata);			
		set_time_limit(0); 
		$file = file_get_contents($urlFile);
		file_put_contents('Voti' . $numeroGiornata . '.xls', $file);
		$data = new Spreadsheet_Excel_Reader();
		$data->setOutputEncoding('CP1251'); // Set output Encoding.				
		$data->read('Voti' . $numeroGiornata . '.xls');
		$celle = $data->sheets[0]['cells'];
		error_reporting(E_ALL ^ E_NOTICE);		
		$i = 0;
		$j = 2;
		$votoImmobile = 0;
		while ($i < 300) {
			if ($celle[$i][$j] == 'IMMOBILE C.') {
				$votoImmobile = ($celle[$i][33] + $celle[$i][34]) / 2;
			}
			$i++;		
		}		
        return $votoImmobile;
	}
}

?>