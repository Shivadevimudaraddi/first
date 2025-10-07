// script.js
class FitnessApp {
    constructor() {
        this.currentUser = null;
        this.workouts = [];
        this.workoutTimer = null;
        this.timerInterval = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSampleData();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.filterWorkouts(e.target.textContent);
                this.setActiveCategory(e.target);
            });
        });

        // Workout actions
        document.querySelectorAll('.workout-actions .btn-primary').forEach(button => {
            button.addEventListener('click', (e) => {
                const workoutCard = e.target.closest('.workout-card');
                const workoutName = workoutCard.querySelector('h3').textContent;
                this.startWorkout(workoutName);
            });
        });

        // Auth buttons
        document.querySelector('.auth-buttons .btn-outline').addEventListener('click', () => {
            this.showLoginModal();
        });

        document.querySelector('.auth-buttons .btn-primary').addEventListener('click', () => {
            this.showSignupModal();
        });

        // Hero buttons
        document.querySelector('.hero-buttons .btn-primary').addEventListener('click', () => {
            this.showSignupModal();
        });

        document.querySelector('.hero-buttons .btn-outline').addEventListener('click', () => {
            this.scrollToSection('#features');
        });

        // Modal events
        this.setupModalEvents();
    }

    scrollToSection(sectionId) {
        const element = document.querySelector(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }

    setActiveCategory(activeButton) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    filterWorkouts(category) {
        const workoutCards = document.querySelectorAll('.workout-card');
        
        workoutCards.forEach(card => {
            if (category === 'All') {
                card.style.display = 'block';
            } else {
                const workoutCategory = card.querySelector('h3').textContent.toLowerCase();
                if (workoutCategory.includes(category.toLowerCase())) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    startWorkout(workoutName) {
        this.showWorkoutTimer(workoutName);
        this.trackWorkoutStart(workoutName);
    }

    showWorkoutTimer(workoutName) {
        const timerHTML = `
            <div class="workout-timer" id="workoutTimer">
                <div class="modal-header">
                    <h3>${workoutName}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="timer-display">30:00</div>
                <div class="timer-controls">
                    <button class="btn btn-primary" id="startTimer">Start</button>
                    <button class="btn btn-outline" id="pauseTimer">Pause</button>
                    <button class="btn btn-danger" id="endWorkout">End Workout</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', timerHTML);
        const timer = document.getElementById('workoutTimer');
        timer.style.display = 'block';

        // Timer functionality
        let timeLeft = 30 * 60; // 30 minutes in seconds
        let isRunning = false;

        document.getElementById('startTimer').addEventListener('click', () => {
            if (!isRunning) {
                isRunning = true;
                this.timerInterval = setInterval(() => {
                    timeLeft--;
                    this.updateTimerDisplay(timeLeft);
                    
                    if (timeLeft <= 0) {
                        this.endWorkoutSession();
                    }
                }, 1000);
            }
        });

        document.getElementById('pauseTimer').addEventListener('click', () => {
            isRunning = false;
            clearInterval(this.timerInterval);
        });

        document.getElementById('endWorkout').addEventListener('click', () => {
            this.endWorkoutSession();
        });

        document.querySelector('#workoutTimer .close-modal').addEventListener('click', () => {
            timer.remove();
        });
    }

    updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.querySelector('.timer-display').textContent = display;
    }

    endWorkoutSession() {
        clearInterval(this.timerInterval);
        const timer = document.getElementById('workoutTimer');
        if (timer) timer.remove();
        
        this.updateProgressStats();
        alert('Workout completed! Great job! 🎉');
    }

    updateProgressStats() {
        // Update workout count
        const workoutCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
        const currentCount = parseInt(workoutCountElement.textContent);
        workoutCountElement.textContent = currentCount + 1;

        // Update calories (random between 200-400)
        const caloriesElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
        const currentCalories = parseInt(caloriesElement.textContent.replace(',', ''));
        const newCalories = currentCalories + Math.floor(Math.random() * 200) + 200;
        caloriesElement.textContent = newCalories.toLocaleString();
    }

    showLoginModal() {
        const modalHTML = `
            <div class="modal" id="loginModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Login to FitMitra</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                    </form>
                    <p style="text-align: center; margin-top: 15px;">
                        Don't have an account? <a href="#" id="showSignup">Sign up</a>
                    </p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.showModal('loginModal');

        document.getElementById('showSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showSignupModal();
        });
    }

    showSignupModal() {
        const modalHTML = `
            <div class="modal" id="signupModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Join FitMitra</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="signupForm">
                        <div class="form-group">
                            <label for="signupName">Full Name</label>
                            <input type="text" id="signupName" required>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <input type="password" id="signupPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="signupFitnessLevel">Fitness Level</label>
                            <select id="signupFitnessLevel" class="form-group" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.showModal('signupModal');
    }

    setupModalEvents() {
        // Login form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin();
            }
            
            if (e.target.id === 'signupForm') {
                e.preventDefault();
                this.handleSignup();
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hideModal(modalId);
                });
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulate login process
        this.currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        
        this.updateAuthUI();
        this.hideModal('loginModal');
        alert(`Welcome back, ${this.currentUser.name}!`);
    }

    handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const fitnessLevel = document.getElementById('signupFitnessLevel').value;
        
        // Simulate signup process
        this.currentUser = {
            name: name,
            email: email,
            fitnessLevel: fitnessLevel
        };
        
        this.updateAuthUI();
        this.hideModal('signupModal');
        alert(`Welcome to FitMitra, ${name}! Your ${fitnessLevel} fitness journey begins now!`);
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (this.currentUser) {
            authButtons.innerHTML = `
                <span>Welcome, ${this.currentUser.name}</span>
                <button class="btn btn-outline" id="logoutBtn">Logout</button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    handleLogout() {
        this.currentUser = null;
        const authButtons = document.querySelector('.auth-buttons');
        authButtons.innerHTML = `
            <button class="btn btn-outline">Login</button>
            <button class="btn btn-primary">Sign Up</button>
        `;
        this.bindEvents(); // Re-bind events for new buttons
    }

    checkAuthStatus() {
        // Check if user was previously logged in (simulated)
        const savedUser = localStorage.getItem('fitmitra_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateAuthUI();
        }
    }

    loadSampleData() {
        // Sample workout data
        this.workouts = [
            { name: 'Full Body Burn', category: 'Strength', duration: 30, calories: 280 },
            { name: 'Cardio Blast', category: 'Cardio', duration: 25, calories: 320 },
            { name: 'Yoga Flow', category: 'Yoga', duration: 40, calories: 180 },
            { name: 'HIIT Challenge', category: 'HIIT', duration: 20, calories: 350 },
            { name: 'Upper Body Strength', category: 'Strength', duration: 35, calories: 300 },
            { name: 'Core Crusher', category: 'Strength', duration: 25, calories: 250 }
        ];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FitnessApp();
});

// Additional utility functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function calculateCaloriesBurned(workoutType, duration) {
    const calorieRates = {
        'strength': 8,
        'cardio': 12,
        'yoga': 4,
        'hiit': 15
    };
    
    const rate = calorieRates[workoutType.toLowerCase()] || 8;
    return Math.round(rate * duration);
}