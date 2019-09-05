
<?php
// Start the session
session_start();
?>
<?php
    // remove all session variables
    session_unset();

    // destroy the session
    session_destroy();
?>
<html>
    <head>
    <script type="text/javascript">
        window.location = "login.html";
    </script>
    </head>
</html>