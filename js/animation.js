// Класс для создания частиц
class Particle {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speed * (Math.random() - 0.5);
        this.speedY = speed * (Math.random() - 0.5);
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        // Обновление позиции частицы
        this.x += this.speedX;
        this.y += this.speedY;

        // Проверка границ и отражение
        if (this.x <= 0 || this.x >= window.innerWidth) {
            this.speedX = -this.speedX;
        }
        if (this.y <= 0 || this.y >= window.innerHeight) {
            this.speedY = -this.speedY;
        }
    }

    draw(ctx) {
        // Рисование частицы
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

// Класс для создания соединений между частицами
class ParticleSystem {
    constructor(canvasId, particleCount = 80) {
        this.canvas = document.createElement('canvas');
        this.particlesContainer = document.getElementById(canvasId);
        this.particlesContainer.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = particleCount;
        this.connectionDistance = 150;
        this.colors = [
            '0, 120, 215', // Голубой
            '0, 178, 148', // Бирюзовый
            '80, 80, 80'   // Серый
        ];
        
        this.init();
        this.animate();
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => this.resize());
    }
    
    init() {
        // Установка размера canvas
        this.resize();
        
        // Создание частиц
        for (let i = 0; i < this.particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 3 + 1;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const speed = Math.random() * 0.5 + 0.2;
            
            this.particles.push(new Particle(x, y, size, color, speed));
        }
    }
    
    resize() {
        this.canvas.width = this.particlesContainer.clientWidth;
        this.canvas.height = this.particlesContainer.clientHeight;
    }
    
    animate() {
        // Очистка canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновление и отрисовка частиц
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw(this.ctx);
            
            // Создание соединений между частицами
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(150, 150, 150, ${opacity * 0.15})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
        
        // Запрос на следующий кадр анимации
        requestAnimationFrame(() => this.animate());
    }
}

// Добавление интерактивности при наведении мыши
document.addEventListener('DOMContentLoaded', () => {
    // Создание системы частиц
    const particleSystem = new ParticleSystem('particles');
    
    // Эффект наведения для кнопок
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
        });
    });
    
    // Анимация заголовка
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        typeWriterEffect(nameElement, nameElement.textContent, 0, 100);
        nameElement.textContent = '';
    }
});

// Эффект печатающейся машинки
function typeWriterEffect(element, text, index, speed) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(() => typeWriterEffect(element, text, index, speed), speed);
    }
} 