


let statsForm = document.getElementById("bookStatsForm");

statsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let endTime = document.getElementById("endTime");
    let startPage = document.getElementById("startPage");
    let endPage = document.getElementById("endPage");
    let totalPages = document.getElementById("totalPages");
    let output = document.getElementById("output");

    const bookTitle = document.getElementById("bookTitle");

    if (goalCheckbox.checked) {
        calculateGoal();
        return;
    }

    let inputs = [endTime, startPage, endPage,
        totalPages]

    for (let x = 0; x < inputs.length; x++) {
        if (!inputs[x].value) {
            output.innerText = "Form Incomplete."
            return
        }
    }

    let durationMins = endTime.value;
    let readPages = parseInt(endPage.value) - parseInt(startPage.value);

    let pagesPerMin = readPages / durationMins;

    let timeToFinish = (parseInt(totalPages.value) - parseInt(endPage.value)) / pagesPerMin;

    let hoursToFinish = parseInt(timeToFinish / 60);
    let minutesToFinish = timeToFinish - (hoursToFinish * 60);

    minutesToFinish = Math.round(minutesToFinish);

    output.innerText = `You read ${readPages} pages in ${durationMins} mins\nYour speed is ${pagesPerMin.toFixed(2)} pages per minute.\n
                        Time left to finish the book at this speed is: ${hoursToFinish} hours and ${minutesToFinish} minutes`;

    if (bookTitle.value !== "") {
        const saveData = {
            "bookTitle": bookTitle.value.replaceAll(";", encodeSemi),
            "totalPages": totalPages.value,
            "currentPage": endPage.value,
            "timeLeft": `${hoursToFinish}:${minutesToFinish}`,
            "pagesPerMin": pagesPerMin.toFixed(2),
        }
        document.cookie = "saveData=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
        setCookie("saveData", JSON.stringify(saveData), 10000);
        console.log(saveData);
    }
    
})

const encodeSemi = "semicolonencoder1";

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
    let elementsToHide = [ endTime, endTime.labels[0]];

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

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}


function getCookie(name) {
    try {
        const value = document.cookie.split(`${name}=`)[1].split(";")[0];
        return value;
        } catch {
            return "";
        }
        
}

document.addEventListener("DOMContentLoaded", () => {
    const saveData = JSON.parse(getCookie("saveData"));


    const startPage = document.getElementById("startPage");
    const totalPages = document.getElementById("totalPages");
    const bookTitle = document.getElementById("bookTitle");

    bookTitle.value = saveData["bookTitle"].replaceAll(encodeSemi, ";");
    startPage.value = saveData["currentPage"];
    totalPages.value = saveData["totalPages"];

    const hours = saveData["timeLeft"].split(":")[0];
    const mins = saveData["timeLeft"].split(":")[1];
    const pagesPerMin = saveData["pagesPerMin"];
    document.getElementById("output").innerText = `Previous calculation: You're last speed was ${pagesPerMin} pages per minute, with ${hours} hours and ${mins} minutes left to finish ${bookTitle.value}`;



});