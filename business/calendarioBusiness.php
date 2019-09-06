<?php
session_start();
?>
<?php require (__DIR__.'/../utils/utils.php') ?>

<?php

class RigaCalendario {

    var $idPartita;
	var $idGiornata;
	var $squadraCasa;
	var $squadraFuori;
    var $risultato;
    var $risultato_ins;    

	function RigaCalendario() {		
	}
}

class GiornataCorrente {

    var $idGiornata;
	var $scadenza;
	var $corrente; 

	function GiornataCorrente() {		
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
                $rigaCal->idSquadraCasa = $riga[11];
                $rigaCal->idSquadraFuori = $riga[12];
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

    /*
    *   Popolo la prossima giornata
    */
    /*public static function getProssimaGiornata() {
        $calendario = array();
        $lines = file(host . js_folder . calendario_file);
        $prossima = ImdbUtils::getProssimaGiornata();
            
        foreach($lines as $line_num => $line) {
            if (strpos($line,']=new I(') !== false) {                
                $riga = explode(",", $line);
                if ($prossima == $riga[10]) {
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
                    $rigaCal->idSquadraCasa = $riga[11];
                    $rigaCal->idSquadraFuori = $riga[12];
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
        }
        return json_encode($calendario);
    }*/

    public static function getProssimaGiornata() {
        $idSq = $_SESSION["idSquadra"];
		$calendario = array();

		//connection to the database
		$conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
		if (!$conn) {
    		die("Connection failed: " . mysqli_connect_error());
		}

		//execute the SQL query and return records		
		$sql = "SELECT A.ID_PARTITA AS ID_PARTITA, A.ID_GIORNATA AS ID_GIORNATA, A.SQUADRA_CASA AS SQUADRA_CASA, A.SQUADRA_TRAS AS SQUADRA_TRAS, A.RISULTATO AS RISULTATO, B.RISULTATO AS RIS_INS FROM calendario A LEFT JOIN schedina B ON A.ID_GIORNATA = B.ID_GIORNATA AND A.ID_PARTITA = B.ID_PARTITA AND B.ID_SQUADRA = $idSq ORDER BY A.ID_GIORNATA, A.ID_PARTITA";
		$result = mysqli_query($conn, $sql);

		//fetch tha data from the database 
		while ($row = mysqli_fetch_assoc($result)) {
			$rigaCal = new RigaCalendario();
            $rigaCal->idGiornata = $row['ID_GIORNATA'];
            $rigaCal->idPartita = $row['ID_PARTITA'];
            $rigaCal->squadraCasa = $row['SQUADRA_CASA'];
            $rigaCal->squadraFuori = $row['SQUADRA_TRAS'];
            $rigaCal->risultato = $row['RISULTATO'];
            $rigaCal->risultato_ins = $row['RIS_INS'];
            array_push($calendario, $rigaCal);
		}
						
		//close the connection
		mysqli_close($conn);

		return json_encode($calendario);					
    }
    
    public static function getGiornataCorrente() {
        
		//connection to the database
		$conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
		if (!$conn) {
    		die("Connection failed: " . mysqli_connect_error());
		}

		//execute the SQL query and return records		
		$sql = "SELECT ID_GIORNATA, DATE_FORMAT(SCADENZA, '%d/%m/%Y %k:%i') as SCADENZA, CORRENTE FROM giornata WHERE CORRENTE = 'S'";
		$result = mysqli_query($conn, $sql);
        $giornata = new GiornataCorrente();
		//fetch tha data from the database 
		while ($row = mysqli_fetch_assoc($result)) {
            $giornata->idGiornata = $row['ID_GIORNATA'];
            $giornata->scadenza = $row['SCADENZA'];
            $giornata->corrente = $row['CORRENTE'];
		}
						
		//close the connection
		mysqli_close($conn);

		return json_encode($giornata);					
	}
}	

?>