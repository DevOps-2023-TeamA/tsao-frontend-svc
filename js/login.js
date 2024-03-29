// Authentication of TSAO users
async function sendAuthRequest() {
    // Get username and password values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Define data to be sent
    const data = {
        Username: username,
        Password: password
    };

    // Define request options
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };

    try {
        // Send request to server
        const response = await fetch(AUTH_SERVICE, requestOptions);

        // Handle successful login
        if (response.status === 202) {
            // Parse response data
            const resData = await response.json();
            console.log('Response:', resData);

            if (resData["IsApproved"] === false) {       // Handle unapproved accounts
                const outputHTML = 'Error: Your account has not been approved. Please contact the admin ';
                document.getElementById("error-message").innerHTML = outputHTML;
            } else {
                // Clear error message
                document.getElementById("error-message").innerHTML = '';
                // Show success message
                alert('Login successful.');

                // Set JWT token cookie
                setCookie('jwtToken',resData["Token"],30)
                
                // Store user data in session storage
                sessionStorage.setItem("ID", resData["ID"])
                sessionStorage.setItem("Name", resData["Name"])
                sessionStorage.setItem("Username", resData["Username"])
                sessionStorage.setItem("Role", resData["Role"])


                // Redirect to homepage
                window.location.href = "../index.html"
            }
        } else if (response.status === 401) {               // Handle incorrect username or password
            const outputHTML = 'Error: Incorrect username or password! Please try again.';
            document.getElementById("error-message").innerHTML = outputHTML;
        } else if (response.status === 500) {               // Handle non-existent account
            const outputHTML = 'Error: Account does not exist'
            document.getElementById("error-message").innerHTML = outputHTML;
        } else {                                            // Handle unexpected error
            const outputHTML = 'An unexpected error occured, please try again later.'
            document.getElementById("error-message").innerHTML = outputHTML;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Sets a cookie with a name, value, and number of days until expiration
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get cookie value by name
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Prevent default form submission
document.getElementById('loginButton').addEventListener('click', function (event) {
    event.preventDefault();
    sendAuthRequest();
});

document.getElementById('newAccountButton').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "../create-account.html";
});