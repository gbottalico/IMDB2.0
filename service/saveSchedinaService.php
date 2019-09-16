<?php require (__DIR__.'/../business/newSchedinaBusiness.php') ?>

<?php 
$azione = $_REQUEST['azione'];
if ($azione == 'saveSchedina') {
    echo NewSchedinaBusiness::saveSchedina($_POST['idGiornata'], $_POST['schedina']);
}else if ($azione == 'saveCorrente') {
    echo NewSchedinaBusiness::saveCorrente($_REQUEST['idGiornata'], $_REQUEST['scadenza'] );
}else if ($azione == 'saveRisultati') {
    echo NewSchedinaBusiness::saveRisultati($_POST['idGiornata'], $_POST['risultati'] );
}

?>