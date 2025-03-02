const content = document.getElementById('content');

const buttons1 = document.getElementById('buttons1');
const buttons2 = document.getElementById('buttons2');
const buttons3 = document.getElementById('buttons3');

const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');

const fullText = document.getElementById('timer-full-text')

let timer;
let isWorking = false;
let isResetTimer = false;
let workCompleted = false;
let breakCompleted = false;
let mainTimer;


//listener for buttons
content.addEventListener('click', (event) => {
    if (event.target.classList.contains('start')) {
        startTimer();
    } else if (event.target.classList.contains('pause')) {
        pauseTimer();
    } else if (event.target.classList.contains('reset')) {
        resetTimer();
    } else if (event.target.classList.contains('continue')) {
        continueTimer();
    };
});
//function that waiting for the "continue" button to be pressed
function waitForWork() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (isWorking) {
                clearInterval(checkInterval);
                resolve();
            };
            if (isResetTimer) {
                clearInterval(checkInterval);
                resolve();
            };
        }, 100);
    });
}
//main function that starts a cycle of work and break timers, and counting values of break time and work time (it needs for 
//static values of work and break times. otherwise other functions will be counting these values wrong if you change input
//values while the timer is running 
async function startTimer() {
    buttons1.style.display = "none";
    buttons2.style.display = "block";
    workCompleted = false;
    breakCompleted = false;
    let workTime = workTimeInput.value * 60 * 1000;
    let breakTime = breakTimeInput.value * 60 * 1000;
    

    isWorking = true;

    while(isWorking) {
        if(isWorking) {
            fullText.style.color = "blue";
            await cycleWorkTimer(workTime);
        };
        if (isWorking) {
            fullText.style.color = "green";
            await cycleBreakTimer(breakTime);
        };
    };
};

//function that helps realize the cycle of work timers
async function cycleWorkTimer(workTime) {
    await startWorkTimer(workTime).then(async function() {
        if (!workCompleted) {
            await waitForWork();
            workTime = minutes.textContent * 60 * 1000 + seconds.textContent * 1000;
            await cycleWorkTimer(workTime);
        };
    });
};

//same function, only with a break timer
async function cycleBreakTimer(breakTime) {
    await startWorkTimer(breakTime).then(async function() {
        if (!breakCompleted) {
            await waitForWork();
            breakTime = minutes.textContent * 60 * 1000 + seconds.textContent * 1000;
            await cycleWorkTimer(breakTime);
        };
    });
};

//running the work timer until the pause button is pressed
async function startWorkTimer(workTime) {
    return new Promise((resolve) => {  
        const timerEnds = Date.now() + workTime;
        mainTimer = "work";
        firstRefreshTimer(timerEnds - 1);
        timer = setInterval(refreshTimer.bind(refreshTimer, resolve), 1000);

    });
};

//running the break timer until the pause button is pressed
function startBreakTimer(breakTime) {
    return new Promise((resolve) => {
        const timerEnds = Date.now() + breakTime;
        mainTimer = "break";
        firstRefreshTimer(timerEnds - 1);
        timer = setInterval(refreshTimer.bind(refreshTimer, resolve), 1000);  
    });
};

//pause button
function pauseTimer() {
    isWorking = false;
    workCompleted = false;
    breakCompleted = false;
    buttons2.style.display = "none";
    buttons3.style.display = "block";
};

//continue button
function continueTimer() {
    isWorking = true;
    buttons3.style.display = "none";
    buttons2.style.display = "block";
    
};

//reset button, stops all timers and resets values
function resetTimer() {
    isWorking = false;
    workCompleted = true;
    breakCompleted = true;
    buttons2.style.display = "none";
    buttons3.style.display = "none";
    buttons1.style.display = "block";
    minutes.textContent = "00";
    seconds.textContent = "00";
};

//first refreshing of timer values
function firstRefreshTimer(timerEnds) {
    if (isWorking) {
        const timeRemains = timerEnds - Date.now() + 1000;
            
        const minutesRemains = Math.floor(timeRemains / 1000 / 60);
        const secondsRemains = Math.floor((timeRemains % (1000 * 60)) / 1000);

        minutes.innerHTML = String(minutesRemains).padStart(2, "0");
        seconds.innerHTML = String(secondsRemains).padStart(2, "0");
    };
};

//refreshing of timer values. used in setInterval()
function refreshTimer(resolve) {
    if (isWorking) {
        const timeRemains = minutes.textContent * 60 * 1000 + seconds.textContent * 1000 - 1000;
        const minutesRemains = Math.floor(timeRemains / 1000 / 60);
        const secondsRemains = Math.floor((timeRemains % (1000 * 60)) / 1000);
        
        if (minutesRemains < 0 && secondsRemains < 0) {
            clearInterval(timer);
            if (mainTimer == "work") {
                workCompleted = true;
                breakCompleted = false;
            } else if (mainTimer == "break") {
                breakCompleted = true;
                workCompleted = false;
            }
            resolve();
            return;
        }
    
        minutes.innerHTML = String(minutesRemains).padStart(2, "0");
        seconds.innerHTML = String(secondsRemains).padStart(2, "0");
    } else {
        clearInterval(timer);
        resolve();
        return;
    };
};



