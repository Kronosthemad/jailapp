document.addEventListener('DOMContentLoaded', () => {
    const usrInput = document.getElementById('usernm');
    const pwInput = document.getElementById('paswd');
    const accept = document.querySelector('input[type="submit"]');
    const errEl = document.getElementById('err');
    accept.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = (usrInput.value || '').trim();
        const password = (pwInput.value || '').trim();

        if (!username) {
            errEl.innerHTML = 'Username Required';
            return;
        }
        if (username.length < 8) {
            errEl.innerHTML = 'Username too short';
            return;
        }

        try {
            console.log('Attempting login for:', username);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            if (response.ok) {
                window.location.href = 'store.html';
                console.log('Redirecting to store now');
                errEl.innerHTML = 'Login successful!';
            } else {
                errEl.innerHTML = data.error || 'Login failed';
            }
        } catch (error) {
            console.error('Network error:', error);
            errEl.innerHTML = 'Network error';
        }
    });
});