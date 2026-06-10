document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const lockScreen = document.getElementById('lock-screen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const lockIcon = document.getElementById('lock-icon');
    const bgOverlay = document.querySelector('.background-overlay');

    // Music Elements
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const musicNoteIcon = document.querySelector('.music-note-icon');
    const musicMuteIcon = document.querySelector('.music-mute-icon');

    // Video Elements
    const videoPoster = document.getElementById('video-poster');
    const videoWrapper = document.getElementById('video-element-wrapper');
    const video = document.getElementById('anniversary-video');
    const videoPlayPause = document.getElementById('video-play-pause');
    const videoProgressContainer = document.getElementById('progress-container');
    const videoProgressBar = document.getElementById('progress-bar');
    const videoTimeDisplay = document.getElementById('video-time');
    const videoMute = document.getElementById('video-mute');
    const videoFullscreen = document.getElementById('video-fullscreen');

    // Canvas & Containers
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const fallingContainer = document.getElementById('falling-container');

    // Set canvas sizes
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ==========================================
    // PARTICLE & SPARKLE TRAIL SYSTEM
    // ==========================================
    const particles = [];
    const sparkles = [];

    class HeartParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 12 + 6;
            this.speedY = -(Math.random() * 1.5 + 0.5);
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = `hsl(${Math.random() * 20 + 340}, 85%, 65%)`; // Pink-Red spectrum
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < -20) {
                this.y = canvas.height + 20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Heart shape drawing formula
            const topY = this.y - this.size / 2;
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x - this.size, topY, this.x - this.size, this.y - this.size);
            ctx.bezierCurveTo(this.x - this.size, this.y - this.size * 1.7, this.x - this.size / 3, this.y - this.size * 2, this.x, this.y - this.size * 1.3);
            ctx.bezierCurveTo(this.x + this.size / 3, this.y - this.size * 2, this.x + this.size, this.y - this.size * 1.7, this.x + this.size, this.y - this.size);
            ctx.bezierCurveTo(this.x + this.size, this.y - this.size / 2, this.x + this.size / 2, this.topY, this.x, this.y);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    class SparkleTrail {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 2;
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.speedY = (Math.random() - 0.5) * 1.2 - 0.3;
            this.opacity = 1;
            this.decay = Math.random() * 0.03 + 0.015;
            this.color = Math.random() > 0.5 ? 'var(--gold)' : 'rgba(230, 57, 70, 0.8)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize background particles
    for (let i = 0; i < 40; i++) {
        particles.push(new HeartParticle());
    }

    // Mouse movement trail listener
    window.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.35) { // Limit spawn rate for performance
            sparkles.push(new SparkleTrail(e.clientX, e.clientY));
        }
    });

    // Touch movement trail for mobile
    window.addEventListener('touchmove', (e) => {
        if (Math.random() < 0.35 && e.touches.length > 0) {
            sparkles.push(new SparkleTrail(e.touches[0].clientX, e.touches[0].clientY));
        }
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background floating hearts
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw cursor trail sparkles
        for (let i = sparkles.length - 1; i >= 0; i--) {
            sparkles[i].update();
            if (sparkles[i].opacity <= 0) {
                sparkles.splice(i, 1);
            } else {
                sparkles[i].draw();
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // CREDENTIALS CHECK & TRANSITION
    // ==========================================
    const correctUser = "chamodi";
    const correctPass = "2025.06.13";
    let isUnlocked = false;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameVal = usernameInput.value.trim().toLowerCase();
        const passwordVal = passwordInput.value.trim();

        if (usernameVal === correctUser && passwordVal === correctPass) {
            unlockSite();
        } else {
            showError();
        }
    });

    function showError() {
        errorMessage.textContent = "Oops! That's not the correct coordinate, sweetheart.";
        errorMessage.style.opacity = '1';
        
        // Shake card effect
        const card = document.querySelector('.lock-card');
        card.style.animation = 'none';
        void card.offsetWidth; // Trigger reflow
        card.style.animation = 'shakeCard 0.5s ease-in-out';
        
        // Custom shake animation style injection
        if (!document.getElementById('shake-style')) {
            const style = document.createElement('style');
            style.id = 'shake-style';
            style.textContent = `
                @keyframes shakeCard {
                    0%, 100% { transform: translateX(0); }
                    15%, 45%, 75% { transform: translateX(-8px); }
                    30%, 60%, 90% { transform: translateX(8px); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            card.style.animation = 'lockCardFloat 6s ease-in-out infinite alternate';
        }, 500);
    }

    function unlockSite() {
        isUnlocked = true;
        errorMessage.style.opacity = '0';
        lockIcon.setAttribute('name', 'heart');
        lockIcon.parentElement.style.animation = 'pulseHeart 0.3s infinite alternate';

        // Add class to lock card to exit
        const card = document.querySelector('.lock-card');
        card.style.transform = 'scale(0.9) translateY(30px)';
        card.style.opacity = '0';

        setTimeout(() => {
            lockScreen.classList.add('fade-out');
            dashboard.classList.remove('hidden');
            
            // Adjust background image overlay
            if (bgOverlay) {
                bgOverlay.style.filter = 'brightness(0.35) contrast(1.1) saturate(0.95) blur(1px)';
            }

            // Start romantic systems
            startLoveCounter();
            startFallingElements();
            initScrollAnimations();
            triggerConfetti();

            // Try autoplay music (standard brower allow as there was user gesture)
            toggleMusic(true);
        }, 800);
    }

    // ==========================================
    // ROMANTIC MUSIC PLAYER CONTROLLER
    // ==========================================
    let isMusicPlaying = false;

    function toggleMusic(playState = null) {
        const targetState = playState !== null ? playState : !isMusicPlaying;
        
        if (targetState) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicNoteIcon.classList.remove('hidden');
                musicMuteIcon.classList.add('hidden');
                musicToggle.style.animation = 'pulseHeart 1.5s infinite';
            }).catch(err => {
                console.log("Audio autoplay blocked by browser policy. Waiting for interaction.", err);
                isMusicPlaying = false;
            });
        } else {
            bgMusic.pause();
            isMusicPlaying = false;
            musicNoteIcon.classList.add('hidden');
            musicMuteIcon.classList.remove('hidden');
            musicToggle.style.animation = 'none';
        }
    }

    musicToggle.addEventListener('click', () => {
        toggleMusic();
    });

    // ==========================================
    // THE LOVE COUNTER (JUNE 13, 2025)
    // ==========================================
    const startDate = new Date('2025-06-13T00:00:00');

    function startLoveCounter() {
        function updateCounter() {
            const now = new Date();
            const difference = now.getTime() - startDate.getTime();

            if (difference < 0) return; // Future date safety

            // Precise calculation for calendar-accurate years
            let years = now.getFullYear() - startDate.getFullYear();
            let birthMonth = startDate.getMonth();
            let currentMonth = now.getMonth();
            let birthDay = startDate.getDate();
            let currentDay = now.getDate();

            if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
                years--;
            }

            // Days calculation since start of current anniversary year
            let yearTarget = new Date(startDate.getTime());
            yearTarget.setFullYear(startDate.getFullYear() + years);
            let remainingMs = now.getTime() - yearTarget.getTime();

            const msInDay = 1000 * 60 * 60 * 24;
            const msInHour = 1000 * 60 * 60;
            const msInMin = 1000 * 60;

            const days = Math.floor(remainingMs / msInDay);
            remainingMs %= msInDay;

            const hours = Math.floor(remainingMs / msInHour);
            remainingMs %= msInHour;

            const minutes = Math.floor(remainingMs / msInMin);
            remainingMs %= msInMin;

            const seconds = Math.floor(remainingMs / 1000);

            // Render to DOM
            document.getElementById('years').textContent = String(years).padStart(2, '0');
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateCounter();
        setInterval(updateCounter, 1000);
    }

    // ==========================================
    // INTERACTIVE LETTERS BOARD
    // ==========================================
    const letterCards = document.querySelectorAll('.letter-card');

    letterCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If clicking the close button inside the back of card, flip it closed
            if (e.target.classList.contains('close-letter-btn')) {
                e.stopPropagation();
                card.classList.remove('open');
                return;
            }

            // Otherwise, open/flip card
            if (!card.classList.contains('open')) {
                // Close other open cards for clean interface
                letterCards.forEach(otherCard => otherCard.classList.remove('open'));
                card.classList.add('open');
                triggerHeartPop(card);
            }
        });
    });

    // Spawn tiny floating hearts near the clicked letter
    function triggerHeartPop(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 40 + 20;
            const px = centerX + Math.cos(angle) * distance;
            const py = centerY + Math.sin(angle) * distance;
            sparkles.push(new SparkleTrail(px, py));
        }
    }

    // ==========================================
    // FALLING ROSE PETALS / HEARTS EMITTER
    // ==========================================
    const fallingEmojis = ['❤️', '💖', '🌸', '🌹', '✨', '💕'];
    
    function startFallingElements() {
        setInterval(() => {
            if (!isUnlocked) return;

            const el = document.createElement('div');
            el.className = 'falling-element';
            el.textContent = fallingEmojis[Math.floor(Math.random() * fallingEmojis.length)];
            
            const randomSize = Math.random() * 18 + 12; // 12px to 30px
            el.style.fontSize = `${randomSize}px`;
            el.style.left = `${Math.random() * 100}vw`;
            
            const randomDuration = Math.random() * 6 + 6; // 6s to 12s
            el.style.animationDuration = `${randomDuration}s`;
            
            fallingContainer.appendChild(el);

            // Clean up elements after animation finishes
            setTimeout(() => {
                el.remove();
            }, randomDuration * 1000);
        }, 750); // Emitters frequency
    }

    // ==========================================
    // SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================
    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in-element');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve to keep element permanently visible after scroll
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // CUSTOM MEDIA PLAYER / VIDEO SECTION
    // ==========================================
    let wasMusicPlayingBeforeVideo = false;

    videoPoster.addEventListener('click', () => {
        // Prepare to play the video
        videoPoster.classList.add('hidden');
        videoWrapper.classList.remove('hidden');
        
        // Pause background music during video to prevent sound overlap
        if (isMusicPlaying) {
            wasMusicPlayingBeforeVideo = true;
            toggleMusic(false);
        } else {
            wasMusicPlayingBeforeVideo = false;
        }

        // Start video playback
        video.play().then(() => {
            updatePlayPauseIcon(true);
        }).catch(err => {
            console.log("Video playback failed", err);
        });
    });

    function updatePlayPauseIcon(isPlaying) {
        if (isPlaying) {
            videoPlayPause.innerHTML = '<ion-icon name="pause"></ion-icon>';
        } else {
            videoPlayPause.innerHTML = '<ion-icon name="play"></ion-icon>';
        }
    }

    // Play/Pause button
    videoPlayPause.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            updatePlayPauseIcon(true);
            if (isMusicPlaying) {
                toggleMusic(false);
            }
        } else {
            video.pause();
            updatePlayPauseIcon(false);
        }
    });

    // Mute button
    videoMute.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
            videoMute.innerHTML = '<ion-icon name="volume-mute"></ion-icon>';
        } else {
            videoMute.innerHTML = '<ion-icon name="volume-high"></ion-icon>';
        }
    });

    // Fullscreen button
    videoFullscreen.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Safari support
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen(); // IE11 support
        }
    });

    // Video progress update
    video.addEventListener('timeupdate', () => {
        const percentage = (video.currentTime / video.duration) * 100;
        videoProgressBar.style.width = `${percentage}%`;
        
        // Format timing display
        const formatTime = (time) => {
            const mins = Math.floor(time / 60);
            const secs = Math.floor(time % 60);
            return `${mins}:${String(secs).padStart(2, '0')}`;
        };

        const current = formatTime(video.currentTime);
        const duration = isNaN(video.duration) ? '0:30' : formatTime(video.duration);
        videoTimeDisplay.textContent = `${current} / ${duration}`;
    });

    // Seekable progress bar click
    videoProgressContainer.addEventListener('click', (e) => {
        const rect = videoProgressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const totalWidth = rect.width;
        const clickRatio = offsetX / totalWidth;
        video.currentTime = clickRatio * video.duration;
    });

    // Video end event - resume music and celebrate!
    video.addEventListener('ended', () => {
        updatePlayPauseIcon(false);
        triggerConfetti();

        // Resume background music if it was running previously
        if (wasMusicPlayingBeforeVideo) {
            setTimeout(() => {
                toggleMusic(true);
            }, 1000);
        }
    });

    // ==========================================
    // CELEBRATION CONFETTI ENGINE
    // ==========================================
    function triggerConfetti() {
        confettiCanvas.classList.remove('hidden');
        const confettiCtx = confettiCanvas.getContext('2d');
        const pieces = [];
        const colors = ['#f4a261', '#e76f51', '#e63946', '#dfb26b', '#ffb5a7'];

        class ConfettiPiece {
            constructor() {
                this.x = Math.random() * confettiCanvas.width;
                this.y = -20;
                this.size = Math.random() * 8 + 6;
                this.speedY = Math.random() * 3 + 2;
                this.speedX = (Math.random() - 0.5) * 3;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 4 - 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;
            }

            draw() {
                confettiCtx.save();
                confettiCtx.translate(this.x, this.y);
                confettiCtx.rotate(this.rotation * Math.PI / 180);
                confettiCtx.fillStyle = this.color;
                confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                confettiCtx.restore();
            }
        }

        // Spawn 120 confetti pieces
        for (let i = 0; i < 120; i++) {
            pieces.push(new ConfettiPiece());
        }

        function animateConfetti() {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let active = false;

            pieces.forEach(p => {
                if (p.y < confettiCanvas.height) {
                    p.update();
                    p.draw();
                    active = true;
                }
            });

            if (active) {
                requestAnimationFrame(animateConfetti);
            } else {
                confettiCanvas.classList.add('hidden');
            }
        }

        animateConfetti();
    }
});
