class ProcrastinationTimer {
    constructor() {
        this.startTime = null;
        this.pausedTime = 0;
        this.isRunning = false;
        this.totalSeconds = 0;
        this.levels = [
            { name: 'Новичок', seconds: 60 },
            { name: 'Лентяй', seconds: 300 },
            { name: 'Мастер прокрастинации', seconds: 1800 },
            { name: 'Гуру безделья', seconds: 7200 },
            { name: 'Легенда', seconds: 86400 }
        ];
        
        // Достижения
        this.achievements = [
            { id: 1, name: 'Первые 30 секунд', desc: 'Только начал', seconds: 30, icon: 'fas fa-baby' },
            { id: 2, name: '5 минут', desc: 'Разогрелся', seconds: 300, icon: 'fas fa-clock' },
            { id: 3, name: 'Полчаса', desc: 'Вошел в ритм', seconds: 1800, icon: 'fas fa-couch' },
            { id: 4, name: '1 час', desc: 'Профессионал', seconds: 3600, icon: 'fas fa-user-tie' },
            { id: 5, name: '3 часа', desc: 'Эксперт', seconds: 10800, icon: 'fas fa-graduation-cap' },
            { id: 6, name: 'Сутки', desc: 'Легенда', seconds: 86400, icon: 'fas fa-crown' },
            { id: 7, name: 'Неделя', desc: 'Бог прокрастинации', seconds: 604800, icon: 'fas fa-star' }
        ];
        
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
        this.gifStatusEl = document.getElementById('gifStatus');
        this.progressFillEl = document.getElementById('progressFill');
        this.currentLevelEl = document.getElementById('currentLevel');
        this.achievementsGridEl = document.getElementById('achievementsGrid');
        
        // Кнопки
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // GIF
        this.procrastinationGif = document.getElementById('procrastinationGif');
        
        // Инициализация
        this.loadRecord();
        this.loadAchievements();
        this.setupEventListeners();
        this.renderAchievements();
        this.updateDisplay();
        this.animateGif();
        this.setupGifErrorHandler();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Автоматический старт при загрузке
        setTimeout(() => this.start(), 1000);
        
        // Анимация при наведении на GIF
        this.procrastinationGif.addEventListener('mouseenter', () => {
            this.gifStatusEl.textContent = 'Активно пинаю!';
            this.gifStatusEl.style.color = '#e74c3c';
        });
        
        this.procrastinationGif.addEventListener('mouseleave', () => {
            const statuses = ['В процессе...', 'Продолжаю...', 'Не останавливаюсь...'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            this.gifStatusEl.textContent = randomStatus;
            this.gifStatusEl.style.color = '#2ecc71';
        });
        
        // Обновление при возвращении на вкладку
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.isRunning) {
                // Корректировка времени при возвращении
                const currentTime = Date.now();
                const elapsed = Math.floor((currentTime - this.startTime) / 1000);
                this.totalSeconds = elapsed;
                this.updateDisplay();
            }
        });
    }
    
    setupGifErrorHandler() {
        this.procrastinationGif.addEventListener('error', () => {
            console.log('GIF не загрузился, используем заглушку');
            this.procrastinationGif.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDUwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjMzQ0OTVFIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0Ij5QSU5BTiBIVUk8L3RleHQ+Cjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRjFDNDBGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkdJRiBvbiB5YXBmaWxlcy5jb208L3RleHQ+Cjwvc3ZnPg==';
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            if (this.startTime === null) {
                this.startTime = Date.now();
            } else {
                // Продолжаем с того места, где остановились
                this.startTime = Date.now() - this.pausedTime;
            }
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.statusEl.textContent = 'Пинаю хуи...';
            this.statusEl.style.color = '#2ecc71';
            this.gifStatusEl.textContent = 'В процессе...';
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
            this.gifStatusEl.textContent = 'Пауза...';
            this.gifStatusEl.style.color = '#e67e22';
        }
    }
    
    reset() {
        if (confirm('Точно сбросить таймер? Вся статистика обнулится!')) {
            this.isRunning = false;
            this.startTime = null;
            this.pausedTime = 0;
            this.totalSeconds = 0;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.statusEl.textContent = 'Сброшено';
            this.statusEl.style.color = '#e74c3c';
            this.gifStatusEl.textContent = 'Ожидание...';
            this.gifStatusEl.style.color = '#95a5a6';
            this.updateDisplay();
            this.updateProgress();
        }
    }
    
    update() {
        if (this.isRunning) {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - this.startTime) / 1000);
            
            // Сохраняем разницу во времени для коррекции
            const timeDiff = elapsed - this.totalSeconds;
            this.totalSeconds = elapsed;
            
            this.updateDisplay();
            this.updateStats();
            this.updateProgress();
            
            // Проверяем достижения только если время изменилось
            if (timeDiff > 0) {
                this.checkAchievements();
                this.checkRecord();
            }
            
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
        
        // Обновляем статус GIF в зависимости от времени
        this.updateGifStatus();
    }
    
    updateGifStatus() {
        if (this.totalSeconds >= 86400) {
            this.gifStatusEl.textContent = 'ЛЕГЕНДА!';
            this.gifStatusEl.style.color = '#f1c40f';
            this.gifStatusEl.style.textShadow = '0 0 10px #f1c40f';
        } else if (this.totalSeconds >= 7200) {
            this.gifStatusEl.textContent = 'Гуру безделья';
            this.gifStatusEl.style.color = '#9b59b6';
        } else if (this.totalSeconds >= 1800) {
            this.gifStatusEl.textContent = 'Мастер в деле!';
            this.gifStatusEl.style.color = '#3498db';
        } else if (this.totalSeconds >= 300) {
            this.gifStatusEl.textContent = 'Разогнался!';
            this.gifStatusEl.style.color = '#2ecc71';
        } else {
            this.gifStatusEl.textContent = 'В процессе...';
            this.gifStatusEl.style.color = '#2ecc71';
        }
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
    
    updateProgress() {
        // Определяем текущий уровень
        let currentLevel = this.levels[0];
        let nextLevel = this.levels[1] || this.levels[0];
        
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (this.totalSeconds >= this.levels[i].seconds) {
                currentLevel = this.levels[i];
                nextLevel = this.levels[i + 1] || this.levels[this.levels.length - 1];
                break;
            }
        }
        
        // Обновляем уровень
        this.currentLevelEl.textContent = `Уровень: ${currentLevel.name}`;
        
        // Обновляем прогресс-бар
        let progress;
        if (currentLevel.name === 'Легенда') {
            progress = 100;
        } else {
            progress = Math.min(100, (this.totalSeconds / nextLevel.seconds) * 100);
        }
        this.progressFillEl.style.width = `${progress}%`;
        
        // Цвет прогресс-бара в зависимости от уровня
        if (progress >= 80) {
            this.progressFillEl.style.background = 'linear-gradient(90deg, #2ecc71, #f1c40f, #e74c3c)';
        } else if (progress >= 50) {
            this.progressFillEl.style.background = 'linear-gradient(90deg, #2ecc71, #f1c40f)';
        } else {
            this.progressFillEl.style.background = 'linear-gradient(90deg, #2ecc71, #3498db)';
        }
    }
    
    animateGif() {
        // Периодически меняем яркость/контраст GIF для эффекта "живости"
        setInterval(() => {
            if (this.isRunning) {
                const brightness = 1 + Math.sin(Date.now() / 10000) * 0.1;
                const contrast = 1 + Math.cos(Date.now() / 15000) * 0.1;
                this.procrastinationGif.style.filter = 
                    `brightness(${brightness}) contrast(${contrast}) saturate(1.1)`;
            }
        }, 100);
    }
    
    checkAchievements() {
        const unlocked = this.getUnlockedAchievements();
        let newAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (this.totalSeconds >= achievement.seconds && 
                !unlocked.includes(achievement.id)) {
                newAchievements.push(achievement);
                unlocked.push(achievement.id);
            }
        });
        
        // Сохраняем все новые достижения
        if (newAchievements.length > 0) {
            localStorage.setItem('procrastinationAchievements', JSON.stringify(unlocked));
            newAchievements.forEach(achievement => {
                this.unlockAchievement(achievement);
            });
        }
    }
    
    unlockAchievement(achievement) {
        // Визуальный эффект
        const achievementEl = document.querySelector(`[data-id="${achievement.id}"]`);
        if (achievementEl) {
            achievementEl.classList.add('unlocked', 'unlocked-new');
            setTimeout(() => {
                achievementEl.classList.remove('unlocked-new');
            }, 500);
            
            // Уведомление
            this.showNotification(`🎉 Достижение: ${achievement.name}`);
        }
        
        this.renderAchievements();
    }
    
    showNotification(text) {
        // Удаляем старые уведомления
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #f1c40f, #e67e22);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.5s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-weight: bold;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    getUnlockedAchievements() {
        const stored = localStorage.getItem('procrastinationAchievements');
        return stored ? JSON.parse(stored) : [1]; // Первое достижение по умолчанию
    }
    
    loadAchievements() {
        // Автоматически разблокируем первое достижение при первой загрузке
        const unlocked = this.getUnlockedAchievements();
        localStorage.setItem('procrastinationAchievements', JSON.stringify(unlocked));
    }
    
    renderAchievements() {
        this.achievementsGridEl.innerHTML = '';
        const unlocked = this.getUnlockedAchievements();
        
        this.achievements.forEach(achievement => {
            const isUnlocked = unlocked.includes(achievement.id);
            
            const div = document.createElement('div');
            div.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
            div.setAttribute('data-id', achievement.id);
            
            div.innerHTML = `
                <i class="${achievement.icon}"></i>
                <h4>${achievement.name}</h4>
                <p>${achievement.desc}</p>
                <small>${Math.floor(achievement.seconds / 60)} мин+</small>
            `;
            
            this.achievementsGridEl.appendChild(div);
        });
    }
    
    checkRecord() {
        const record = this.getRecord();
        if (this.totalSeconds > record) {
            const oldRecord = record;
            this.setRecord(this.totalSeconds);
            this.updateRecordDisplay();
            
            // Анимация при новом рекорде
            if (this.totalSeconds > 0 && oldRecord > 0) {
                this.celebrateNewRecord(oldRecord);
            }
        }
    }
    
    celebrateNewRecord(oldRecord) {
        // Анимация таймера
        this.timerEl.classList.add('timer-highlight');
        setTimeout(() => {
            this.timerEl.classList.remove('timer-highlight');
        }, 1000);
        
        // Анимация GIF
        this.procrastinationGif.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.procrastinationGif.style.transform = 'scale(1)';
        }, 500);
        
        // Специальное уведомление для рекорда
        const days = Math.floor(this.totalSeconds / 86400);
        const hours = Math.floor((this.totalSeconds % 86400) / 3600);
        const minutes = Math.floor((this.totalSeconds % 3600) / 60);
        
        let recordText = '🏆 Новый рекорд! ';
        if (days > 0) recordText += `${days}д `;
        if (hours > 0) recordText += `${hours}ч `;
        if (minutes > 0) recordText += `${minutes}м`;
        
        this.showNotification(recordText);
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
            const seconds = record % 60;
            
            let recordText = '';
            if (days > 0) recordText += `${days}д `;
            if (hours > 0) recordText += `${hours}ч `;
            if (minutes > 0) recordText += `${minutes}м `;
            if (seconds > 0 && days === 0) recordText += `${seconds}с`;
            
            this.recordEl.textContent = recordText.trim();
        } else {
            this.recordEl.textContent = 'Ещё не установлен';
        }
    }
    
    loadRecord() {
        this.updateRecordDisplay();
    }
}

// Добавляем CSS для анимаций уведомлений, если еще не добавлены
if (!document.querySelector('#procrastination-styles')) {
    const style = document.createElement('style');
    style.id = 'procrastination-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes highlightTimer {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .timer-highlight {
            animation: highlightTimer 1s ease;
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.procrastinationTimer = new ProcrastinationTimer();
    
    // Добавляем анимацию загрузки
    setTimeout(() => {
        document.querySelector('.container').style.opacity = '1';
        document.querySelector('.container').style.transition = 'opacity 0.5s';
    }, 100);
});
