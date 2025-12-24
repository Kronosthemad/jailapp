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
			const response = await fetch('/api/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});
			const data = await response.json();
			if (response.ok) {
				errEl.innerHTML = 'Signup successful!';
				// Redirect to login after signup
				setTimeout(() => window.location.href = 'login.html', 1000);
			} else {
				errEl.innerHTML = data.error || 'Signup failed';
			}
		} catch (error) {
			errEl.innerHTML = 'Network error';
		}
	});
});