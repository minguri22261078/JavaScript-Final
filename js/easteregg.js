class ModernEasterEgg {
    constructor() {
        this.secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'Enter'];
        this.userInput = [];
        this.isEasterEggActive = false;
        this.init();
        this.addHintButton();
    }

    addHintButton() {
        const hintButton = document.createElement('div');
        hintButton.className = 'easter-egg-hint';
        hintButton.innerHTML = `
        <div class="hint-button">
            <div class="hint-icon">🎉</div>
            <div class="hint-content">
                <div class="hint-title">숨겨진 기능을 찾아보세요!</div>
                <div class="hint-keys">
                    <span class="key">↑</span>
                    <span class="key">↑</span>
                    <span class="key">↓</span>
                    <span class="key">↓</span>
                    <span class="key">Enter</span>
                </div>
            </div>
        </div>
    `;
        document.body.appendChild(hintButton);
    }

    async init() {
        if (!window.gsap) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        }
        this.bindEvents();
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleKeydown(e) {
        if (this.isEasterEggActive) return;

        this.userInput.push(e.key);
        if (this.userInput.length > this.secretCode.length) {
            this.userInput.shift();
        }

        if (JSON.stringify(this.userInput) === JSON.stringify(this.secretCode)) {
            this.activate();
        }
    }

    // activate 메소드에 추가
    activate() {
        if (this.isEasterEggActive) return;
        this.isEasterEggActive = true;
        
        // 힌트 버튼 숨기기
        const hintButton = document.querySelector('.easter-egg-hint');
        if (hintButton) {
            hintButton.style.display = 'none';
        }
        
        this.createContainer();
        this.animateElements();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'modern-easter-egg';
        container.innerHTML = `
            <div class="backdrop"></div>
            <div class="content-wrapper">
                <div class="content">
                    <div class="hero-section">
                        <div class="hero-text">🍺 긴급상황: 카드 드롭 🎊</div>
                        <div class="hero-subtitle">띠링!</div>
                    </div>
                    <div class="message-section">
                        <div class="message-title">부장님의 카드를 습득했습니다</div>
                        <div class="message-text">
                            부장님: "한 잔만 더 마셔… 이게 진짜 마지막이야…"<br>
                            사원들: "작년에도 그 말 하셨습니다."<br>
                        </div>
                    </div>
                </div>
            </div>
            <canvas class="celebration-canvas"></canvas>
        `;
        document.body.appendChild(container);

        // 캔버스 설정
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas = document.querySelector('.celebration-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.particles = [];
        this.startParticleAnimation();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 6 - 3,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`
        };
    }

    startParticleAnimation() {
        // 초기 파티클 생성
        for (let i = 0; i < 100; i++) {
            this.particles.push(this.createParticle());
        }

        this.animateParticles();
    }

    animateParticles() {
        if (!this.isEasterEggActive) return;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // 화면 경계 처리
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animateParticles());
    }

    animateElements() {
        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => this.removeEffect(), 8000);
            }
        });

        tl.fromTo('.backdrop', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 0.8
        });

        tl.fromTo('.hero-text', {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        }, '-=0.3');

        tl.fromTo('.hero-subtitle', {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, '-=0.5');

        tl.fromTo('.message-section', {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        }, '-=0.3');
    }

    // removeEffect 메소드에 추가
    removeEffect() {
        const container = document.querySelector('.modern-easter-egg');
        gsap.to(container, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                container.remove();
                this.isEasterEggActive = false;
                this.userInput = [];
                
                // 힌트 버튼 다시 보이기
                const hintButton = document.querySelector('.easter-egg-hint');
                if (hintButton) {
                    hintButton.style.display = '';
                }
            }
        });
    }
}

// 스타일 추가
const styles = document.createElement('style');
styles.textContent = `
    .modern-easter-egg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }

    .celebration-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }

    .content-wrapper {
        position: relative;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 40px;
        z-index: 2;
    }

    .content {
        text-align: center;
        color: #1d1d1f;
    }

    .hero-section {
        margin-bottom: 60px;
    }

    .hero-text {
        font-size: 96px;
        font-weight: 700;
        letter-spacing: -0.015em;
        background: linear-gradient(135deg, #1d1d1f 0%, #434343 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.1;
    }

    .hero-subtitle {
        font-size: 32px;
        font-weight: 500;
        color: #86868b;
        margin-top: 20px;
    }

    .message-section {
        margin-bottom: 40px;
    }

    .message-title {
        font-size: 48px;
        font-weight: 600;
        margin-bottom: 16px;
        background: linear-gradient(135deg, #007AFF 0%, #00F2FE 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .message-text {
        font-size: 28px;
        font-weight: 400;
        color: #1d1d1f;
        line-height: 1.4;
    }

    @media (max-width: 768px) {
        .hero-text {
            font-size: 64px;
        }

        .hero-subtitle {
            font-size: 24px;
        }

        .message-title {
            font-size: 36px;
        }

        .message-text {
            font-size: 22px;
        }
    }
        .easter-egg-hint {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9998;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .hint-button {
        border-radius: 60px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .hint-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    .hint-icon {
        font-size: 24px;
        animation: bounce 2s infinite;
    }

    .hint-content {
        overflow: hidden;
        width: 0;
        transition: width 0.3s ease;
        white-space: nowrap;
        opacity: 0;
    }

    .hint-button:hover .hint-content {
        width: 200px;
        opacity: 1;
        margin-right: 12px;
    }

    .hint-title {
        font-size: 14px;
        font-weight: 500;
        color: #1d1d1f;
        margin-bottom: 4px;
    }

    .hint-keys {
        display: flex;
        gap: 4px;
        align-items: center;
    }

    .key {
        background: #f5f5f7;
        border: 1px solid #e5e5e7;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 12px;
        color: #666;
        font-family: monospace;
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-6px);
        }
        60% {
            transform: translateY(-3px);
        }
    }

    @media (max-width: 768px) {
        .easter-egg-hint {
            bottom: 16px;
            right: 16px;
        }

        .hint-button:hover .hint-content {
            width: 180px;
        }
    }
\`;
`;

document.head.appendChild(styles);

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ModernEasterEgg();
});