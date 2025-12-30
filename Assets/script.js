
/* ===============================
   UTILITIES
================================ */
function toSeconds(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 3600 + m * 60;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

/* ===============================
   ACTIVE CLASS + COUNTDOWN
================================ */
function updateClassStatus() {
    const now = new Date();
    const currentSeconds =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds();

    document.querySelectorAll('td[data-start]').forEach(cell => {
        const start = toSeconds(cell.dataset.start);
        const end = toSeconds(cell.dataset.end);

        // cleanup
        cell.classList.remove('active-class');
        const oldTimer = cell.querySelector('.countdown');
        if (oldTimer) oldTimer.remove();

        // active class
        if (currentSeconds >= start && currentSeconds <= end) {
            cell.classList.add('active-class');

            const remaining = end - currentSeconds;
            const timer = document.createElement('div');
            timer.className = 'countdown';
            timer.textContent = `Ends in ${formatTime(remaining)}`;
            cell.appendChild(timer);
        }
    });
}

/* ===============================
   TODAY COLUMN HIGHLIGHT
================================ */
function highlightTodayColumn() {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = days[new Date().getDay()];

    document.querySelectorAll("th").forEach((th, index) => {
        if (th.textContent.trim() === today) {
            th.classList.add("today");

            document.querySelectorAll(`tr td:nth-child(${index + 1})`)
                .forEach(td => td.classList.add("today"));
        }
    });
}

/* ===============================
   INIT
================================ */
highlightTodayColumn();
updateClassStatus();
setInterval(updateClassStatus, 1000); // live countdown

