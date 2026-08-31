// ============================
// CONFIGURAÇÕES
// ============================
const CONFIG = {
    speed: 2,
    isRunning: true,
    carX: -120,
    motoX: -100,
    maxX: 1200,
    particles: []
};

// ============================
// DOM ELEMENTOS
// ============================
const car = document.getElementById('car');
const motorcycle = document.getElementById('motorcycle');
const carPos = document.getElementById('car-pos');
const motoPos = document.getElementById('moto-pos');
const speedDisplay = document.getElementById('speed-display');
const canvas = document.getElementById('ai-effects');
const ctx = canvas.getContext('2d');

// ============================
// CONFIGURAR CANVAS
// ============================
function setupCanvas() {
    const scene = document.getElementById('scene');
    canvas.width = scene.offsetWidth;
    canvas.height = scene.offsetHeight;
}

window.addEventListener('resize', setupCanvas);
setupCanvas();

// ============================
// SISTEMA DE PARTÍCULAS (IA)
// ============================
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `hsl(${Math.random() * 60 + 30}, 100%, ${Math.random() * 50 + 30}%)`;
        this.life = 1;
        this.decay = 0.001 + Math.random() * 0.002;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // IA: partículas seguem veículos
        const targetX = CONFIG.carX + 100;
        const targetY = canvas.height - 100;
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
            this.speedX += dx * 0.0005;
            this.speedY += dy * 0.0005;
        }

        // Limitar velocidade
        const maxSpeed = 1;
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed > maxSpeed) {
            this.speedX = (this.speedX / currentSpeed) * maxSpeed;
            this.speedY = (this.speedY / currentSpeed) * maxSpeed;
        }

        return this.life > 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life * 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Brilho
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
    }
}

// ============================
// GERAR PARTÍCULAS COM IA
// ============================
function generateParticles() {
    // IA decide quantas partículas criar baseado na velocidade
    const count = Math.floor(CONFIG.speed * 5) + 5;
    
    for (let i = 0; i < count; i++) {
        CONFIG.particles.push(new Particle());
    }
}

// ============================
// ANIMAR PARTÍCULAS
// ============================
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // IA: atualizar partículas
    CONFIG.particles = CONFIG.particles.filter(p => p.update());
    
    // IA: desenhar partículas
    CONFIG.particles.forEach(p => p.draw());

    // IA: gerar novas partículas se necessário
    if (CONFIG.particles.length < 20) {
        generateParticles();
    }

    requestAnimationFrame(animateParticles);
}

// ============================
// MOVER VEÍCULOS
// ============================
function moveVehicles() {
    if (!CONFIG.isRunning) return;

    // Carro (mais rápido)
    CONFIG.carX += CONFIG.speed * 1.2;
    
    // Moto (mais lenta, mas com padrão diferente)
    CONFIG.motoX += CONFIG.speed * 0.8 + Math.sin(Date.now() / 1000) * 0.3;

    // Resetar posições
    if (CONFIG.carX > CONFIG.maxX) CONFIG.carX = -150;
    if (CONFIG.motoX > CONFIG.maxX + 50) CONFIG.motoX = -120;

    // Aplicar posições
    car.style.left = CONFIG.carX + 'px';
    motorcycle.style.left = CONFIG.motoX + 'px';

    // Atualizar status
    carPos.textContent = Math.round(CONFIG.carX);
    motoPos.textContent = Math.round(CONFIG.motoX);

    requestAnimationFrame(moveVehicles);
}

// ============================
// FUNÇÕES DE CONTROLE (IA)
// ============================
function toggleAnimation() {
    CONFIG.isRunning = !CONFIG.isRunning;
    if (CONFIG.isRunning) {
        moveVehicles();
    }
}

function changeSpeed(direction) {
    if (direction === 'faster') {
        CONFIG.speed = Math.min(CONFIG.speed + 0.5, 8);
    } else {
        CONFIG.speed = Math.max(CONFIG.speed - 0.5, 0.5);
    }
    speedDisplay.textContent = CONFIG.speed.toFixed(1) + 'x';
    
    // IA: ajustar partículas com a velocidade
    generateParticles();
}

function resetPositions() {
    CONFIG.carX = -120;
    CONFIG.motoX = -100;
    CONFIG.speed = 2;
    speedDisplay.textContent = '1.0x';
    
    // IA: recriar partículas
    CONFIG.particles = [];
    generateParticles();
}

// ============================
// INICIAR ANIMAÇÕES
// ============================
// Gerar partículas iniciais
generateParticles();

// Iniciar animações
animateParticles();
moveVehicles();

// ============================
// IA: EFEITO DE "INTELIGÊNCIA"
// ============================
// IA detecta quando veículos estão próximos
setInterval(() => {
    const distance = Math.abs(CONFIG.carX - CONFIG.motoX);
    if (distance < 200 && distance > 50) {
        // IA: criar explosão de partículas
        for (let i = 0; i < 10; i++) {
            const p = new Particle();
            p.color = `hsl(${Math.random() * 60 + 180}, 100%, 60%)`;
            p.speedX = (Math.random() - 0.5) * 3;
            p.speedY = (Math.random() - 0.5) * 3 - 2;
            CONFIG.particles.push(p);
        }
    }
}, 1000);

console.log('🏙️ City Car Motorcycle iniciado com IA!');
console.log('🤖 IA: Gerando efeitos inteligentes...');