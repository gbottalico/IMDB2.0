<?php require (__DIR__.'/../utils/utils.php') ?>

<?php

class RigaProposta {

	var $idProposta;
	var $squadraSrc;
	var $squadraDst;
	var $creditiSrc;
	var $creditiDst;
	var $giocatoriSrc;
	var $giocatoriDst;				

	function RigaProposta() {
	}		
}

class MercatoBusiness {

	/*
	*	Inserisce una nuova proposta di scambio
	*/
	public static function insertProposta($idSquadraA, $idSquadraB, $creditiA, $creditiB, $giocatoriA, $giocatoriB, $messaggio) {
		
		echo 'Giocatori Dare = ' . implode(",", $giocatoriA);
		echo 'Giocatori Avere = ' . implode(",", $giocatoriB);
		echo 'Messaggio ' . $messaggio;

		//connection to the database
		$conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
		if (!$conn) {
    		die("Connection failed: " . mysqli_connect_error());
		}

		//execute the SQL query and return records
		$sqlProposta = "INSERT INTO PROPOSTA VALUES (null, $idSquadraA, $idSquadraB, $creditiA, $creditiB, '" . implode(',', $giocatoriA) . "', '" . implode(',', $giocatoriB) . "', '" . $messaggio . "', null)";

		if (!mysqli_query($conn, $sqlProposta)) {
		  die('Error: ' . mysqli_error($conn));
		} else {
			$proposta_id = mysqli_insert_id($conn);
		}

		echo 'Creata proposta ' . $proposta_id;
		
		//close the connection
		mysqli_close($conn);			
	}

	/*
	*	Salva la risposta della proposta (0 = RIFIUTATA, 1 = ACCETTATA)
	*/
	public static function esitoProposta($idProposta, $esito) {
	
		//connection to the database
		$conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
		if (!$conn) {
    		die("Connection failed: " . mysqli_connect_error());
		}				

		//execute the SQL query and return records		
		$sql = "UPDATE PROPOSTA SET esito = $esito WHERE id_proposta = $idProposta";
		if (!mysqli_query($conn, $sql)) {
		  die('Error: ' . mysqli_error($conn));
		}

		if ($esito == 1) {
			// Rifiuto automaticamente tutte le altre proposte che contenevano qualcuno dei giocatori inclusi nello scambio appena accettato
			$selSql = "SELECT GIOCATORI_A, GIOCATORI_B FROM PROPOSTA WHERE ID_PROPOSTA = $idProposta";
			$selRes = mysqli_query($conn, $selSql);
			while ($row = mysqli_fetch_assoc($selRes)) {
				$giocA = explode(",", $row['GIOCATORI_A']);
				$giocB = explode(",", $row['GIOCATORI_B']);
				foreach ($giocA as $value) {
					$delSql = "UPDATE PROPOSTA SET ESITO = 0 WHERE ID_PROPOSTA <> $idProposta AND ESITO IS NULL AND (GIOCATORI_A LIKE '%," . $value . "%' OR GIOCATORI_B LIKE '%," . $value . "%' OR GIOCATORI_A LIKE '%" . $value . ",%' OR GIOCATORI_B LIKE '%" . $value . ",%' OR GIOCATORI_A = $value OR GIOCATORI_B = $value)";
					if (!mysqli_query($conn, $delSql)) {
					  die('Error: ' . mysqli_error($conn));
					}
				}
				foreach ($giocB as $value) {
					$delSql = "UPDATE PROPOSTA SET ESITO = 0 WHERE ID_PROPOSTA <> $idProposta AND ESITO IS NULL AND (GIOCATORI_A LIKE '%," . $value . "%' OR GIOCATORI_B LIKE '%," . $value . "%' OR GIOCATORI_A LIKE '%" . $value . ",%' OR GIOCATORI_B LIKE '%" . $value . ",%' OR GIOCATORI_A = $value OR GIOCATORI_B = $value)";
					if (!mysqli_query($conn, $delSql)) {
					  die('Error: ' . mysqli_error($conn));
					}
				}
			}
		}		
				
		//close the connection
		mysqli_close($conn);
		return "";	
	}

	/*
	*	Recupera le proposte ricevute dalla squadra ancora in attesa di risposta (esito = null)
	*/
	public static function getProposteRicevute($idSquadra) {

		$proposte = array();

		//connection to the database
		$conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
		if (!$conn) {
    		die("Connection failed: " . mysqli_connect_error());
		}

		//execute the SQL query and return records		
		$sql = "SELECT `ID_PROPOSTA`, `ID_SQUADRA_A`, `CREDITI_A`,`CREDITI_B`,`GIOCATORI_A`,`GIOCATORI_B` FROM `PROPOSTA` WHERE `ID_SQUADRA_B` = $idSquadra AND `ESITO` IS NULL";
		$result = mysqli_query($conn, $sql);

		//fetch tha data from the database 
		while ($row = mysqli_fetch_assoc($result)) {
			$rigaPr = new RigaProposta();
			$rigaPr->idProposta = $row['ID_PROPOSTA'];	
			$rigaPr->squadraSrc = $row['ID_SQUADRA_A'];
			$rigaPr->squadraDst = $idSquadra;
			$rigaPr->creditiA = $row['CREDITI_A'];
			$rigaPr->creditiB = $row['CREDITI_B'];
			$rigaPr->giocatoriA = $row['GIOCATORI_A'];
			$rigaPr->giocatoriB = $row['GIOCATORI_B'];
			array_push($proposte, $rigaPr);
		}
						
		//close the connection
		mysqli_close($conn);

		return json_encode($proposte);					
	}

	/*
	*	Recupera le proposte fatte dalla squadra ancora in attesa di risposta (esito = null)
	*/
	public static function getProposteFatte($idSquadra) {

		$proposte = array();

		//connection to the database
		$conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
		if (!$conn) {
    		die("Connection failed: " . mysqli_connect_error());
		}

		//execute the SQL query and return records		
		$sql = "SELECT `ID_PROPOSTA`, `ID_SQUADRA_B`, `CREDITI_A`,`CREDITI_B`,`GIOCATORI_A`,`GIOCATORI_B` FROM `PROPOSTA` WHERE `ID_SQUADRA_A` = $idSquadra AND `ESITO` IS NULL";
		$result = mysqli_query($conn, $sql);

		//fetch tha data from the database 
		while ($row = mysqli_fetch_assoc($result)) {
			$rigaPr = new RigaProposta();
			$rigaPr->idProposta = $row['ID_PROPOSTA'];	
			$rigaPr->squadraSrc = $idSquadra;
			$rigaPr->squadraDst = $row['ID_SQUADRA_B'];
			$rigaPr->creditiA = $row['CREDITI_A'];
			$rigaPr->creditiB = $row['CREDITI_B'];
			$rigaPr->giocatoriA = $row['GIOCATORI_A'];
			$rigaPr->giocatoriB = $row['GIOCATORI_B'];
			array_push($proposte, $rigaPr);
		}
						
		//close the connection
		mysqli_close($conn);

		return json_encode($proposte);					
	}

}	

?>