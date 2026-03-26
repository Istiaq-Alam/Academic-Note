
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
   TODAY COLUMN DETECTION
================================ */
function getTodayColumnIndex() {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = days[new Date().getDay()];

    let index = -1;
    // Scope query to the routine table to avoid scanning all <th> elements on the page
    const routineTable = document.querySelector('table');
    if (!routineTable) return index;

    routineTable.querySelectorAll("th").forEach((th, i) => {
        if (th.textContent.trim() === today) {
            th.classList.add("today");
            index = i + 1; // nth-child is 1-based
        }
    });

    return index;
}

const todayColumnIndex = getTodayColumnIndex();

/* ===============================
   CACHE TODAY'S CLASS CELLS
================================ */
// Query and parse once so the interval does not re-query the DOM or
// re-parse time strings on every tick.
const todayCells = todayColumnIndex !== -1
    ? Array.from(document.querySelectorAll(`tr td:nth-child(${todayColumnIndex})[data-start]`))
        .map(cell => ({
            el: cell,
            start: toSeconds(cell.dataset.start),
            end: toSeconds(cell.dataset.end),
        }))
    : [];

/* ===============================
   ACTIVE CLASS + SINGLE COUNTDOWN
================================ */
function updateClassStatus() {
    if (todayCells.length === 0) return;

    const now = new Date();
    const currentSeconds =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds();

    let alreadyActive = false; // 🔑 KEY FIX

    todayCells.forEach(({ el: cell, start, end }) => {

        // cleanup
        cell.classList.remove('active-class');
        const oldTimer = cell.querySelector('.countdown');
        if (oldTimer) oldTimer.remove();

        // allow ONLY ONE active cell
        if (!alreadyActive && currentSeconds >= start && currentSeconds <= end) {
            alreadyActive = true;

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
   INIT
================================ */
updateClassStatus();
setInterval(updateClassStatus, 1000);
