// Confetti Effect for Tabata Player
class ConfettiEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.colors = [
            '#6200ea', // Primary color
            '#03dac6', // Secondary color
            '#ff3d00', // Orange
            '#00c853', // Green
            '#ffeb3b', // Yellow
            '#e91e63', // Pink
            '#2196f3'  // Blue
        ];
        this.init();
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'confetti-container';
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Add resize event listener
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        // Add canvas to DOM if not already there
        if (!document.body.contains(this.canvas)) {
            document.body.appendChild(this.canvas);
        }
        
        // Create particles
        this.createParticles();
        
        // Start animation
        this.animate();
    }

    stop() {
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Remove canvas from DOM
        if (document.body.contains(this.canvas)) {
            document.body.removeChild(this.canvas);
        }
        
        // Clear particles
        this.particles = [];
    }

    createParticles() {
        // Clear existing particles
        this.particles = [];
        
        // Create new particles
        for (let i = 0; i < 200; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: Math.random() * 10 + 5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                speed: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                oscillationSpeed: Math.random() * 0.5 + 0.5,
                oscillationDistance: Math.random() * 40 + 20
            });
        }
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.y += p.speed;
            p.x += Math.sin(p.y * p.oscillationSpeed / 100) * p.oscillationDistance;
            
            // Update rotation
            p.rotation += p.rotationSpeed;
            
            // Draw particle
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            
            // Draw different shapes
            if (i % 3 === 0) {
                // Rectangle
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else if (i % 3 === 1) {
                // Circle
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Triangle
                this.ctx.beginPath();
                this.ctx.moveTo(0, -p.size / 2);
                this.ctx.lineTo(p.size / 2, p.size / 2);
                this.ctx.lineTo(-p.size / 2, p.size / 2);
                this.ctx.closePath();
                this.ctx.fill();
            }
            
            this.ctx.restore();
            
            // Remove particles that are off screen
            if (p.y > this.canvas.height + p.size) {
                this.particles[i] = {
                    x: Math.random() * this.canvas.width,
                    y: -p.size,
                    size: p.size,
                    color: p.color,
                    speed: p.speed,
                    rotation: p.rotation,
                    rotationSpeed: p.rotationSpeed,
                    oscillationSpeed: p.oscillationSpeed,
                    oscillationDistance: p.oscillationDistance
                };
            }
        }
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}
