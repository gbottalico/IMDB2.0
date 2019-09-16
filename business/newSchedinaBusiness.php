<?php
session_start();
?>
<?php require (__DIR__.'/../utils/utils.php') ?>

<?php


class NewSchedinaBusiness {


	public static function saveSchedina($idGiornata, $schedina) {
        try{
            $idSq = $_SESSION["idSquadra"];
            //connection to the database
            $conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
            if (!$conn) {
                die("Connection failed: " . mysqli_connect_error());
            }

            //cancello i risultati precedentemente inseriti per la giornata
            $deleteSql = "DELETE FROM schedina WHERE ID_GIORNATA = $idGiornata and ID_SQUADRA = $idSq";
            $result = mysqli_query($conn, $deleteSql);
            
            $sc =  json_decode(json_encode($schedina), true);
            foreach($sc as $value) {
                $idp = $value['idPartita'];
                $pron = $value['pronostico'];
                $insertSql = "INSERT INTO schedina VALUES ($idGiornata, $idp, $idSq, '$pron')";
                $result = mysqli_query($conn, $insertSql);
            }
        }catch (Exception $e) {
            return "KO";
        }finally{
            mysqli_close($conn);
        }
        
        return "OK";
		
    }

    public static function saveCorrente($idGiornata, $scadenza) {
        try{
            
            //connection to the database
            $conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
            if (!$conn) {
                die("Connection failed: " . mysqli_connect_error());
            }

            //cancello i risultati precedentemente inseriti per la giornata
            $updateAllSql = "UPDATE giornata SET CORRENTE = 'N'";
            $result = mysqli_query($conn, $updateAllSql);
            
            $updateGiornata = "UPDATE giornata SET CORRENTE = 'S', SCADENZA = '$scadenza' WHERE ID_GIORNATA = $idGiornata";
            $result = mysqli_query($conn, $updateGiornata);
            
        }catch (Exception $e) {
            return "KO";
        }finally{
            mysqli_close($conn);
        }
        
        return "OK";
		
    }
    
    
    public static function saveRisultati($idGiornata, $risultati) {
        try{
            
            //connection to the database
            $conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
            if (!$conn) {
                die("Connection failed: " . mysqli_connect_error());
            }
            
            $ris =  json_decode(json_encode($risultati), true);
            foreach($ris as $value) {
                $idp = $value['idPartita'];
                $risultato = $value['risultato'];
                $updateSql = "UPDATE calendario SET RISULTATO = $ris WHERE ID_PARTITA = $idp";
                $result = mysqli_query($conn, $updateSql);
            }
            
        }catch (Exception $e) {
            return "KO";
        }finally{
            mysqli_close($conn);
        }
        
        return "OK";
		
	}


}

?>