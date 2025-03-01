const content = document.getElementById('content');

const buttons1 = document.getElementById('buttons1');
const buttons2 = document.getElementById('buttons2');
const buttons3 = document.getElementById('buttons3');

const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');

let timer;
let isWorking = false;


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


async function startTimer() {
    const workTime = workTimeInput.value * 60 * 1000;
    const breakTime = breakTimeInput.value * 60 * 1000;
    
    buttons1.style.display = "none";
    buttons2.style.display = "block";

    isWorking = true;

    while(isWorking) {
        await startWorkTimer(workTime);
        await startBreakTimer(breakTime);
    };
};

function startWorkTimer(workTime) {
    return new Promise((resolve) => {  
        const timerEnds = Date.now() + workTime;
        refreshTimer(timerEnds - 1);
        timer = setInterval(refreshTimer.bind(refreshTimer, timerEnds, resolve), 1000);

    });
};

function startBreakTimer(breakTime) {
    return new Promise((resolve) => {
        const timerEnds = Date.now() + breakTime;
        refreshTimer(timerEnds - 1);
        console.log('breaak');
        timer = setInterval(refreshTimer.bind(refreshTimer, timerEnds, resolve), 1000);  
    });
};



function refreshTimer(timerEnds, resolve) {
    if (isWorking) {
        const timeRemains = timerEnds - Date.now() + 1000;
            
        const minutesRemains = Math.floor(timeRemains / 1000 / 60);
        const secondsRemains = Math.floor((timeRemains % (1000 * 60)) / 1000);
        
        if (minutesRemains < 0 && secondsRemains < 0) {
            clearInterval(timer);
            resolve();
            alert( 'Timer changes...' );
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



/*console.group('DATA');
console.log('Minutes: ', minutesRemains);
console.log('Seconds: ', secondsRemains);
console.log('Time remains: ', timeRemains);
console.log('Timer ends at:', timerEnds);
console.groupEnd();*/
    //in process...
    function pauseTimer() {
        //isWorking = false;
        //buttons2.style.display = "none";
        //buttons3.style.display = "block";
    };
    
    function continueTimer() {
        //isWorking = true;
        //const timerEnds = Date.now() + minutes.textContent * 60 * 1000 + seconds.textContent * 1000; 
        //buttons3.style.display = "none";
        //buttons2.style.display = "block";
        
    };
    
    function resetTimer() {
        //isWorking = false;
        //buttons2.style.display = "none";
        //buttons3.style.display = "none";
        //buttons1.style.display = "block";
    };