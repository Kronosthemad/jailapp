const crypto = require('crypto');

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

        // Here you would normally send 'digest' to the server for verification
        // For demonstration, we will just display a success message
        errEl.innerHTML = 'Login attempted with hash: ' + digest;
    });
});