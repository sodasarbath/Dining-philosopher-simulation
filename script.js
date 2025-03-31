class Philosopher {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = 'thinking';
        this.leftFork = false;
        this.rightFork = false;
        this.thinkingTime = 0;
        this.eatingTime = 0;
        this.waitingTime = 0;
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
        this.animationFrame = null;
        this.setupCanvas();
        this.initializePhilosophers();
        this.initializeForks();
    }

    setupCanvas() {
        const containerWidth = this.canvas.parentElement.clientWidth;
        const containerHeight = this.canvas.parentElement.clientHeight;
        this.canvas.width = containerWidth;
        this.canvas.height = containerWidth;
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
            this.forks.push(false);
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
        if (this.running) {
            this.paused = !this.paused;
            this.updateButtons();
            this.updateStatus(this.paused ? 'Simulation paused' : 'Simulation resumed');
            if (!this.paused) {
                this.animate();
            }
        }
    }

    stop() {
        this.running = false;
        this.paused = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
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
        document.getElementById('resumeBtn').disabled = !this.running || !this.paused;
        document.getElementById('stopBtn').disabled = !this.running;
    }

    updateStatus(message) {
        document.getElementById('statusText').textContent = message;
    }

    updatePhilosopherStatus() {
        const statusDiv = document.getElementById('philosopherStatus');
        statusDiv.innerHTML = this.philosophers.map(p => {
            const leftForkNum = p.id;
            const rightForkNum = (p.id + 1) % this.numPhilosophers;
            const leftForkStatus = p.leftFork ? 'in use' : (this.forks[leftForkNum] ? 'taken' : 'available');
            const rightForkStatus = p.rightFork ? 'in use' : (this.forks[rightForkNum] ? 'taken' : 'available');
            
            return `
                <div class="philosopher ${p.state}">
                    Philosopher ${p.id + 1}: ${p.state.charAt(0).toUpperCase() + p.state.slice(1)}
                    <div class="fork-status small">
                        Left Fork #${leftForkNum + 1}: ${leftForkStatus}
                        Right Fork #${rightForkNum + 1}: ${rightForkStatus}
                    </div>
                </div>
            `;
        }).join('');
    }

    animate() {
        if (!this.running) return;
        if (!this.paused) {
            this.update();
            this.draw();
        }
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    update() {
        this.philosophers.forEach((philosopher, index) => {
            switch (philosopher.state) {
                case 'thinking':
                    philosopher.thinkingTime++;
                    if (philosopher.thinkingTime > 1000) {
                        philosopher.state = 'hungry';
                        philosopher.thinkingTime = 0;
                        philosopher.waitingTime = 0;
                    }
                    break;

                case 'hungry':
                    const leftFork = index;
                    const rightFork = (index + 1) % this.numPhilosophers;
                    
                    // Implement resource hierarchy to prevent deadlock
                    const firstFork = Math.min(leftFork, rightFork);
                    const secondFork = Math.max(leftFork, rightFork);
                    
                    if (!this.forks[firstFork] && !this.forks[secondFork]) {
                        // Try to acquire both forks atomically
                        this.forks[firstFork] = true;
                        this.forks[secondFork] = true;
                        philosopher.leftFork = true;
                        philosopher.rightFork = true;
                        philosopher.state = 'eating';
                        philosopher.eatingTime = 0;
                        philosopher.waitingTime = 0;
                    } else {
                        philosopher.waitingTime++;
                        if (philosopher.waitingTime > 1000) {
                            philosopher.waitingTime = 0;
                            philosopher.state = 'thinking';
                            philosopher.thinkingTime = 0;
                        }
                    }
                    break;

                case 'eating':
                    philosopher.eatingTime++;
                    if (philosopher.eatingTime > 1500) {
                        const leftFork = index;
                        const rightFork = (index + 1) % this.numPhilosophers;
                        const firstFork = Math.min(leftFork, rightFork);
                        const secondFork = Math.max(leftFork, rightFork);
                        
                        this.forks[firstFork] = false;
                        this.forks[secondFork] = false;
                        philosopher.leftFork = false;
                        philosopher.rightFork = false;
                        philosopher.state = 'thinking';
                        philosopher.eatingTime = 0;
                        philosopher.thinkingTime = 0;
                    }
                    break;
            }
        });
        this.updatePhilosopherStatus();
    }

    getPhilosopherColor(state) {
        switch (state) {
            case 'thinking': return '#e3f2fd';
            case 'hungry': return '#fff3cd';
            case 'eating': return '#d4edda';
            default: return '#9E9E9E';
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw filled table
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * 0.8, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#8D6E63';
        this.ctx.fill();
        this.ctx.strokeStyle = '#5D4037';
        this.ctx.lineWidth = 10;
        this.ctx.stroke();

        // Draw philosophers and forks
        this.philosophers.forEach((philosopher, index) => {
            // Draw plate with shadow
            const plateRadius = 30;
            const plateOffset = 40; // Increased offset towards table center
            const angleToCenter = Math.atan2(this.centerY - philosopher.y, this.centerX - philosopher.x);
            const plateX = philosopher.x + plateOffset * Math.cos(angleToCenter);
            const plateY = philosopher.y + plateOffset * Math.sin(angleToCenter);
            
            this.ctx.beginPath();
            this.ctx.arc(plateX, plateY, plateRadius, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowColor = 'rgba(0,0,0,0.2)';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            this.ctx.fill();
            this.ctx.shadowColor = 'transparent';
            this.ctx.strokeStyle = '#BDBDBD';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw philosopher
            this.ctx.beginPath();
            this.ctx.arc(philosopher.x, philosopher.y, 30, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.getPhilosopherColor(philosopher.state);
            this.ctx.fill();
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Calculate fork positions
            const nextIndex = (index + 1) % this.numPhilosophers;
            const nextPhilosopher = this.philosophers[nextIndex];
            const forkX = (philosopher.x + nextPhilosopher.x) / 2;
            const forkY = (philosopher.y + nextPhilosopher.y) / 2;

            // Draw fork with number
            const angle = Math.atan2(nextPhilosopher.y - philosopher.y, nextPhilosopher.x - philosopher.x);
            const forkLength = 25;
            const tineLength = 10;
            const isInUse = this.forks[index];

            this.ctx.save();
            this.ctx.translate(forkX, forkY);
            this.ctx.rotate(angle);

            if (isInUse) {
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 15;
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
            } else {
                this.ctx.strokeStyle = '#424242';
                this.ctx.lineWidth = 2;
            }

            // Draw fork handle
            this.ctx.beginPath();
            this.ctx.moveTo(-forkLength, 0);
            this.ctx.lineTo(forkLength, 0);
            this.ctx.stroke();

            // Draw fork tines
            this.ctx.beginPath();
            for (let i = -2; i <= 2; i++) {
                if (i !== 0) {
                    this.ctx.moveTo(forkLength - tineLength, i * 3);
                    this.ctx.lineTo(forkLength, i * 3);
                }
            }
            this.ctx.stroke();

            // Draw fork number
            this.ctx.restore();
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(index + 1, forkX, forkY);
            this.ctx.fillText(index + 1, forkX, forkY);

            // Draw philosopher number
            this.ctx.fillStyle = '#000';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(index + 1, philosopher.x, philosopher.y);
        });
    }
}

// Initialize simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('simulationCanvas');
    const simulation = new DiningPhilosophers(canvas);
    
    document.getElementById('startBtn').addEventListener('click', () => simulation.start());
    document.getElementById('pauseBtn').addEventListener('click', () => simulation.pause());
    document.getElementById('resumeBtn').addEventListener('click', () => {
        if (simulation.paused) {
            simulation.pause(); // Using pause method to resume since it toggles the pause state
        }
    });
    document.getElementById('stopBtn').addEventListener('click', () => simulation.stop());
    
    // Initial draw
    simulation.draw();
});
