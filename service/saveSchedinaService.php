<?php require (__DIR__.'/../business/newSchedinaBusiness.php') ?>

<?php echo NewSchedinaBusiness::saveSchedina($_POST['idGiornata'], $_POST['schedina']) ?>