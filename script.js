class HamsterUniverse {
    constructor() {
        this.startTime = Date.now();
        this.seconds = 0;
        this.hamsters = 1;
        this.multiplier = 1;
        this.maxCapacity = 10000000000000000000n; // 10^19
        this.isRunning = true;
        
        // DOM элементы
        this.timerElement = document.getElementById('timer');
        this.countElement = document.getElementById('hamsterCount');
        this.rateElement = document.getElementById('rate');
        this.capacityElement = document.getElementById('capacity');
        this.occupiedElement = document.getElementById('occupied');
        this.universeElement = document.getElementById('hamsterUniverse');
        
        // Кнопки
        document.getElementById('speedUp').addEventListener('click', () => this.speedUp());
        document.getElementById('addHundred').addEventListener('click', () => this.addHundred());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        
        // Инициализация
        this.updateDisplay();
        this.startTimer();
        this.renderHamsters();
    }
    
    startTimer() {
        setInterval(() => {
            if (this.isRunning) {
                this.seconds++;
                this.hamsters += this.multiplier;
                this.updateDisplay();
                this.renderHamsters();
            }
        }, 1000);
    }
    
    updateDisplay() {
        // Форматирование времени
        const days = Math.floor(this.seconds / 86400);
        const hours = Math.floor((this.seconds % 86400) / 3600);
        const minutes = Math.floor((this.seconds % 3600) / 60);
        const secs = this.seconds % 60;
        
        let timeString = '';
        if (days > 0) timeString += `${days}д `;
        if (hours > 0) timeString += `${hours}ч `;
        if (minutes > 0) timeString += `${minutes}м `;
        timeString += `${secs}с`;
        
        this.timerElement.textContent = timeString;
        
        // Форматирование числа хомячков
        this.countElement.textContent = this.formatNumber(this.hamsters) + ' хомяков';
        
        // Скорость размножения
        this.rateElement.textContent = `+${this.multiplier} хомяк/сек`;
        
        // Заполненность вселенной
        const occupiedPercent = (Number(BigInt(this.hamsters) * 10000n / this.maxCapacity) / 10000).toFixed(10);
        this.occupiedElement.textContent = `${occupiedPercent}%`;
    }
    
    formatNumber(num) {
        if (num >= 1000000000000) {
            return (num / 1000000000000).toFixed(2) + ' трлн';
        }
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + ' млрд';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + ' млн';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + ' тыс';
        }
        return num.toString();
    }
    
    renderHamsters() {
        // Очищаем и добавляем ограниченное количество хомячков для производительности
        this.universeElement.innerHTML = '';
        const displayCount = Math.min(this.hamsters, 1000);
        
        for (let i = 0; i < displayCount; i++) {
            const hamster = document.createElement('div');
            hamster.className = 'hamster';
            hamster.textContent = '🐹';
            hamster.style.transform = `rotate(${Math.random() * 360}deg)`;
            hamster.style.animationDelay = `${Math.random() * 2}s`;
            this.universeElement.appendChild(hamster);
        }
        
        if (this.hamsters > 1000) {
            const more = document.createElement('div');
            more.style.cssText = `
                width: 100%;
                text-align: center;
                font-size: 1.5em;
                color: #FFD700;
                padding: 20px;
            `;
            more.textContent = `...и еще ${this.formatNumber(this.hamsters - 1000)} хомячков!`;
            this.universeElement.appendChild(more);
        }
    }
    
    speedUp() {
        this.multiplier *= 2;
        this.updateDisplay();
        
        // Визуальный эффект
        const btn = document.getElementById('speedUp');
        btn.style.transform = 'scale(1.1)';
        btn.style.background = 'linear-gradient(45deg, #ff006e, #8338ec)';
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.background = '';
        }, 300);
    }
    
    addHundred() {
        this.hamsters += 100;
        this.updateDisplay();
        this.renderHamsters();
        
        // Визуальный эффект
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const hamster = document.createElement('div');
                hamster.className = 'hamster';
                hamster.textContent = '🐹';
                hamster.style.position = 'absolute';
                hamster.style.left = `${Math.random() * 100}%`;
                hamster.style.top = `${Math.random() * 100}%`;
                hamster.style.fontSize = `${Math.random() * 2 + 1}em`;
                hamster.style.opacity = '0.7';
                document.body.appendChild(hamster);
                
                // Анимация исчезновения
                setTimeout(() => {
                    hamster.remove();
                }, 1000);
            }, i * 100);
        }
    }
    
    reset() {
        if (confirm('Вы уверены? Это остановит хомячковую цивилизацию!')) {
            this.seconds = 0;
            this.hamsters = 1;
            this.multiplier = 1;
            this.isRunning = true;
            this.updateDisplay();
            this.renderHamsters();
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.hamsterUniverse = new HamsterUniverse();
});