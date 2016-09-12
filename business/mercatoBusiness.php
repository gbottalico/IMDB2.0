<?php require (__DIR__.'/../utils/utils.php') ?>

<?php

class MercatoBusiness {

	/*
	*	Inserisce una nuova proposta di scambio
	*/
	public static function insertProposta($idSquadraA, $idSquadraB, $creditiA, $creditiB, $giocatoriA, $giocatoriB) {
	
		//connection to the database
		$conn = mysql_connect(mysql_host, mysql_user, mysql_pwd) 
		 or die("Unable to connect to MySQL");		

		//select a database to work with
		$selected = mysql_select_db(mysql_db, $conn) 
		  or die("Could not select " . mysql_db . ": " . mysql_error());

		//execute the SQL query and return records
		$sql = "INSERT INTO PROPOSTA VALUES (null, $idSquadraA, $idSquadraB, $creditiA, $creditiB, null)";

		if (!mysql_query($sql, $conn)) {
		  die('Error: ' . mysql_error());
		}
		
		//fetch tha data from the database 
		//while ($row = mysql_fetch_array($result)) {
		//   echo "ID:".$row{'id_proposta'}."<br>";
		//}
		//close the connection
		mysql_close($conn);	
	}

	/*
	*	Salva la risposta della proposta
	*/
	public static function esitoProposta($idProposta, $esito) {
	
		//connection to the database
		$conn = mysql_connect(mysql_host, mysql_user, mysql_pwd) 
		 or die("Unable to connect to MySQL");		

		//select a database to work with
		$selected = mysql_select_db(mysql_db, $conn) 
		  or die("Could not select " . mysql_db . ": " . mysql_error());

		//execute the SQL query and return records		
		$sql = "UPDATE PROPOSTA SET esito = $esito WHERE id_proposta = $idProposta";
		if (!mysql_query($sql, $conn)) {
		  die('Error: ' . mysql_error());
		}
				
		//close the connection
		mysql_close($conn);	
	}

}	

?>