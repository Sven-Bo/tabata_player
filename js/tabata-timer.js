// Tabata Timer Class
class TabataTimer {
    constructor(callbacks) {
        this.callbacks = callbacks || {};
        this.workSeconds = 20;
        this.restSeconds = 10;
        this.prepSeconds = 12; // 12-second preparation phase
        this.rounds = 8; // Fixed at 8 rounds
        this.reset();
    }

    reset() {
        this.currentPhase = 'prep'; // Start with preparation phase
        this.currentRound = 0; // Start at round 0 during prep
        this.secondsRemaining = this.prepSeconds;
        this.isRunning = false;
        this.isPaused = false;
        
        // Update display
        this.updateDisplay();
        
        // Trigger phase change callback
        if (this.callbacks.onPhaseChange) {
            this.callbacks.onPhaseChange(this.currentPhase, this.currentRound, this.rounds);
        }
    }

    start() {
        if (this.isPaused) {
            // Resume from pause
            this.isRunning = true;
            this.isPaused = false;
            this.tick();
        } else if (!this.isRunning) {
            // Start fresh
            this.reset();
            this.isRunning = true;
            this.tick();
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
        }
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.reset();
    }

    tick() {
        if (!this.isRunning) return;
        
        // Update display
        this.updateDisplay();
        
        // Decrement time
        this.secondsRemaining--;
        
        // Check if phase is complete
        if (this.secondsRemaining < 0) {
            this.nextPhase();
        }
        
        // Schedule next tick
        setTimeout(() => this.tick(), 1000);
    }

    nextPhase() {
        if (this.currentPhase === 'prep') {
            // Switch from prep to first work phase
            this.currentPhase = 'work';
            this.currentRound = 1; // Start round 1
            this.secondsRemaining = this.workSeconds;
        } else if (this.currentPhase === 'work') {
            // Switch to rest phase
            this.currentPhase = 'rest';
            this.secondsRemaining = this.restSeconds;
        } else {
            // Switch to work phase and increment round
            this.currentPhase = 'work';
            this.secondsRemaining = this.workSeconds;
            
            // Check if all rounds are complete
            if (this.currentRound >= this.rounds) {
                this.completeWorkout();
                return;
            }
            
            this.currentRound++;
        }
        
        // Trigger phase change callback
        if (this.callbacks.onPhaseChange) {
            this.callbacks.onPhaseChange(this.currentPhase, this.currentRound, this.rounds);
        }
    }

    completeWorkout() {
        this.isRunning = false;
        this.reset();
        
        // Trigger complete callback
        if (this.callbacks.onComplete) {
            this.callbacks.onComplete();
        }
    }

    updateDisplay() {
        if (this.callbacks.onTick) {
            const minutes = Math.floor(this.secondsRemaining / 60);
            const seconds = this.secondsRemaining % 60;
            const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            this.callbacks.onTick(formattedTime);
        }
    }
}
