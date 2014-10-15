<?php require (__DIR__.'/../utils/utils.php') ?>

<?php

class RigaCalendario {

    var $idPartita;
	var $idCompetizione;
	var $competizione;
    var $logoCompetizione;
	var $idGiornata;
	var $giornata;
	var $idTurno;
	var $turno;
	var $giocata;
	var $squadraCasa;
	var $squadraFuori;
    var $logoCasa;
    var $logoFuori;
	var $golCasa;
	var $golFuori;
	var $puntiCasa;
	var $puntiFuori;
	var $modCasa;
	var $modFuori;
	var $totaleCasa;
	var $totaleFuori;    

	function RigaCalendario() {		
	}
}

class CalendarioBusiness {

	/*
	*	Popolo il calendario
	*/
    public static function getCalendario() {
    	$calendario = array();
    	$lines = file(host . js_folder . calendario_file);
            
        foreach($lines as $line_num => $line) {
            if (strpos($line,']=new I(') !== false) {                
                $riga = explode(",", $line);                
                $rigaCal = new RigaCalendario();
                $rigaCal->idPartita = substr($riga[0], strpos($riga[0], '(') + 1);
                $rigaCal->giocata = $riga[3];
                $rigaCal->idGiornata = $riga[5];                
                $rigaCal->giornata = $riga[10];
                $rigaCal->idCompetizione = $riga[8];
                $rigaCal->competizione = trim(ImdbUtils::getTurnoByCode($riga[7]));
                $rigaCal->logoCompetizione = ImdbUtils::getCompetizioneImageUrl($rigaCal->idCompetizione);
                $rigaCal->idTurno = str_replace('"',"",$riga[9]);
                $rigaCal->turno = trim(ImdbUtils::getTurnoByCode($rigaCal->idTurno));
                $rigaCal->squadraCasa = trim(ImdbUtils::getTurnoByCode($riga[15]));
                $rigaCal->squadraFuori = trim(ImdbUtils::getTurnoByCode($riga[16]));
                $rigaCal->logoCasa = ImdbUtils::getLogoImageUrl($rigaCal->squadraCasa);            
                $rigaCal->logoFuori = ImdbUtils::getLogoImageUrl($rigaCal->squadraFuori);            
                $rigaCal->golCasa = $riga[17];
                $rigaCal->golFuori = $riga[18];
                $rigaCal->puntiCasa = $riga[19];
                $rigaCal->puntiFuori = $riga[20];
                $rigaCal->totaleCasa = $riga[21];
                $rigaCal->totaleFuori = $riga[22];                
                $rigaCal->modCasa = $rigaCal->totaleCasa - $rigaCal->puntiCasa;
                $rigaCal->modFuori = $rigaCal->totaleFuori - $rigaCal->puntiFuori;
                array_push($calendario, $rigaCal);
            }              
        }
        return json_encode($calendario);
    }
}	

?>