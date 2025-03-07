<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    echo "Received: Name = $name, Email = $email";
} else {
    echo "Only POST requests are accepted.";
}
?>
