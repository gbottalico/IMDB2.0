<?php require (__DIR__.'/../utils/utils.php') ?>

<?php 	
	$tipo = $_REQUEST['tipo'];
	if ($tipo == 'top') {
		echo ImdbUtils::getTopMister();
	} else if ($tipo == 'flop') {
		echo ImdbUtils::getFlopMister();
	}
?>