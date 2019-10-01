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
                 $updateSql = "UPDATE calendario SET RISULTATO = '$risultato' WHERE ID_PARTITA = $idp";
                 $result = mysqli_query($conn, $updateSql);
             }
            
        }catch (Exception $e) {
            return "KO";
        }finally{
            mysqli_close($conn);
        }
        return NewSchedinaBusiness::calcolaCrediti($idGiornata);
		
    }

    public static function calcolaCrediti($idGiornata) {
        try{
            
            //connection to the database
            $conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
            if (!$conn) {
                die("Connection failed: " . mysqli_connect_error());
            }
            
            $getSquadreSql = "select * from squadra";
            $result = mysqli_query($conn, $getSquadreSql);

            while ($row = mysqli_fetch_assoc($result)) {
                
                $idSq = $row['ID_SQUADRA'];
                //cancello crediti precedentemente calcolati per questa giornata
                 $deleteCreditiSql = "delete from crediti where ID_GIORNATA = $idGiornata and ID_SQUADRA =$idSq ";
                 mysqli_query($conn, $deleteCreditiSql);

                 $calcolaCreditiSql = "SELECT count(*)*2 as CREDITI FROM schedina INNER JOIN calendario on schedina.ID_GIORNATA = calendario.ID_GIORNATA and schedina.ID_PARTITA = calendario.ID_PARTITA and schedina.ID_SQUADRA =  $idSq and schedina.ID_GIORNATA = $idGiornata and schedina.RISULTATO = calendario.RISULTATO";
                 $result2 = mysqli_query($conn, $calcolaCreditiSql);
                 while ($row2 = mysqli_fetch_assoc($result2)) {
                    $cr =  $row2['CREDITI'];
                    if ($cr == 10) {
                        $cr = 15;
                    }
                    $insertCreditiSquadra="insert into crediti values ($idGiornata, $idSq, $cr)";
                    mysqli_query($conn, $insertCreditiSquadra);
                }
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