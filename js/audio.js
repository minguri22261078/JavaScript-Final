class AudioManager {
    static bgm = null;
    static sfx = new Map();
    static isMuted = false;

    static init() {
        // BGM 초기화
        this.bgm = new Audio();
        this.bgm.loop = true; // 반복 재생

        // 볼륨 초기 설정
        this.bgm.volume = 0.3; // 기본 볼륨 50%

        // 음소거 버튼 이벤트 리스너 설정
        const muteButton = document.getElementById('mute-button');
        if (muteButton) {
            muteButton.addEventListener('click', () => this.toggleMute());
        }
    }

    static playBGM(src) {
        if (this.bgm) {
            this.bgm.src = src;
            this.bgm.play().catch(e => console.log("BGM 재생 실패:", e));
        }
    }

    static stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
    }

    static changeBGM(src) {
        this.stopBGM();
        this.playBGM(src);
    }

    static playSFX(src) {
        if (!this.sfx.has(src)) {
            const audio = new Audio(src);
            this.sfx.set(src, audio);
        }
        const sound = this.sfx.get(src);
        sound.currentTime = 0;
        sound.play().catch(e => console.log("효과음 재생 실패:", e));
    }

    static setVolume(volume) {
        if (this.bgm) {
            this.bgm.volume = Math.max(0, Math.min(1, volume));
        }
    }

    static toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgm) {
            this.bgm.muted = this.isMuted;
        }

        // 음소거 버튼 아이콘 업데이트
        const muteButton = document.getElementById('mute-button');
        if (muteButton) {
            muteButton.innerHTML = this.isMuted ? '🔇' : '🔊';
        }
    }
}