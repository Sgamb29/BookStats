
const startPageEl = document.getElementById("startPage");
const totalPagesEL = document.getElementById("totalPages");
const pagesTickNum = document.getElementById("pagesTickNum");
const output = document.getElementById("output");

const spaceBarChoice = document.getElementById("space");
const tapChoice = document.getElementById("tap");

let detectMethod = "spacebar";

const tapZone = document.getElementById("tapZone");


spaceBarChoice.addEventListener("click", () => {
    if (spaceBarChoice.checked) {
        detectMethod = "spacebar";
        tapZone.hidden = true;
    }
});

tapChoice.addEventListener("click", () => {
    if (tapChoice.checked) {
        detectMethod = "tap";
        tapZone.hidden = false;
    }
});

let currentPage = 0;
let totalPages = 0;
let startSeconds = 0;
let elapsedSeconds = 0;
let pagesLeft = 0;
let pagesPerTick = 0;

let isTrackingStarted = false;

const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)

function startTracking() {
    if (isNumeric(startPageEl.value) && isNumeric(totalPagesEL.value) && isNumeric(pagesTickNum.value) && !isTrackingStarted) {
        currentPage = parseInt(startPageEl.value);
        totalPages = parseInt(totalPagesEL.value);
        pagesPerTick = parseInt(pagesTickNum.value);
        pagesLeft = totalPages - currentPage;
        startSeconds = Date.now() / 1000;
        output.innerText = "Tracking Started!\n\n";
        isTrackingStarted = true;
        if (detectMethod == "tap") {
            tapStartDelay();
        }
    } else if (!isTrackingStarted) {
        output.innerText = "Start Page, Total Pages, and Pages Per Press Need To Be Filled Out!\n";
    }

    
}

function calculateStats() {
    elapsedSeconds = Date.now() / 1000 - startSeconds;
    currentPage += 1;
    pagesLeft -= 1;
    let timeLeft = elapsedSeconds * pagesLeft / 60;
    let hoursLeft = parseInt(timeLeft / 60);
    let minutesLeft = timeLeft - hoursLeft * 60;
    let pagesPerMin = (pagesPerTick / (elapsedSeconds / 60)).toFixed(2);
    output.innerText = "Current Pages Per Minute: " + (pagesPerMin).toString() + " Time Left To Finish Book: " + hoursLeft + " Hours and " + parseInt(minutesLeft) + " Minutes";
    startSeconds = Date.now() / 1000;

}

document.addEventListener("keydown", (key) => {
    if (key.key == " " && startSeconds != 0 && detectMethod == "spacebar") {
        calculateStats();

    }
});

let startDetectingTaps = false;

function tapStartDelay() {
    setTimeout(() => {
        startDetectingTaps = true;
    }, 250);
}


tapZone.addEventListener("click", (ev) => {
    if (startSeconds != 0 && detectMethod == "tap" && startDetectingTaps) {
        console.log(startSeconds);        
        calculateStats();
    }
});


function reloadPage() {
    
    currentPage = 0;
    totalPages = 0;
    startSeconds = 0;
    elapsedSeconds = 0;
    pagesLeft = 0;
    pagesPerTick = 0;

    isTrackingStarted = false;

    output.innerText = "Tracking Stopped\n\n";
    startDetectingTaps = false;

}
