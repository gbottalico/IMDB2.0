<?php
// Start the session
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
		<!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>-->	
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery-ui.js"></script>
		<link rel="stylesheet" href="style/jquery-ui.structure.css">
		<link rel="stylesheet" href="style/jquery-ui.theme.css">
		<script src="js/angular.min.js"></script>		
		<!--<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-touch.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-sanitize.js"></script>-->
		<script src="js/angular-touch.js"></script>
		<script src="js/angular-sanitize.js"></script>
		<script src="js/interface.js"></script>
		<script src="js/imdb.js"></script>		
		<script src="js/controller/homeController.js"></script>
		<link rel="stylesheet" href="style/style.css">	
		<link rel="stylesheet" href="style/style_mobile.css">
		<link rel="stylesheet" href="style/style_tablet.css">		
		
		<script type="text/javascript">
			$(function(){
				//initializeMenu();
				<?php
					if (array_key_exists("utente", $_SESSION)) {
						echo	"window.location = \"schedina.php\"";
					}else{
						echo	"window.location = \"login.html\"";
					}
				?>
			})
		</script>
	</head>
	<body>		
		<div id="wrapper">
			<!--<ul class="menu">
				<li tabindex="1" class="" style="display: none">
			      <span class="title" id="menuClassifica">CLASSIFICA</span> 
			    </li>
			    <li tabindex="1" class="" style="display: none">
			      <span class="title" id="menuSquadre">ROSE</span> 
			    </li>
			    <li tabindex="1" class="">
			      <span class="title" id="menuInvForm">SCHEDINA</span> 
			    </li>
			    <li tabindex="1" class="" style="display: none">
			      <span class="title" id="menuCalendario" style="display: none">CALENDARIO</span> 
			    </li>
			    <li tabindex="1" style="display: none"> 
			      <span class="title" id="menuProbabili" style="display: none">PROBABILI FORMAZIONI</span>
			    </li>
			    <li tabindex="1" style="display: none"> 
			      <span class="title" id="menuVotiAssist" style="display: none">VOTI E ASSIST</span>
			    </li>
			    <li tabindex="1"> 
			      <span class="title" id="menuStatistiche">STATISTICHE</span>
			    </li>
			    <li tabindex="1" style="display: none">  
			      <span class="title" id="menuMercato" style="display: none">MERCATO</span>
			    </li>
			    <li tabindex="1" class="imdb-no-mobile" ng-controller="HomeCtrl" ng-show="finito"> 			    	
                	<table style="float: left; margin-left: 10%;">
                  		<tr>
                    		<td background="http://imalatidelbari.netsons.org/img/tt.png">
                    			<div id="bestm"><img ng-src="{{top}}" height='75px' /></div>
                    			<div id="topm"><img src="http://imalatidelbari.netsons.org/img/topm.png"></div>
                  			</td>                  			                		                  		
              				<td background="http://imalatidelbari.netsons.org/img/tt.png">              					
                  				<div id="peggm"><img ng-src="{{flop}}" height='75px' /></div>
                  				<div id="flopm"><img src="http://imalatidelbari.netsons.org/img/flopm.png"></div>
                			</td>
              			</tr>
              		</table>
			    </li>
			</ul>						   
	  	</div>-->
	
	</body>
</html>