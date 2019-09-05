<?php
session_start();
?>
<html ng-app="IMDB">
	<head>
		<meta http-equiv="cache-control" content="max-age=0">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="-1">
		<meta http-equiv="expires" content="Tue, 01 Jan 1980 11:00:00 GMT">
		<meta http-equiv="pragma" content="no-cache">
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" viewport="">
		<title>IMDB</title>		
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="js/angular.min.js"></script>		
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-touch.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-sanitize.js"></script>
		<script src="js/jquery-ui.js"></script>
		<link rel="stylesheet" href="style/jquery-ui.structure.css">
		<link rel="stylesheet" href="style/jquery-ui.theme.css">
		<script src="js/interface.js"></script>
		<script src="js/javacrypt.js"></script>
		<script src="js/imdb.js"></script>			
	</head>
	<script type="text/javascript">
		<?php
			if (!array_key_exists("utente", $_SESSION)) {
				echo	"window.location = \"login.html\"";
			}
		?>
		document.write('<scr'+'ipt src="js/controller/schedinaController.js"?' + Math.random() + '"></scr'+'ipt>');
		document.write('<link rel="stylesheet" href="style/style_mobile.css?' + Math.random() + '">');
		document.write('<link rel="stylesheet" href="style/style_tablet.css?' + Math.random() + '">');
		document.write('<link rel="stylesheet" href="style/style.css?' + Math.random() + '">');

		function logout(){
			window.location = "logout.php";
		}
	</script>
	<body ng-controller="schedinaCtrl">
					<div id="infoUser">
						<?php
							echo "<p>SQUADRA: " . $_SESSION["utente"] ."</p>";
							echo "<p>CREDITI: " . $_SESSION["crediti"] ."</p>";
						?>
						<p onclick="logout()" style="cursor:pointer">Logout</p>
					</div>
                    <div id="tabs" style="display: none">
                            <ul>
                                <li ng-repeat="incontro in listaIncontri | unique:'idGiornata'">
                                    <a href="#tabs-{{incontro.idGiornata}}">{{incontro.idGiornata}}</a>
                                </li>
                            </ul>
                            <div ng-repeat="incontro in listaIncontri | unique:'idGiornata'" id="tabs-{{incontro.idGiornata}}" style="background-color: wheat;">
                                <table class="schedina">
                                    <tr ng-repeat="incontroGiornata in listaIncontri | filter:{ idGiornata: incontro.idGiornata }:true">
                                        <td style="text-align: right">{{incontroGiornata.squadraCasa}}</td>
                                        <td style="text-align: center">
                                                <img class="schedina-pron schedina-1 {{incontroGiornata.idPartita}}" id="{{incontroGiornata.idPartita}}-1" ng-click="pronostico(incontroGiornata.idPartita, '1')">&nbsp;
                                                <img class="schedina-pron schedina-X {{incontroGiornata.idPartita}}" id="{{incontroGiornata.idPartita}}-X" ng-click="pronostico(incontroGiornata.idPartita, 'X')">&nbsp;
                                                <img class="schedina-pron schedina-2 {{incontroGiornata.idPartita}}" id="{{incontroGiornata.idPartita}}-2" ng-click="pronostico(incontroGiornata.idPartita, '2')">
                                         </td>
                                        <td >{{incontroGiornata.squadraFuori}}</td>
                                    </tr>
                                </table>
                            </div>
            </div>

	</body>
</html>