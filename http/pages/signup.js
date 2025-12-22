const crypto = require('crypto');
const fs = require('fs');

document.addEventListener('DOMContentLoaded', () => {
	const usrInput = document.getElementById('usernm');
	const pwInput = document.getElementById('paswd');
	const accept = document.querySelector('input[type="submit"]');
	const errEl = document.getElementById('err');

	accept.addEventListener('click', (e) => {
		e.preventDefault();
		const usr = (usrInput.value || '').trim();
		const pw = (pwInput.value || '').trim();

		if (!usr) {
			errEl.innerHTML = 'UserName Required';
			return;
		}
		if (usr.length < 8) {
			errEl.innerHTML = 'username too short';
			return;
		}

		const hash = crypto.createHash('sha256');
		hash.update(usr + pw);
		const digest = hash.digest('hex');

		const outfile = './' + Math.random().toString(36).slice(2) + '.txt';
		fs.writeFile(outfile, digest, (err) => {
			if (err) {
				console.error(err);
				errEl.innerHTML = 'Error saving';
			} else {
				errEl.innerHTML = 'Saved';
			}
		});
	});
});