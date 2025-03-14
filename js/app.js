// Tabata Player Application
// No imports needed as scripts are loaded directly in HTML

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabataPlayer();
});

class TabataPlayer {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.populateTrackSelect();
        this.initAnimations();
        this.confetti = new ConfettiEffect();
        
        // Default settings
        this.settings = {
            autoPlayNext: true,
            showConfetti: true,
            theme: 'dark'
        };
        
        // Apply theme
        document.body.classList.add(this.settings.theme + '-theme');
        this.themeToggleBtn.textContent = this.settings.theme === 'dark' ? 'light_mode' : 'dark_mode';
    }

    initElements() {
        // Main elements
        this.trackSelect = document.getElementById('trackSelect');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.randomBtn = document.getElementById('randomBtn');
        this.nowPlaying = document.getElementById('nowPlaying');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.progressBar = document.getElementById('progressBar');
        this.progressContainer = document.getElementById('progressContainer');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeIcon = document.getElementById('volumeIcon');
        
        // Theme toggle
        this.themeToggleBtn = document.getElementById('themeToggleBtn');
    }

    initEventListeners() {
        // Audio player controls
        this.playBtn.addEventListener('click', () => this.playTrack());
        this.pauseBtn.addEventListener('click', () => this.pauseTrack());
        this.stopBtn.addEventListener('click', () => this.stopTrack());
        this.randomBtn.addEventListener('click', () => this.playRandomTrack());
        
        // Track selection
        this.trackSelect.addEventListener('change', () => {
            if (this.trackSelect.value) {
                this.playTrack();
            }
        });
        
        // Volume control
        this.volumeSlider.addEventListener('input', () => this.updateVolume());
        this.volumeIcon.addEventListener('click', () => this.toggleMute());
        
        // Progress bar
        this.progressContainer.addEventListener('click', (e) => this.seekTrack(e));
        
        // Audio player events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.handleTrackEnd());
        
        // Theme toggle
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    initAnimations() {
        // Initial fade-in animation
        gsap.to('.container', { 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            ease: 'power3.out' 
        });
        
        // Animate buttons
        gsap.from('.btn', {
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.5
        });
        
        // Animate header
        gsap.from('h1', {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Animate track select
        gsap.from('.track-select-container', {
            x: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.2
        });
        
        // Animate footer
        gsap.from('.footer', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.7
        });
    }

    populateTrackSelect() {
        // Clear existing options except the first one
        while (this.trackSelect.options.length > 1) {
            this.trackSelect.remove(1);
        }
        
        // Add track options
        tracks.forEach(track => {
            const option = document.createElement('option');
            option.value = track;
            option.textContent = track.replace('_tabata.mp3', '').replace(/_/g, ' ');
            this.trackSelect.appendChild(option);
        });
    }

    playTrack() {
        const selected = this.trackSelect.value;
        if (!selected) return;
        
        const baseUrl = 'https://filedn.eu/lV0RcQd1Re5jQr5XL93Ntwm/Tabata_Music/';
        const trackUrl = baseUrl + encodeURI(selected);
        
        if (this.audioPlayer.src !== trackUrl) {
            this.audioPlayer.src = trackUrl;
            
            // Animate now playing text
            gsap.to(this.nowPlaying, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    this.nowPlaying.textContent = 'Now Playing: ' + selected.replace('_tabata.mp3', '').replace(/_/g, ' ');
                    gsap.to(this.nowPlaying, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        }
        
        this.audioPlayer.play()
            .then(() => {
                // Pulse animation for play button
                gsap.to(this.playBtn, { 
                    scale: 1.05, 
                    duration: 0.15, 
                    yoyo: true, 
                    repeat: 1,
                    ease: 'power2.inOut'
                });
                
                // Add subtle glow to play button
                gsap.to(this.playBtn, {
                    boxShadow: '0 0 15px rgba(138, 43, 226, 0.4)',
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }

    pauseTrack() {
        this.audioPlayer.pause();
        
        // Pulse animation for pause button
        gsap.to(this.pauseBtn, { 
            scale: 1.05, 
            duration: 0.15, 
            yoyo: true, 
            repeat: 1,
            ease: 'power2.inOut'
        });
    }

    stopTrack() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.updateProgress();
        
        // Pulse animation for stop button
        gsap.to(this.stopBtn, { 
            scale: 1.05, 
            duration: 0.15, 
            yoyo: true, 
            repeat: 1,
            ease: 'power2.inOut'
        });
        
        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.backgroundColor = 'rgba(255, 82, 82, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.zIndex = '1';
        
        this.stopBtn.appendChild(ripple);
        
        gsap.to(ripple, {
            scale: 1.5,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
                ripple.remove();
            }
        });
    }

    updateVolume() {
        this.audioPlayer.volume = this.volumeSlider.value;
        this.updateVolumeIcon();
        
        // Subtle animation for volume change
        gsap.to(this.volumeIcon, {
            scale: 1.05,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
    }

    updateVolumeIcon() {
        const volume = this.audioPlayer.volume;
        if (volume === 0) {
            this.volumeIcon.textContent = 'volume_off';
        } else if (volume < 0.5) {
            this.volumeIcon.textContent = 'volume_down';
        } else {
            this.volumeIcon.textContent = 'volume_up';
        }
    }

    toggleMute() {
        if (this.audioPlayer.volume > 0) {
            this.lastVolume = this.audioPlayer.volume;
            this.audioPlayer.volume = 0;
            this.volumeSlider.value = 0;
        } else {
            this.audioPlayer.volume = this.lastVolume || 1;
            this.volumeSlider.value = this.audioPlayer.volume;
        }
        this.updateVolumeIcon();
        
        // Pulse animation for volume icon
        gsap.to(this.volumeIcon, { 
            scale: 1.05, 
            duration: 0.15, 
            yoyo: true, 
            repeat: 1,
            ease: 'power2.inOut'
        });
    }

    seekTrack(e) {
        const progressWidth = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audioPlayer.duration;
        
        if (duration) {
            this.audioPlayer.currentTime = (clickX / progressWidth) * duration;
            
            // Add ripple effect at click position
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.left = `${clickX - 10}px`;
            ripple.style.top = '-5px';
            ripple.style.transform = 'scale(0)';
            
            this.progressContainer.appendChild(ripple);
            
            gsap.to(ripple, {
                scale: 1,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => {
                    ripple.remove();
                }
            });
        }
    }

    updateProgress() {
        if (this.audioPlayer.duration) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.progressBar.style.width = progress + '%';
            this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
    }

    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audioPlayer.duration);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    handleTrackEnd() {
        if (this.settings.autoPlayNext) {
            // Find the next track in the list
            const currentIndex = this.trackSelect.selectedIndex;
            if (currentIndex < this.trackSelect.options.length - 1) {
                this.trackSelect.selectedIndex = currentIndex + 1;
            } else {
                this.trackSelect.selectedIndex = 1; // Loop back to first track (after the placeholder)
            }
            this.playTrack();
        } else {
            // Reset player state
            gsap.to(this.nowPlaying, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    this.nowPlaying.textContent = 'Now Playing: None';
                    gsap.to(this.nowPlaying, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
            
            this.progressBar.style.width = '0%';
            this.currentTimeEl.textContent = '0:00';
        }
        
        // Show confetti on track completion
        if (this.settings.showConfetti) {
            this.confetti.start();
            setTimeout(() => this.confetti.stop(), 3000);
        }
    }

    toggleTheme() {
        const currentTheme = this.settings.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Animate theme transition
        gsap.to('.container', {
            opacity: 0.8,
            scale: 0.98,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                document.body.classList.remove(currentTheme + '-theme');
                document.body.classList.add(newTheme + '-theme');
                this.settings.theme = newTheme;
                this.themeToggleBtn.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
                
                gsap.to('.container', {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
        
        // Rotate theme toggle button
        gsap.to(this.themeToggleBtn, { 
            rotation: '+=360', 
            duration: 0.8, 
            ease: 'power2.inOut' 
        });
    }

    playRandomTrack() {
        // Get all available tracks (skip the first placeholder option)
        const options = Array.from(this.trackSelect.options).slice(1);
        
        if (options.length === 0) return;
        
        // Select a random track
        const randomIndex = Math.floor(Math.random() * options.length);
        const randomOption = options[randomIndex];
        
        // Update the select element
        this.trackSelect.value = randomOption.value;
        
        // Create a surprise effect
        this.createSurpriseEffect();
        
        // Play the selected track
        this.playTrack();
    }
    
    createSurpriseEffect() {
        // Create a surprise overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10';
        overlay.style.borderRadius = '24px';
        overlay.style.opacity = '0';
        
        // Create surprise text
        const text = document.createElement('div');
        text.textContent = '🎲 Surprise!';
        text.style.color = 'white';
        text.style.fontSize = '2.5rem';
        text.style.fontWeight = 'bold';
        text.style.opacity = '0';
        text.style.transform = 'scale(0.5)';
        
        overlay.appendChild(text);
        document.querySelector('.container').appendChild(overlay);
        
        // Animate the surprise effect
        gsap.to(overlay, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(text, {
                    opacity: 1,
                    scale: 1.2,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    onComplete: () => {
                        gsap.to(text, {
                            opacity: 0,
                            scale: 2,
                            duration: 0.5,
                            delay: 0.5,
                            ease: 'power2.in'
                        });
                        gsap.to(overlay, {
                            opacity: 0,
                            duration: 0.5,
                            delay: 0.8,
                            ease: 'power2.in',
                            onComplete: () => {
                                overlay.remove();
                            }
                        });
                    }
                });
            }
        });
        
        // Pulse animation for random button
        gsap.to(this.randomBtn, { 
            scale: 1.05, 
            duration: 0.15, 
            yoyo: true, 
            repeat: 2,
            ease: 'power2.inOut'
        });
        
        // Add confetti effect
        this.confetti.start();
        setTimeout(() => this.confetti.stop(), 2000);
    }
}
