// Nom    :
// Prénom :
// Groupe :

class Time {
    #milliseconds
    #seconds
    #minutes

    constructor() {
        this.time = 0;
        this.fracture();
    }

    fracture() {
        this.#milliseconds = Math.floor(this.time % 100);
        this.#seconds = Math.floor((this.time/100) % 60);
        this.#minutes = Math.floor((this.time/6000) % 60);
    }

    count() {
        this.time++;
        this.fracture();
    }

    get milliseconds() {
        if(this.#milliseconds.toString().length > 1) return this.#milliseconds;
        return `0${this.#milliseconds}`;
    }

    get seconds() {
        if(this.#seconds.toString().length > 1) return this.#seconds;
        return `0${this.#seconds}`;
    }

    get minutes() {
        if(this.#minutes.toString().length > 1) return this.#minutes;
        return `0${this.#minutes}`;
    }
}

const StopWatch = {
    time: new Time(0),
    timerDisplay: document.querySelector('.app__timer'),
    startButton: document.querySelector('.app__controls__start'),
    lapButton: document.querySelector('.app__controls__lap'),
    lapList: document.querySelector('ul.app__laps'),
    on: 0,
    resetToggled: 0,
    firstTime: 1,
    laps: [],
    reset() {
        this.time = new Time(0);
        this.lapList.textContent = '';
        this.displayTime(this.time);
        this.firstTime = 1;
        [this.lapButton.textContent, this.lapButton.dataset.alternate] = [this.lapButton.dataset.alternate, this.lapButton.textContent];
        this.lapButton.classList.toggle('running');
        this.resetToggled = !this.resetToggled;
        this.laps = [];
    },
    toggle() {
        this.toggleButton();
        if (!this.on) {
            this.interval = setInterval(() => {
                this.time.count();
                this.displayTime(this.time);
            }, 10);
            this.on = 1;
        } else {
            clearInterval(this.interval)
            this.on = 0;
        }
    },
    newLap() {
        this.saveCurrent(this.time);
        this.addLap();
        this.autoscroll();
    },
    autoscroll() {
        this.lapList.scrollTo(0, this.lapList.scrollHeight);
    },
    displayTime(time) {
        this.timerDisplay.textContent = `${time.minutes}:${time.seconds}:${time.milliseconds}`;
        this.timerDisplay.setAttribute('datetime', `${time.minutes}:${time.seconds}:${time.milliseconds}`);
    },
    toggleButton() {
        if (this.firstTime) {
            this.firstTime = 0;
            [this.lapButton.textContent, this.lapButton.dataset.alternate] = [this.lapButton.dataset.alternate, this.lapButton.textContent];
            this.lapButton.classList.toggle('running');
            this.resetToggled = !this.resetToggled;
        }
        [this.startButton.textContent, this.startButton.dataset.alternate] = [this.startButton.dataset.alternate, this.startButton.textContent];
        [this.lapButton.textContent, this.lapButton.dataset.alternate] = [this.lapButton.dataset.alternate, this.lapButton.textContent];
        this.resetToggled = !this.resetToggled;
        this.startButton.classList.toggle('running');
        this.lapButton.classList.toggle('running');
    },
    saveCurrent() {
        this.laps.push(this.time);
    },
    addLap() {
        this.lapList.insertAdjacentHTML('beforeend',
        `<li class="app__lap">
            <span class="app__lap-count">Tour ${this.laps.length}</span>
            <time class="app__lap-value" datatype="${this.laps[this.laps.length-1].minutes}:${this.laps[this.laps.length-1].seconds}:${this.laps[this.laps.length-1].milliseconds}">${this.laps[this.laps.length-1].minutes}:${this.laps[this.laps.length-1].seconds}:${this.laps[this.laps.length-1].milliseconds}</time>
            </li>`)
    },
    toggleLapReset() {
        if (this.resetToggled) {
            this.reset();
        } else {
            this.newLap();
        }
    },
    init() {
        this.startButton.addEventListener('click', () => StopWatch.toggle());
        this.lapButton.addEventListener('click', () => StopWatch.toggleLapReset());
    }
}

StopWatch.init();