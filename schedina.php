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
		<script src="js/jquery.min.js"></script>
		<script src="js/angular.min.js"></script>		
		<script src="js/angular-touch.js"></script>
		<script src="js/angular-sanitize.js"></script>
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
								<div class="scadenza" >
									<p data-ng-show="incontro.idGiornata == giornataCorrente.idGiornata">SCADENZA: {{giornataCorrente.scadenza}}<p>
									<p style="color: red" data-ng-show=" incontro.idGiornata == giornataCorrente.idGiornata && invioScaduto">STATO: SCADUTO</p>
									<p style="color: green" data-ng-show="incontro.idGiornata == giornataCorrente.idGiornata && !invioScaduto">STATO: IN CORSO</p>
									<?php
										if ($_SESSION["is_admin"] == "S"){
									?>
										<p data-ng-click="inserisciRisultato(incontro.idGiornata)">Inserisci Risultati</p>
										<input type="checkbox" data-ng-disabled="incontro.idGiornata == giornataCorrente.idGiornata" data-ng-checked="incontro.idGiornata == giornataCorrente.idGiornata" data-ng-click="chiediScadenza(incontro.idGiornata)"/>Corrente<br/>
									<?php
										}
									?>
								</div>
								
                                <table class="schedina" data-ng-show="!inserimentoRisultati">
                                    <tr ng-repeat="incontroGiornata in listaIncontri | filter:{ idGiornata: incontro.idGiornata }:true">
                                        <td style="text-align: right">{{incontroGiornata.squadraCasa}}</td>
										<td style="text-align: center" data-ng-show="!invioScaduto && incontro.idGiornata == giornataCorrente.idGiornata">
												<img class="schedina-pron schedina-1 {{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato_ins == '1' ? 'selected' : ''" id="{{incontroGiornata.idPartita}}-1" ng-click="pronostico(incontroGiornata.idPartita, '1')">&nbsp;
                                                <img class="schedina-pron schedina-X {{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato_ins == 'X' ? 'selected' : ''" id="{{incontroGiornata.idPartita}}-X" ng-click="pronostico(incontroGiornata.idPartita, 'X')">&nbsp;
                                                <img class="schedina-pron schedina-2 {{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato_ins == '2' ? 'selected' : ''" id="{{incontroGiornata.idPartita}}-2" ng-click="pronostico(incontroGiornata.idPartita, '2')">
										 </td>
										 <td style="text-align: center; opacity: .5;" data-ng-show="invioScaduto || incontro.idGiornata != giornataCorrente.idGiornata">
												<img class="schedina-pron schedina-1 {{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato_ins == '1' ? 'selected' : ''" id="{{incontroGiornata.idPartita}}-1" >&nbsp;
                                                <img class="schedina-pron schedina-X {{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato_ins == 'X' ? 'selected' : ''" id="{{incontroGiornata.idPartita}}-X">&nbsp;
                                                <img class="schedina-pron schedina-2 {{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato_ins == '2' ? 'selected' : ''" id="{{incontroGiornata.idPartita}}-2">
                                         </td>
                                        <td >{{incontroGiornata.squadraFuori}}</td>
									</tr>
									<tr data-ng-show="!invioScaduto && incontro.idGiornata == giornataCorrente.idGiornata">
										<td></td>
										<td style="text-align: center"><button class="save" ng-disabled="!invioEnabled" data-ng-click="inviaSchedina()">SALVA</button></td>
										<td></td>
									</tr>	
                                </table>
								<table class="schedina" data-ng-show="inserimentoRisultati">
                                    <tr ng-repeat="incontroGiornata in listaIncontri | filter:{ idGiornata: incontro.idGiornata }:true">
                                        <td style="text-align: right">{{incontroGiornata.squadraCasa}}</td>
										<td style="text-align: center">
												<img class="schedina-pron schedina-1 esatto-{{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato == '1' ? 'selected' : ''" id="esatto-{{incontroGiornata.idPartita}}-1" ng-click="risultatoEsatto(incontroGiornata.idPartita, '1')">&nbsp;
                                                <img class="schedina-pron schedina-X esatto-{{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato == 'X' ? 'selected' : ''" id="esatto-{{incontroGiornata.idPartita}}-X" ng-click="risultatoEsatto(incontroGiornata.idPartita, 'X')">&nbsp;
                                                <img class="schedina-pron schedina-2 esatto-{{incontroGiornata.idPartita}}" ng-class="incontroGiornata.risultato == '2' ? 'selected' : ''" id="esatto-{{incontroGiornata.idPartita}}-2" ng-click="risultatoEsatto(incontroGiornata.idPartita, '2')">
										 </td>
                                        <td >{{incontroGiornata.squadraFuori}}</td>
									</tr>
									<tr>
										<td></td>
										<td style="text-align: center"><button class="save" ng-disabled="!salvaEnabled" data-ng-click="inviaRisultatiEsatti(incontro.idGiornata)">SALVA E CALCOLA</button></td>
										<td></td>
									</tr>	
                                </table>
                            </div>
            </div>
			<div id="dialogScadenza" style="overflow: hidden; display:none; text-align: center">
				<input data-ng-model="scadenzaInvio" type="text" placeholder="YYYY-MM-DD hh:mi"/>
				<button class="salva" data-ng-click="salvaCorrente()">Salva</div>
			</div>								
	</body>
</html>