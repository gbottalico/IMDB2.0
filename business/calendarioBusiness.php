<?php require (__DIR__.'/../utils/utils.php') ?>

<?php

class RigaCalendario {

	var $idCompetizione;
	var $competizione;
	var $idGiornata;
	var $giornata;
	var $idTurno;
	var $turno;
	var $giocata;
	var $squadraCasa;
	var $squadraFuori;
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
                $rigaCal->giocata = $riga[3];
                $rigaCal->idGiornata = $riga[5];                
                $rigaCal->giornata = ImdbUtils::getTurnoByCode($rigaCal->idGiornata);
                $rigaCal->idCompetizione = $riga[7];
                $rigaCal->competizione = ImdbUtils::getTurnoByCode($rigaCal->idCompetizione);
                $rigaCal->idTurno = str_replace('"',"",$riga[9]);
                $rigaCal->turno = ImdbUtils::getTurnoByCode($rigaCal->idTurno);
                $rigaCal->squadraCasa = ImdbUtils::getTurnoByCode($riga[15]);
                $rigaCal->squadraFuori = ImdbUtils::getTurnoByCode($riga[16]);
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