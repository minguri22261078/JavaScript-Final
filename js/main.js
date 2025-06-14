document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    document.getElementById('start-button').addEventListener('click', () => {
        UI.hideElement('start-screen');
        UI.showElement('game-container');
        UI.showElement('hud');  // HUD 표시
        game.start();  // 게임 시작
    });
});