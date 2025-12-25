// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the UI elements
    const usrInput = document.getElementById('usernm');
    const pwInput = document.getElementById('paswd');
    const accept = document.querySelector('input[type="submit"]');
    const errEl = document.getElementById('err');

    // Add a click event listener to the signup button
    accept.addEventListener('click', async (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Get and trim the username and password from the input fields
        const username = (usrInput.value || '').trim();
        const password = (pwInput.value || '').trim();

        // --- Input Validation ---
        if (!username) {
            errEl.innerHTML = 'Username Required';
            return;
        }
        if (username.length < 8) {
            errEl.innerHTML = 'Username must be at least 8 characters';
            return;
        }
        if (!password) {
            errEl.innerHTML = 'Password Required';
            return;
        }

        try {
            // --- API Call to Signup Endpoint ---
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            // --- Response Handling ---
            if (response.ok) {
                // If signup is successful, show a success message
                errEl.innerHTML = 'Signup successful! Redirecting to login...';
                // Redirect to the login page after a short delay
                setTimeout(() => window.location.href = '../pages/login.html', 1000);
            } else {
                // If signup fails, display the error message from the server
                errEl.innerHTML = data.error || 'Signup failed';
            }
        } catch (error) {
            // Handle network errors or other issues with the fetch call
            console.error('Network error during signup:', error);
            errEl.innerHTML = 'Network error. Please try again later.';
        }
    });
});