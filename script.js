


let statsForm = document.getElementById("bookStatsForm");

statsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let startTime = document.getElementById("startTime");
    let endTime = document.getElementById("endTime");
    let startPage = document.getElementById("startPage");
    let endPage = document.getElementById("endPage");
    let totalPages = document.getElementById("totalPages");
    let output = document.getElementById("output");

    if (goalCheckbox.checked) {
        calculateGoal();
        return;
    }

    let inputs = [startTime, endTime, startPage, endPage,
        totalPages]

    for (let x = 0; x < inputs.length; x++) {
        if (!inputs[x].value) {
            output.innerText = "Form Incomplete."
            return
        }
    }

    let start = startTime.value.split(':');
    let end = endTime.value.split(':');

    let startMins = parseInt(start[0]) * 60 + parseInt(start[1]);
    let endMins = parseInt(end[0]) * 60 + parseInt(end[1]);
    let durationMins = endMins - startMins;
    let readPages = parseInt(endPage.value) - parseInt(startPage.value);

    let pagesPerMin = readPages / durationMins;

    let timeToFinish = (parseInt(totalPages.value) - parseInt(endPage.value)) / pagesPerMin;

    let hoursToFinish = parseInt(timeToFinish / 60);
    let minutesToFinish = timeToFinish - (hoursToFinish * 60);

    output.innerText = `You read ${readPages} pages in ${durationMins} mins\nYour speed is ${pagesPerMin.toFixed(2)} pages per minute.\n
                        Time left to finish the book at this speed is: ${hoursToFinish} hours and ${minutesToFinish} minutes`;

    
})


let speedCheckbox = document.getElementById("speed");
let goalCheckbox = document.getElementById("goal");

let checkboxes = [speedCheckbox, goalCheckbox];

for (const box of checkboxes) {
    box.addEventListener("click", updateDisplay);

}

function calculateGoal() {
    let inputs = [startPage, endPage, totalPages];
    for (const inp of inputs) {
        if (!inp.value) {
            output.innerText = "Form Incomplete."
            return
        }

    let pagesLeft = parseInt(totalPages.value) - parseInt(startPage.value);
    let dailyPages = pagesLeft / parseInt(endPage.value);
    output.innerText = `To complete in ${endPage.value} days you will have to read atleast
                    ${dailyPages.toFixed(0)} pages per day.`;

    }
}

function toggleElements() {
    let elementsToHide = [startTime, startTime.labels[0],
                            endTime, endTime.labels[0]];

    let checkText = "End Page:";

    for (const el of elementsToHide) {
        if (el.hidden) {
            el.hidden = false;
        } else {
            el.hidden = true;
        }
        
    }
    if (endPage.labels[0].innerText === checkText) {
        endPage.labels[0].innerText = "Finish Goal in Days:";
    } else {
        endPage.labels[0].innerText = checkText;
    } 
}

function updateDisplay() {

  
    for (const box of checkboxes) {
        if (box.id === "goal" && box.checked) {
            toggleElements()
        }
        else if (box.id === "speed" && box.checked) {
            toggleElements()
        }
    }
}