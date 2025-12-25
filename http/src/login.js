// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the UI elements
    const usrInput = document.getElementById('usernm');
    const pwInput = document.getElementById('paswd');
    const accept = document.querySelector('input[type="submit"]');
    const errEl = document.getElementById('err');

    // Add a click event listener to the login button
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
            // --- API Call to Login Endpoint ---
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            // --- Response Handling ---
            if (response.ok) {
                // If login is successful, redirect to the store page
                errEl.innerHTML = 'Login successful!';
                // Redirect after a short delay to allow the user to see the success message
                setTimeout(() => window.location.href = '../pages/store.html', 500);
            } else {
                // If login fails, display the error message from the server
                errEl.innerHTML = data.error || 'Login failed';
            }
        } catch (error) {
            // Handle network errors or other issues with the fetch call
            console.error('Network error during login:', error);
            errEl.innerHTML = 'Network error. Please try again later.';
        }
    });
});