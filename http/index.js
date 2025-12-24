document.getElementById('tester')?.addEventListener('click', function() {
    alert('This Is Just A Test!');
});

function displayDate() {
    const el = document.getElementById('time');
    if (el) el.innerHTML = String(new Date());
}
setInterval(displayDate, 1000);
