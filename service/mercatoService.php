<?php require (__DIR__.'/../business/mercatoBusiness.php') ?>

<?php 
 	MercatoBusiness::insertProposta($_POST[idSquadraA], $_POST[idSquadraB], $_POST[creditiA], $_POST[creditiB], '$_POST[giocatoriA]', '$_POST[giocatoriB]'); 
 ?>