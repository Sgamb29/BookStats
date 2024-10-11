

// Elements Variables
const statsForm = document.getElementById("bookStatsForm");



// Calculating the reading speed
statsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const endTime = document.getElementById("endTime");
    const startPage = document.getElementById("startPage");
    const endPage = document.getElementById("endPage");
    const totalPages = document.getElementById("totalPages");
    const output = document.getElementById("output");

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
        
        currentActivtatedSlot.data = saveData;
        currentActivtatedSlot.saveInSlot();
        currentButtonEl.innerText = currentActivtatedSlot.data["bookTitle"];
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


// Initalizing save slots
class SaveSlot {
    constructor(cookieName, id) {
        this.cookieName = cookieName;
        this.id = id;
    }

    data = {
        "bookTitle": "-- --",
        "totalPages": "",
        "currentPage": "",
        "timeLeft": "",
        "pagesPerMin": "",
    };

    saveInSlot() {
        
        document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
        setCookie(this.cookieName, JSON.stringify(this.data), 10000);
    }


}
const saveSlot1 = new SaveSlot("saveData", "1");
const saveSlot2 = new SaveSlot("saveData2", "2");
const saveSlot3 = new SaveSlot("saveData3", "3");

const saveSlotClasses = [saveSlot1, saveSlot2, saveSlot3];

let currentActivtatedSlot = null;

document.addEventListener("DOMContentLoaded", () => {

    const currentId = getCookie("currentSelected");

    saveSlotClasses.forEach((c) => {
        if (getCookie(c.cookieName) === "") {
            return;
        }
        const saveData = JSON.parse(getCookie(c.cookieName));

        c.data = saveData;


        if (c.id === currentId) {
            currentActivtatedSlot = c;
            setCurrent(c, "");
        } else if (currentId === "" & c.id === "1") {
            currentActivtatedSlot = c;
            setCurrent(c, "");
        }
        
    });
    
    if (currentActivtatedSlot === null) {
        currentActivtatedSlot = saveSlot1;
        setCurrent(saveSlot1, "")
    }





});

// For the saveslot buttons
const saveSlotEls = [];

let saveSlotsGenerated = false;

function showHideSlots() {
    saveSlotEls.forEach((el) => {
        el.hidden = !el.hidden;

    });
}

function showSaveSlots() {
    const container = document.getElementById("saveSlotsContainer");

    
    if (saveSlotsGenerated) {
        showHideSlots();
        return;
    }

    // Adding Elements
    saveSlotClasses.forEach((c) => {
        const newEl = document.createElement("button");
        newEl.className = "btn btn-secondary mb-3";
        if (c.id === getCookie("currentSelected")) {
            newEl.className = "btn btn-primary mb-3"
            currentButtonEl = newEl;
        }

        newEl.innerText = c.data["bookTitle"];

        newEl.addEventListener("click", () => {
            setCurrent(c, newEl);
        });
        saveSlotEls.push(newEl);
        container.appendChild(newEl);
    });

    saveSlotsGenerated = true;
    
}

let currentButtonEl = null;
// Changing Current Data and Updating UI
function setCurrent(c, elToUpdate) {

    setCookie("currentSelected", c.id, 10000);
    currentActivtatedSlot = c;
    currentButtonEl = elToUpdate;
    // Changing Button Color
    saveSlotEls.forEach((el) => {
        if (el === elToUpdate) {
            el.className = "btn btn-primary mb-3"
        } else {
            el.className = "btn btn-secondary mb-3"
        }
    });

    
    // Updating UI
    const startPage = document.getElementById("startPage");
    const totalPages = document.getElementById("totalPages");
    const bookTitle = document.getElementById("bookTitle");

   
    bookTitle.value = c.data["bookTitle"].replaceAll(encodeSemi, ";");
    startPage.value = c.data["currentPage"];
    totalPages.value = c.data["totalPages"];

    document.getElementById("endTime").value = "";
    document.getElementById("endPage").value = "";

    if (c.data["timeLeft"] === "") {
        return;
    }
    const hours = c.data["timeLeft"].split(":")[0];
    const mins = c.data["timeLeft"].split(":")[1];
    const pagesPerMin = c.data["pagesPerMin"];
    document.getElementById("output").innerText = `Previous calculation: You're last speed was ${pagesPerMin} pages per minute, with ${hours} hours and ${mins} minutes left to finish ${bookTitle.value}`;

}

