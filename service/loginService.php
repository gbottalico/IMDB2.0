<?php require (__DIR__.'/../business/loginBusiness.php') ?>

<?php echo LoginBusiness::login($_POST['user'], $_POST['pwd']) ?>