<?php
session_start();
?>
<?php require (__DIR__.'/../utils/utils.php') ?>

<?php
class Squadra {

    var $idSquadra;
	var $nome;
	var $crediti;
    

	function Squadra() {		
	}
}

class LoginBusiness {

    public static function login($user, $pwd) {
        
		
		//connection to the database
		$conn = mysqli_connect(mysql_host, mysql_user, mysql_pwd, mysql_db);
		if (!$conn) {
    		die("Connection failed: " . mysqli_connect_error());
		}

		//execute the SQL query and return records		
        $sql = "SELECT * FROM squadra WHERE lower(USERNAME) = lower('$user') and lower(PASSWORD) = lower('$pwd')";
		if ($result = mysqli_query($conn, $sql)){
            $num_rows = mysqli_num_rows($result);
            if ($num_rows > 0){ 
                //fetch tha data from the database 
                $row = mysqli_fetch_assoc($result);
                $squadra = new Squadra();
                $squadra->idSquadra = $row['ID_SQUADRA'];
                $squadra->nome = $row['NOME'];
                $squadra->crediti = $row['CREDITI'];
                $_SESSION["idSquadra"] = $squadra->idSquadra;
                $_SESSION["utente"] = $squadra->nome;
                $_SESSION["crediti"] = $squadra->crediti;
                //close the connection
                mysqli_close($conn);
                return "OK";
            }else{
                //close the connection
                mysqli_close($conn);
                return "KO";
            }
        }else{
            //close the connection
            mysqli_close($conn);
            return "KO" ;
        }
					
	}
}	

?>