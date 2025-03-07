<?php
// Database connection setup
$host = "localhost";
$user = "root"; // Default WAMP username
$pass = "";     // Default WAMP password is empty
$db = "victor"; // The database name you created

$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['signUp'])) {
        // Sanitize and capture form inputs
        $firstName = $conn->real_escape_string($_POST['fName']);
        $lastName = $conn->real_escape_string($_POST['lName']);
        $email = $conn->real_escape_string($_POST['email']);
        $password = $_POST['password'];

        // Hash the password securely
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Check if the email already exists
        $checkEmail = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $checkEmail->bind_param("s", $email);
        $checkEmail->execute();
        $result = $checkEmail->get_result();

        if ($result->num_rows > 0) {
            echo "Email Address Already Exists!";
        } else {
            // Insert the new user into the database
            $insertQuery = $conn->prepare("INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)");
            $insertQuery->bind_param("ssss", $firstName, $lastName, $email, $hashedPassword);

            if ($insertQuery->execute()) {
                echo "User registered successfully!";
            } else {
                echo "Error: " . $conn->error;
            }
        }

        $checkEmail->close();
        $insertQuery->close();
    }
}

// Close the database connection
$conn->close();
