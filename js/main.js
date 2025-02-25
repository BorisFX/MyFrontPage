// Класс для создания и анимации сетки частиц
class ParticleNetwork {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Настройки по умолчанию
        this.options = {
            particleCount: 100,
            particleColor: '#0078d7',
            lineColor: 'rgba(70, 70, 70, 0.12)',
            particleSize: 2,
            lineWidth: 0.5,
            maxDistance: 150,
            speed: 1,
            ...options
        };
        
        this.particles = [];
        
        this.init();
        this.animate();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.resize());
    }
    
    init() {
        // Установить размер canvas
        this.resize();
        
        // Создать частицы
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.particleSize + 1
            });
        }
    }
    
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        // Если размер изменился сильно, пересоздаем частицы для равномерного распределения
        if (this.particles.length > 0) {
            this.particles.forEach(particle => {
                if (particle.x > this.canvas.width) particle.x = Math.random() * this.canvas.width;
                if (particle.y > this.canvas.height) particle.y = Math.random() * this.canvas.height;
            });
        }
    }
    
    update() {
        this.particles.forEach(particle => {
            // Обновляем позицию
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Проверяем границы
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx = -particle.vx;
            } else if (particle.x > this.canvas.width) {
                particle.x = this.canvas.width;
                particle.vx = -particle.vx;
            }
            
            if (particle.y < 0) {
                particle.y = 0;
                particle.vy = -particle.vy;
            } else if (particle.y > this.canvas.height) {
                particle.y = this.canvas.height;
                particle.vy = -particle.vy;
            }
        });
    }
    
    draw() {
        // Очищаем холст
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем соединения между частицами
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                // Вычисляем расстояние
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Рисуем линию, если частицы достаточно близко
                if (distance < this.options.maxDistance) {
                    // Устанавливаем прозрачность, зависящую от расстояния
                    const opacity = 1 - (distance / this.options.maxDistance);
                    this.ctx.strokeStyle = this.options.lineColor;
                    this.ctx.lineWidth = this.options.lineWidth;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Рисуем частицы
        this.particles.forEach(particle => {
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем анимацию частиц
    const canvas = document.getElementById('webglCanvas');
    if (canvas) {
        const particleNetwork = new ParticleNetwork('webglCanvas', {
            particleCount: 80,
            particleColor: '#0078d7',
            lineColor: 'rgba(70, 70, 70, 0.12)',
            particleSize: 2.5,
            lineWidth: 0.5,
            maxDistance: 150,
            speed: 0.8
        });
    }
    
    // Логика переключения языков
    const ruBtn = document.getElementById('ru-btn');
    const enBtn = document.getElementById('en-btn');
    const ruResume = document.getElementById('ru-resume');
    const enResume = document.getElementById('en-resume');
    const pageTitle = document.getElementById('page-title');
    
    if (ruBtn && enBtn && ruResume && enResume) {
        // Функция для переключения на русский язык
        ruBtn.addEventListener('click', function() {
            ruBtn.classList.add('active');
            enBtn.classList.remove('active');
            ruResume.classList.add('active');
            enResume.classList.remove('active');
            document.documentElement.lang = 'ru';
            if (pageTitle) {
                pageTitle.textContent = 'Резюме';
            }
            document.title = 'Резюме - Oleg Matyakubov';
        });
        
        // Функция для переключения на английский язык
        enBtn.addEventListener('click', function() {
            enBtn.classList.add('active');
            ruBtn.classList.remove('active');
            enResume.classList.add('active');
            ruResume.classList.remove('active');
            document.documentElement.lang = 'en';
            if (pageTitle) {
                pageTitle.textContent = 'CV';
            }
            document.title = 'Resume - Oleg Matyakubov';
        });
    }
    
    // Эффекты наведения для кнопок
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Плавное появление текстового содержимого
    const textContent = document.querySelector('.text-content');
    if (textContent) {
        textContent.style.opacity = 0;
        setTimeout(() => {
            textContent.style.transition = 'opacity 1s ease-in-out';
            textContent.style.opacity = 1;
        }, 100);
    }
    
    // Функционал для раскрывающихся списков навыков
    const skillHeaders = document.querySelectorAll('.skill-category h3');
    skillHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const parent = this.parentElement;
            parent.classList.toggle('active');
        });
    });
}); 