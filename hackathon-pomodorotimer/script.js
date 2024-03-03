// Variables for distraction-free mode
let distractionFreeMode = false;
let remainingTime = 0;

// Statistics tracking variables
let totalSessions = 0;
let totalTimeSpent = 0;

// Function to toggle distraction-free mode
const distractionToggle = document.getElementById('distractionToggle');
distractionToggle.addEventListener('change', () => {
    distractionFreeMode = distractionToggle.checked;
});

// variables
let workTittle = document.getElementById('work');
let breakTittle = document.getElementById('break');
let longBreakTittle = document.getElementById('long-break');
let workMinutesInput = document.getElementById('workMinutesInput');
let workSecondsInput = document.getElementById('workSecondsInput');
let breakMinutesInput = document.getElementById('breakMinutesInput');
let breakSecondsInput = document.getElementById('breakSecondsInput');
let longBreakMinutesInput = document.getElementById('longBreakMinutesInput');
let longBreakSecondsInput = document.getElementById('longBreakSecondsInput');
let cycleCountInput = document.getElementById('cycleCountInput');
let taskInput = document.getElementById('taskInput');
let taskList = document.getElementById('taskList');
let notificationSound = new Audio('notification_sound.mp3'); // Assign the notification sound

let workTime = 25 * 60; // Default work time in seconds (25 minutes)
let breakTime = 0 * 60; // Default break time in seconds (5 minutes)
let longBreakTime = 15 * 60; // Default long break time in seconds (15 minutes)
let totalCycles = 1; // Default total cycles
let seconds = 0;
let isWorkTime = true;
let cycleCounter = 0;
let timer; // Variable to hold the timer interval

// display
window.onload = () => {
    document.getElementById('minutes').textContent = Math.floor(workTime / 60); // Display initial work time in minutes
    document.getElementById('seconds').textContent = "00";

    workTittle.classList.add('active');
}

// start timer
function start() {
    // Read user input for work time
    let userInputMinutes = parseInt(workMinutesInput.value) || 0;
    let userInputSeconds = parseInt(workSecondsInput.value) || 0;
    
    // Convert input to seconds
    workTime = (userInputMinutes * 60) + userInputSeconds;
    
    // Read user input for break, long break times, and total cycles
    breakTime = (parseInt(breakMinutesInput.value) || 0) * 60 + (parseInt(breakSecondsInput.value) || 0); // Convert input to seconds
    longBreakTime = (parseInt(longBreakMinutesInput.value) || 0) * 60 + (parseInt(longBreakSecondsInput.value) || 0); // Convert input to seconds
    totalCycles = parseInt(cycleCountInput.value) || 1;

    // Change button
    document.getElementById('start').style.display = "none";
    document.getElementById('pause').style.display = "block";
    document.getElementById('reset').style.display = "block";

    // Reset seconds
    seconds = 0;

    // Start work timer with updated workTime
    startWorkTimer();
}

// pause timer
function pause() {
    clearInterval(timer); // Clear the interval to pause the timer
    // Store the remaining time
    remainingTime = seconds;
    document.getElementById('pause').style.display = "none";
    document.getElementById('resume').style.display = "block";
}

// resume timer
function resume() {
    if (isWorkTime) {
        startWorkTimer(remainingTime); // Resume work timer with remaining time
    } else {
        startBreakTimer(remainingTime); // Resume break timer with remaining time
    }
    document.getElementById('resume').style.display = "none";
    document.getElementById('pause').style.display = "block";
}


// Timer logic for work time
function startWorkTimer(remainingTime = workTime) {
    notificationSound.play();
    displayMessage("It's work time!");
    seconds = remainingTime; // Set work time in seconds
    workTittle.classList.add('active');
    timer = setInterval(() => {
        seconds--;
        if (seconds === 5) {
            notificationSound.play(); // Play notification sound 5 seconds before the end of work time
            displayMessage("5 seconds left of work time!");
        }
        if (seconds < 0) {
            clearInterval(timer);
            
            cycleCounter++;
            if (cycleCounter % totalCycles === 0) {
                startLongBreakTimer(); // Start long break timer after each cycle
            } else {
                isWorkTime = false;
                startBreakTimer(); // Start break timer when work time is over and it's not work time
            }
            // Update statistics
            totalSessions++;
            document.getElementById('totalSessions').textContent = totalSessions;
            totalTimeSpent += workTime / 60;
            document.getElementById('totalTimeSpent').textContent = totalTimeSpent.toFixed(2);
            document.getElementById('averageSessionLength').textContent = (totalTimeSpent / totalSessions).toFixed(2);
        }
        displayTime();
    }, 1000);
}

// Timer logic for short break time
function startBreakTimer(remainingTime = breakTime) {
    notificationSound.play();
    displayMessage("Have a break!");
    seconds = remainingTime; // Set break time in seconds
    breakTittle.classList.add('active');
    timer = setInterval(() => {
        seconds--;
        if (seconds === 5) {
            notificationSound.play(); // Play notification sound 5 seconds before the end of break time
            displayMessage("5 seconds left of break time!");
        }
        if (seconds < 0) {
            clearInterval(timer);
            isWorkTime = true;
            startWorkTimer(); // Start work timer when break time is over
            notificationSound.play(); // Play notification sound
        }
        displayTime();
    }, 1000);
}


// Timer logic for long break time
function startLongBreakTimer() {
    notificationSound.play();
    displayMessage("It's long break time!");
    seconds = longBreakTime; // Set long break time in seconds
    longBreakTittle.classList.add('active');
    timer = setInterval(() => {
        seconds--;
        if (seconds === 5) {
            notificationSound.play(); // Play notification sound 5 seconds before the end of long break time
            displayMessage("5 seconds left of long break time!");
        }
        if (seconds < 0) {
            clearInterval(timer);
            isWorkTime = true;
            cycleCounter = 0; // Reset cycle counter after a long break
            startWorkTimer();
            notificationSound.play(); // Play notification sound
        }
        displayTime();
    }, 1000);
}

// Function to display messages
function displayMessage(message) {
    let messageContainer = document.getElementById('message');
    messageContainer.textContent = message;
}

// Function to display time
function displayTime() {
    console.log(cycleCounter);
    document.getElementById('minutes').textContent = Math.floor(seconds / 60);
    document.getElementById('seconds').textContent = seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60;
}

// reset timer
function reset() {
    clearInterval(timer); // Clear the interval to stop the timer
    document.getElementById('minutes').textContent = Math.floor(workTime / 60); // Reset the minutes to default
    document.getElementById('seconds').textContent = "00"; // Reset the seconds to default
    isWorkTime = true;
    cycleCounter = 0;
    document.getElementById('start').style.display = "block";
    document.getElementById('pause').style.display = "none";
    document.getElementById('resume').style.display = "none";
    document.getElementById('reset').style.display = "none";
    displayMessage(""); // Clear the message display
}

// Task list integration
function addTask() {
    let taskInput = document.getElementById('taskInput');
    let taskList = document.getElementById('taskList');
    if (taskInput.value !== '') {
        let li = document.createElement('li');
        li.textContent = taskInput.value;
        taskList.appendChild(li);
        taskInput.value = '';
    }
}



//comment