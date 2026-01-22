class ProcrastinationTimer {
    constructor() {
        this.startTime = null;
        this.pausedTime = 0;
        this.isRunning = false;
        this.totalSeconds = 0;
        this.lastRecord = 0;
        this.ballCount = 0;
        
        // Элементы DOM
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.timerEl = document.getElementById('timer');
        this.energyEl = document.getElementById('energy');
        this.thoughtsEl = document.getElementById('thoughts');
        this.efficiencyEl = document.getElementById('efficiency');
        this.recordEl = document.getElementById('record');
        this.statusEl = document.getElementById('status');
        this.lastUpdateEl = document.getElementById('lastUpdate');
        
        // Кнопки
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Персонаж
        this.footEl = document.getElementById('foot');
        this.ballsEl = document.getElementById('balls');
        
        // Инициализация
        this.loadRecord();
        this.setupEventListeners();
        this.updateDisplay();
        this.animateCharacter();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Автоматический старт при загрузке
        this.start();
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.pausedTime;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.statusEl.textContent = 'Пинаю хуи...';
            this.statusEl.style.color = '#2ecc71';
            this.update();
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.pausedTime = Date.now() - this.startTime;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.statusEl.textContent = 'На паузе';
            this.statusEl.style.color = '#e67e22';
        }
    }
    
    reset() {
        if (confirm('Точно сбросить таймер? Всё потеряется!')) {
            this.isRunning = false;
            this.startTime = null;
            this.pausedTime = 0;
            this.totalSeconds = 0;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.statusEl.textContent = 'Сброшено';
            this.statusEl.style.color = '#e74c3c';
            this.updateDisplay();
            this.clearBalls();
        }
    }
    
    update() {
        if (this.isRunning) {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - this.startTime) / 1000);
            this.totalSeconds = elapsed;
            
            this.updateDisplay();
            this.updateStats();
            this.addBallIfNeeded();
            
            // Проверка рекорда
            this.checkRecord();
            
            // Обновление каждую секунду
            setTimeout(() => this.update(), 1000);
        }
    }
    
    updateDisplay() {
        const days = Math.floor(this.totalSeconds / 86400);
        const hours = Math.floor((this.totalSeconds % 86400) / 3600);
        const minutes = Math.floor((this.totalSeconds % 3600) / 60);
        const seconds = this.totalSeconds % 60;
        
        this.daysEl.textContent = days.toString().padStart(2, '0');
        this.hoursEl.textContent = hours.toString().padStart(2, '0');
        this.minutesEl.textContent = minutes.toString().padStart(2, '0');
        this.secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Обновляем время последнего обновления
        const now = new Date();
        this.lastUpdateEl.textContent = `Обновлено: ${now.toLocaleTimeString()}`;
    }
    
    updateStats() {
        // Затрачено энергии (очень мало)
        const energy = (this.totalSeconds * 0.001).toFixed(3);
        this.energyEl.textContent = `${energy} кДж`;
        
        // Мыслительная активность (уменьшается со временем)
        const thoughts = Math.max(0, 100 - (this.totalSeconds * 0.01));
        this.thoughtsEl.textContent = `${thoughts.toFixed(1)}%`;
        
        // Эффективность безделья (растет со временем)
        const efficiency = Math.min(100, 10 + (this.totalSeconds * 0.1));
        this.efficiencyEl.textContent = `${efficiency.toFixed(0)}% безделья`;
    }
    
    addBallIfNeeded() {
        // Добавляем новый "шар" каждые 30 секунд
        if (this.totalSeconds > 0 && this.totalSeconds % 30 === 0 && 
            this.totalSeconds !== this.lastRecord) {
            this.lastRecord = this.totalSeconds;
            this.addBall();
        }
    }
    
    addBall() {
        this.ballCount++;
        const ball = document.createElement('div');
        ball.className = 'ball';
        
        // Случайная позиция
        const left = Math.random() * 80 + 10;
        const size = Math.random() * 20 + 20;
        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 2;
        
        ball.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            background: hsl(${Math.random() * 60 + 40}, 100%, 50%);
        `;
        
        this.ballsEl.appendChild(ball);
        
        // Удаляем старые шары, если их слишком много
        if (this.ballsEl.children.length > 20) {
            this.ballsEl.removeChild(this.ballsEl.firstChild);
        }
    }
    
    clearBalls() {
        this.ballsEl.innerHTML = '';
        this.ballCount = 0;
    }
    
    animateCharacter() {
        // Анимация "пинка"
        let kickDirection = 1;
        setInterval(() => {
            if (this.isRunning) {
                kickDirection *= -1;
                this.footEl.style.transform = `rotate(${kickDirection * 30}deg)`;
            }
        }, 1000);
    }
    
    checkRecord() {
        const record = this.getRecord();
        if (this.totalSeconds > record) {
            this.setRecord(this.totalSeconds);
            this.updateRecordDisplay();
            
            // Анимация при новом рекорде
            if (this.totalSeconds > 0) {
                this.timerEl.style.color = '#f1c40f';
                setTimeout(() => {
                    this.timerEl.style.color = '#2ecc71';
                }, 500);
            }
        }
    }
    
    getRecord() {
        return parseInt(localStorage.getItem('procrastinationRecord')) || 0;
    }
    
    setRecord(seconds) {
        localStorage.setItem('procrastinationRecord', seconds.toString());
    }
    
    updateRecordDisplay() {
        const record = this.getRecord();
        if (record > 0) {
            const days = Math.floor(record / 86400);
            const hours = Math.floor((record % 86400) / 3600);
            const minutes = Math.floor((record % 3600) / 60);
            this.recordEl.textContent = `${days}д ${hours}ч ${minutes}м`;
        } else {
            this.recordEl.textContent = 'Ещё не установлен';
        }
    }
    
    loadRecord() {
        this.updateRecordDisplay();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.procrastinationTimer = new ProcrastinationTimer();
});
