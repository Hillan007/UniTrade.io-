document.getElementById('registerButton').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!username || !email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    // Create a user object
    const user = {
        username: username,
        email: email,
        password: password
    };

    // For now, just log the user object to the console
    console.log(user);

    // You can add additional code here to send the user data to a server, etc.
});
