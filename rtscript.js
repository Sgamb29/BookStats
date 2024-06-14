
const startPageEl = document.getElementById("startPage");
const totalPagesEL = document.getElementById("totalPages");
const output = document.getElementById("output");

const spaceBarChoice = document.getElementById("space");
const tapChoice = document.getElementById("tap");

let detectMethod = "spacebar";

spaceBarChoice.addEventListener("click", () => {
    if (spaceBarChoice.checked) {
        detectMethod = "spacebar";
    }
});

tapChoice.addEventListener("click", () => {
    if (tapChoice.checked) {
        detectMethod = "tap";
    }
});

let currentPage = 0;
let totalPages = 0;
let startSeconds = 0;
let elapsedSeconds = 0;
let pagesLeft = 0;

let isTrackingStarted = false;

const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)

function startTracking() {
    if (isNumeric(startPageEl.value) && isNumeric(totalPagesEL.value) && !isTrackingStarted) {
        currentPage = parseInt(startPageEl.value);
        totalPages = parseInt(totalPagesEL.value);
        pagesLeft = totalPages - currentPage;
        startSeconds = Date.now() / 1000;
        output.innerText = "Tracking Started!";
        isTrackingStarted = true;
    }

    
}

function calculateStats() {
    elapsedSeconds = Date.now() / 1000 - startSeconds;
    currentPage += 1;
    pagesLeft -= 1;
    let timeLeft = elapsedSeconds * pagesLeft / 60;
    let hoursLeft = parseInt(timeLeft / 60);
    let minutesLeft = timeLeft - hoursLeft * 60;
    let pagesPerMin = (1 / (elapsedSeconds / 60)).toFixed(2);
    output.innerText = "Current Pages Per Minute: " + (pagesPerMin).toString() + " Time Left To Finish Book: " + hoursLeft + " Hours and " + parseInt(minutesLeft) + " Minutes";
    startSeconds = Date.now() / 1000;

}

document.addEventListener("keydown", (key) => {
    if (key.key == " " && startSeconds != 0 && detectMethod == "spacebar") {
        calculateStats();

    }
});

document.addEventListener("click", (ev) => {
    if (startSeconds != 0 && detectMethod == "tap") {        
        calculateStats();
    }
});
