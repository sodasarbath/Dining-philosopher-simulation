class Philosopher {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = 'thinking'; // thinking, hungry, eating
        this.leftFork = false;
        this.rightFork = false;
        this.thinkingTime = 0;
        this.eatingTime = 0;
    }
}

class DiningPhilosophers {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.philosophers = [];
        this.forks = [];
        this.running = false;
        this.paused = false;
        this.numPhilosophers = 5;
        this.setupCanvas();
        this.initializePhilosophers();
        this.initializeForks();
    }

    setupCanvas() {
        const containerWidth = this.canvas.parentElement.clientWidth;
        const containerHeight = this.canvas.parentElement.clientHeight;
        this.canvas.width = containerWidth;
        this.canvas.height = containerWidth; // Keep it square
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) * 0.6;
    }

    initializePhilosophers() {
        for (let i = 0; i < this.numPhilosophers; i++) {
            const angle = (i * 2 * Math.PI) / this.numPhilosophers;
            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);
            this.philosophers.push(new Philosopher(i, x, y));
        }
    }

    initializeForks() {
        for (let i = 0; i < this.numPhilosophers; i++) {
            this.forks.push(false); // false means fork is available
        }
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.paused = false;
            this.updateButtons();
            this.animate();
            this.updateStatus('Simulation started');
        }
    }

    pause() {
        this.paused = !this.paused;
        this.updateButtons();
        this.updateStatus(this.paused ? 'Simulation paused' : 'Simulation resumed');
    }

    stop() {
        this.running = false;
        this.paused = false;
        this.updateButtons();
        this.resetSimulation();
        this.updateStatus('Simulation stopped');
    }

    resetSimulation() {
        this.philosophers.forEach(philosopher => {
            philosopher.state = 'thinking';
            philosopher.leftFork = false;
            philosopher.rightFork = false;
        });
        this.forks.fill(false);
        this.draw();
        this.updatePhilosopherStatus();
    }

    updateButtons() {
        document.getElementById('startBtn').disabled = this.running;
        document.getElementById('pauseBtn').disabled = !this.running;
        document.getElementById('stopBtn').disabled = !this.running;
    }

    updateStatus(message) {
        document.getElementById('statusText').textContent = message;
    }

    updatePhilosopherStatus() {
        const statusDiv = document.getElementById('philosopherStatus');
        statusDiv.innerHTML = this.philosophers.map(p => `
            <div class="philosopher ${p.state}">
                Philosopher ${p.id + 1}: ${p.state.charAt(0).toUpperCase() + p.state.slice(1)}
                ${p.leftFork ? '🍴' : ''} ${p.rightFork ? '🍴' : ''}
            </div>
        `).join('');
    }

    animate() {
        if (!this.running) return;
        if (!this.paused) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(() => this.animate());
    }

    update() {
        this.philosophers.forEach((philosopher, index) => {
            switch (philosopher.state) {
                case 'thinking':
                    philosopher.thinkingTime++;
                    if (philosopher.thinkingTime > 100) {
                        philosopher.state = 'hungry';
                        philosopher.thinkingTime = 0;
                    }
                    break;

                case 'hungry':
                    const leftFork = index;
                    const rightFork = (index + 1) % this.numPhilosophers;

                    if (!this.forks[leftFork] && !this.forks[rightFork]) {
                        this.forks[leftFork] = true;
                        this.forks[rightFork] = true;
                        philosopher.leftFork = true;
                        philosopher.rightFork = true;
                        philosopher.state = 'eating';
                    }
                    break;

                case 'eating':
                    philosopher.eatingTime++;
                    if (philosopher.eatingTime > 150) {
                        const leftFork = index;
                        const rightFork = (index + 1) % this.numPhilosophers;
                        this.forks[leftFork] = false;
                        this.forks[rightFork] = false;
                        philosopher.leftFork = false;
                        philosopher.rightFork = false;
                        philosopher.state = 'thinking';
                        philosopher.eatingTime = 0;
                    }
                    break;
            }
        });
        this.updatePhilosopherStatus();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw table
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * 0.8, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fill();

        // Draw philosophers and forks
        this.philosophers.forEach((philosopher, index) => {
            this.ctx.beginPath();
            this.ctx.arc(philosopher.x, philosopher.y, 20, 0, 2 * Math.PI);
            this.ctx.fillStyle = philosopher.state === 'thinking' ? '#64B5F6' : philosopher.state === 'hungry' ? '#FFB74D' : '#81C784';
            this.ctx.fill();
            this.ctx.stroke();
        });
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('simulationCanvas');
    const simulation = new DiningPhilosophers(canvas);

    document.getElementById('startBtn').addEventListener('click', () => simulation.start());
    document.getElementById('pauseBtn').addEventListener('click', () => simulation.pause());
    document.getElementById('stopBtn').addEventListener('click', () => simulation.stop());

    simulation.draw();
});