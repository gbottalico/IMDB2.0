<?php
session_start();
?>
<?php require (__DIR__.'/../utils/utils.php') ?>

<?php
class Squadra {

    var $idSquadra;
	var $nome;
    var $creditiIniziali;
    var $creditiSchedina;

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
                $squadra->creditiIniziali = $row['CREDITI'];
                $sql2 = "SELECT sum(CREDITI) as CRED FROM  crediti WHERE ID_SQUADRA = $squadra->idSquadra";
                $result2 = mysqli_query($conn, $sql2);

                while ($row2 = mysqli_fetch_assoc($result2)) { 
                    $squadra->creditiSchedina = $row2['CRED'];
                }
                $_SESSION["idSquadra"] = $squadra->idSquadra;
                $_SESSION["utente"] = $squadra->nome;
                $_SESSION["creditiIniziali"] = $squadra->creditiIniziali;
                $_SESSION["creditiSchedina"] = $squadra->creditiSchedina;
                $_SESSION["is_admin"] = $row['IS_ADMIN'];
                
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