class Game {
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 게임 초기화 및 기본 설정
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    constructor() {
        // 초기 스탯 설정
        this.stats = {
            health: 3,
            relationship: 3,
            career: 3
        };
        this.currentDay = 1;
        this.setupEventListeners();

        // 오디오 매니저 초기화
        AudioManager.init();

        // 시작 화면 BGM 재생
        AudioManager.playBGM('audio/title.mp3');
    }

    setupEventListeners() {
        // 시작 버튼 이벤트 설정
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.onclick = () => this.start();
        }
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 게임 진행 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    async start() {
        // 게임 화면 초기화 및 설정
        UI.hideElement('start-screen');
        UI.hideElement('interaction-area');
        UI.hideElement('next-button');
        UI.showElement('game-screen');
        UI.showElement('hud');
        UI.initHUD(this.stats);
        await this.startDay();

        // 게임 시작 시 BGM 변경
        AudioManager.changeBGM('audio/game.mp3');
    }

    // Game 클래스 내부에 있는 startDay 메서드 수정
    async startDay() {
        const scenario = SCENARIOS[this.currentDay];
        if (!scenario) {
            console.log("시나리오가 없음");
            this.endGame();
            return;
        }

        console.log("현재 일차:", this.currentDay);
        console.log("시나리오:", scenario);

        // 7일차 특별 처리
        if (scenario.day_start.finalDay) {
            console.log("7일차 진입");
            await this.showFinalDayScene(scenario.day_start);
            return;
        }

        // 기존 일차 처리
        UI.hideElement('interaction-area');
        UI.hideElement('next-button');
        await this.showDayStart(scenario.day_start);
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 시나리오 표시 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    async showDayStart(dayStart) {
        // UI 요소 초기화
        const character = document.getElementById('character');
        const background = document.getElementById('background');
        const questionText = document.getElementById('question-text');

        questionText.textContent = '';

        // 캐릭터와 배경 설정
        character.src = dayStart.character;
        background.src = dayStart.background;

        await UI.typeText(questionText, dayStart.question);

        // 상호작용 방식 설정
        UI.hideElement('interaction-area');
        UI.hideElement('next-button');

        if (dayStart.draggableItems) {
            this.setupDragAndDrop(dayStart);
        } else if (dayStart.useSlider) {
            this.setupSliderInteraction();
        } else {
            this.setupChoiceInteraction();
        }
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 드래그 앤 드롭 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    setupDragAndDrop(dayStart) {
        // 오버레이 추가
        const overlay = document.createElement('div');
        overlay.className = 'interaction-overlay';
        document.body.appendChild(overlay);
        
        // 드래그 앤 드롭 컨테이너 설정
        const dragContainer = document.getElementById('drag-items-container');
        const dropContainer = document.getElementById('drop-zones-container');

        dragContainer.innerHTML = '';
        dropContainer.innerHTML = '';

        // 드래그 아이템 생성 및 설정
        dayStart.draggableItems.forEach(item => {
            const dragItem = document.createElement('img');
            dragItem.src = item.image;
            dragItem.className = 'draggable-item';
            dragItem.id = item.id;
            dragItem.style.left = item.initialPosition.x + 'px';
            dragItem.style.top = item.initialPosition.y + 'px';
            if (item.tooltip) {
                dragItem.setAttribute('data-tooltip', item.tooltip);
            }

            this.setupDragListeners(dragItem);
            dragContainer.appendChild(dragItem);
        });

        // 드롭존 생성 및 설정
        dayStart.dropZones.forEach(zone => {
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.id = zone.id;
            dropZone.style.left = zone.position.x + 'px';
            dropZone.style.top = zone.position.y + 'px';
            dropZone.textContent = zone.text;

            this.setupDropListeners(dropZone, zone);
            dropContainer.appendChild(dropZone);
        });
    }

    setupDragListeners(element) {
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
        });
    }

    setupDropListeners(dropZone, zoneConfig) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('highlight');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('highlight');
        });

        dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            const itemId = e.dataTransfer.getData('text/plain');
            const result = zoneConfig.validItems?.[itemId] || zoneConfig.result;

            await this.showResult(result, result.stats);
        });
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 상호작용 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    setupChoiceInteraction() {
        // 선택지 UI 설정
        UI.hideElement('next-button');

        const interactionArea = document.getElementById('interaction-area');
        if (interactionArea) {
            interactionArea.style.display = 'flex';
        }

        // 예/아니오 버튼 이벤트 설정
        const yesButton = document.querySelector('.o-button');
        const noButton = document.querySelector('.x-button');

        if (yesButton) {
            yesButton.onclick = () => this.handleChoice('attend');
        }
        if (noButton) {
            noButton.onclick = () => this.handleChoice('decline');
        }
    }

    async handleChoice(choice) {
        UI.hideElement('interaction-area');

        const currentScenario = SCENARIOS[this.currentDay];
        const result = currentScenario.day_start.choices[choice].result;
        const statChanges = currentScenario.day_start.choices[choice].stats;

        await this.showResult(result, statChanges);
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 결과 처리 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    async showResult(result, statChanges) {
        // 오버레이 제거
        const overlay = document.querySelector('.interaction-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        // UI 요소 가져오기
        const character = document.getElementById('character');
        const background = document.getElementById('background');
        const questionText = document.getElementById('question-text');
        const dragContainer = document.getElementById('drag-items-container');
        const dropContainer = document.getElementById('drop-zones-container');

        // 드래그 앤 드롭 요소 정리
        if (dragContainer) dragContainer.innerHTML = '';
        if (dropContainer) dropContainer.innerHTML = '';

        // 결과 화면 표시
        character.src = result.character;
        background.src = result.background;
        await UI.typeText(questionText, result.text);

        // 스탯 변경 적용
        if (statChanges) {
            this.updateStats(statChanges);
        }

        UI.hideElement('interaction-area');

        // 다음 버튼 표시
        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.style.display = 'block';
            nextButton.onclick = () => this.endDay();
        }
    }

    updateStats(changes) {
        if (!changes) return;  // changes가 없으면 early return

        Object.entries(changes).forEach(([stat, change]) => {
            if (this.stats[stat] !== undefined) {  // 스탯이 존재하는지 확인
                this.stats[stat] = Math.max(CONFIG.MIN_STAT,
                    Math.min(CONFIG.MAX_STAT, this.stats[stat] + change));
                UI.updateHUD(stat, this.stats[stat]);
            }
        });
    }

    async endDay() {
        UI.hideElement('next-button');
        UI.hideElement('interaction-area');
        UI.hideElement('hud');

        const dragContainer = document.getElementById('drag-items-container');
        const dropContainer = document.getElementById('drop-zones-container');

        // 드래그 아이템과 드롭존 제거
        dragContainer.innerHTML = '';
        dropContainer.innerHTML = '';

        const currentScenario = SCENARIOS[this.currentDay];
        const character = document.getElementById('character');
        const background = document.getElementById('background');
        const questionText = document.getElementById('question-text');
        const questionBubble = document.getElementById('question-bubble');

        // 말풍선 숨기기
        questionBubble.style.display = 'none';

        // 캐릭터와 배경 페이드아웃
        character.style.opacity = '0';
        background.style.opacity = '0';

        // day_end 클래스 추가
        questionText.classList.add('day-end');

        // day_end 텍스트 표시
        await UI.typeText(questionText, currentScenario.day_end.question);

        // 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 원래 상태로 복구
        questionText.classList.remove('day-end');
        character.style.opacity = '1';
        background.style.opacity = '1';
        questionBubble.style.display = '';
        UI.showElement('hud');

        this.currentDay = currentScenario.day_end.nextDay;
        this.startDay();

    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 게임 종료 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    async endGame() {
        UI.hideElement('next-button');
        UI.hideElement('interaction-area');
        UI.hideElement('hud');  // HUD 숨기기
        UI.hideElement('audio-controls');  // 오디오 컨트롤 숨기기

        const overlay = document.querySelector('.fade-overlay');
        if (overlay) {
            overlay.remove();
        }

        // 최종 스탯 계산
        const finalStats = {
            health: this.stats.health,
            relationship: this.stats.relationship,
            career: this.stats.career
        };

        console.log("최종 스탯:", finalStats);

        // 엔딩 결정
        const ending = this.calculateEnding(finalStats);
        console.log("선택된 엔딩:", ending);

        // 엔딩 화면 표시 준비
        const fadeOverlay = document.querySelector('.fade-overlay');
        const fadeText = document.querySelector('.fade-text');
        const questionText = document.getElementById('question-text');

        try {
            // 먼저 최종 스탯 표시
            if (questionText) {
                let statsText = "[ 최종 결과 ]\n\n";
                statsText += `인간관계: ${finalStats.relationship}\n`;
                statsText += `건강: ${finalStats.health}\n`;
                statsText += `커리어: ${finalStats.career}`;

                await UI.typeText(questionText, statsText);
            }

            // 2초 대기
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 엔딩 화면 표시
            if (fadeOverlay && fadeText) {
                fadeOverlay.style.display = 'block';
                fadeOverlay.style.opacity = '1';
                fadeText.style.display = 'block';
                fadeText.innerHTML = this.createEndingHTML(ending, finalStats);
                fadeText.style.opacity = '1';
            }

            // 엔딩 BGM 재생
            AudioManager.changeBGM('audio/ending.mp3');

        } catch (error) {
            console.error("엔딩 표시 중 오류 발생:", error);
        }
    }

    calculateEnding(stats) {
        console.log("엔딩 계산 중, 스탯:", stats);

        // 스탯 기준값 설정 (최대값 7 기준)
        const HIGH_STAT = 5;  // 높은 스탯 기준
        const LOW_STAT = 2;   // 낮은 스탯 기준

        // 엔딩 조건 체크
        if (stats.career >= HIGH_STAT && stats.relationship <= LOW_STAT) {
            return SCENARIOS[7].endings.successCareer;
        } 
        else if (stats.health >= HIGH_STAT && stats.career <= LOW_STAT) {
            return SCENARIOS[7].endings.healthyFired;
        } 
        else if (stats.relationship >= HIGH_STAT && stats.health <= LOW_STAT) {
            return SCENARIOS[7].endings.popularTired;
        } 
        else if (stats.health <= LOW_STAT && stats.career <= LOW_STAT && stats.relationship <= LOW_STAT) {
            return SCENARIOS[7].endings.burnout;
        } 
        else {
            return SCENARIOS[7].endings.normalQuit;
        }
    }

    createEndingHTML(ending, finalStats) {
        if (!ending) {
            console.error("엔딩 정보가 없습니다!");
            return '';
        }

        return `
        <div class="ending-container">
            <h2 class="ending-title">${ending.title || '알 수 없는 엔딩'}</h2>
            <img src="${ending.image || 'img/endings/default.png'}" alt="${ending.title || '엔딩'}" class="ending-image">
            <p class="ending-description">${ending.description || '설명이 없습니다.'}</p>
            <div class="final-stats">
                <p>🤝 인간관계: ${finalStats.relationship}</p>
                <p>❤️ 건강: ${finalStats.health}</p>
                <p>💼 커리어: ${finalStats.career}</p>
            </div>
            <button onclick="location.reload()" class="btn btn-light mt-3">다시 시작하기</button>
        </div>
    `;
    }

    setupSliderInteraction() {
        // 오버레이 추가
        const overlay = document.createElement('div');
        overlay.className = 'interaction-overlay';
        document.body.appendChild(overlay);
        
        UI.hideElement('interaction-area');
        UI.hideElement('next-button');

        const currentScenario = SCENARIOS[this.currentDay];
        const sliderConfig = currentScenario.day_start.sliderInteraction;

        // 슬라이더 UI 설정
        UI.setupSliders(
            sliderConfig.sliders,
            sliderConfig.results  // 결과 객체를 전달
        );
        UI.showSlider();

        const sliderSubmit = document.getElementById('slider-submit');
        if (sliderSubmit) {
            sliderSubmit.onclick = async () => {
                const values = UI.getSliderValues();
                let selectedResult;
                const results = sliderConfig.results;

                if (this.currentDay === 6) {
                    // Day 6의 결과 로직
                    if (values.drinkingPace >= 8) {
                        selectedResult = results.heavyDrinking;
                    } else if (values.drinkingPace >= 5) {
                        selectedResult = results.moderateDrinking;
                    } else {
                        selectedResult = results.lightDrinking;
                    }
                } else {
                    // Day 5의 결과 로직
                    if (values.relationship >= 6) {
                        selectedResult = results.relationshipFocus;
                    } else if (values.health >= 6) {
                        selectedResult = results.healthFocus;
                    } else if (values.career >= 6) {
                        selectedResult = results.careerFocus;
                    } else {
                        selectedResult = results.balanced;
                    }
                }

                UI.hideSlider();
                await this.showResult(selectedResult, selectedResult.stats);
            };
        }
    }

    showFinalDay(choices) {
        console.log("showFinalDay 호출됨", choices);

        // 게임 화면 요소 가져오기
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) {
            console.error("game-screen 요소를 찾을 수 없음");
            return;
        }

        // 기존 카드 선택 영역 제거
        const existingCardSelection = document.getElementById('card-selection');
        if (existingCardSelection) {
            existingCardSelection.remove();
        }

        // 카드 선택 컨테이너 생성
        const cardSelection = document.createElement('div');
        cardSelection.id = 'card-selection';

        console.log("카드 선택 컨테이너 생성됨");

        // 각 카드 생성
        choices.forEach((choice, index) => {
            console.log(`카드 ${index + 1} 생성 중:`, choice);
            const card = this.createChoiceCard(choice);
            cardSelection.appendChild(card);
        });

        // 게임 화면에 카드 컨테이너 추가
        gameScreen.appendChild(cardSelection);
        console.log("카드 컨테이너가 게임 화면에 추가됨");
    }

    createChoiceCard(choice) {
        console.log("카드 생성:", choice);

        const card = document.createElement('div');
        card.className = 'choice-card';

        card.innerHTML = `
            <div class="card-inner">
                <img src="${choice.image}" alt="${choice.title}">
                <h3>${choice.title}</h3>
                <p>${choice.description}</p>
            </div>
        `;

        // 클릭 이벤트
        card.addEventListener('click', () => {
            console.log("카드 선택됨:", choice);
            this.updateStats(choice.effects);

            // 카드 UI 제거
            const cardSelection = document.getElementById('card-selection');
            if (cardSelection) {
                cardSelection.remove();
            }

            // 게임 종료
            this.endGame();
        });

        return card;
    }

    handleFinalChoice(choice) {
        // 선택에 따른 효과 적용
        this.updateStats(choice.effects);

        // 엔딩으로 이동
        this.endGame();
    }

    // 새로운 메서드 추가
    async showFinalDayScene(dayStart) {
        console.log("showFinalDayScene 시작");

        // game-area로 변경
        const gameArea = document.getElementById('game-area');
        if (!gameArea) {
            console.error("game-area 요소를 찾을 수 없습니다!");
            return;
        }

        // 기본 UI 설정
        UI.hideElement('interaction-area');
        UI.hideElement('next-button');

        // 기존 카드 컨테이너가 있다면 제거
        const existingCardSelection = document.getElementById('card-selection');
        if (existingCardSelection) {
            existingCardSelection.style.display = 'none';
        }

        // 배경과 캐릭터 설정
        const character = document.getElementById('character');
        const background = document.getElementById('background');
        const questionText = document.getElementById('question-text');

        if (character) character.src = dayStart.character;
        if (background) background.src = dayStart.background;
        if (questionText) await UI.typeText(questionText, dayStart.question);

        // cards-container 찾기
        const cardsContainer = document.querySelector('.cards-container');
        if (!cardsContainer) {
            console.error("cards-container를 찾을 수 없습니다!");
            return;
        }

        // 기존 카드들 제거
        cardsContainer.innerHTML = '';

        // 카드 생성 및 추가
        dayStart.choices.finalDayChoices.forEach((choice, index) => {
            const card = this.createChoiceCard(choice);
            cardsContainer.appendChild(card);
        });

        // 카드 선택 영역 표시
        const cardSelection = document.getElementById('card-selection');
        if (cardSelection) {
            cardSelection.style.display = 'block';
        }

        // 카드 선택 영역 표시할 때
        this.showChoices();
    }

    // 카드를 보여주는 함수
    showChoices(choices) {
        console.log("showChoices 호출됨"); // 디버깅용 로그


        const overlay = document.querySelector('.fade-overlay');
        console.log("overlay:", overlay); // overlay 요소 확인

        if (overlay) {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 직접 배경색 설정
            overlay.style.opacity = '1'; // 직접 opacity 설정
            overlay.classList.add('choice-active');
            console.log("overlay 스타일 적용됨"); // 스타일 적용 확인
        } else {
            console.log("overlay를 찾을 수 없음"); // overlay가 없을 경우
        }

        const cardSelection = document.getElementById('card-selection');
        if (cardSelection) {
            cardSelection.style.display = 'block';
            console.log("카드 selection 표시됨");
        }
    }

    // 카드를 숨기는 함수
    hideChoices() {
        // fade-overlay를 찾아서
        const overlay = document.querySelector('.fade-overlay');
        // choice-active 클래스를 제거해서 배경을 다시 밝게 만듦
        overlay.classList.remove('choice-active');

        // 카드들이 있는 컨테이너를 찾아서
        const cardSelection = document.getElementById('card-selection');
        if (cardSelection) {
            // 숨김 설정
            cardSelection.style.display = 'none';
        }
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7일차 및 종료 관련 메서드
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showFinalDay() {
    const cardContainer = document.querySelector('.cards-container');
    cardContainer.innerHTML = '';

    finalDayChoices.forEach(choice => {
        const card = createChoiceCard(choice);
        cardContainer.appendChild(card);
    });

    document.getElementById('card-selection').style.display = 'block';
}

function createChoiceCard(choice) {
    const card = document.createElement('div');
    card.className = 'choice-card';
    card.innerHTML = `
        <div class="card-inner">
            <img src="${choice.image}" class="card-image" alt="${choice.title}">
            <div class="card-title">${choice.title}</div>
            <div class="card-description">${choice.description}</div>
        </div>
    `;

    card.addEventListener('click', () =>
        handleFinalChoice(choice));

    return card;
}

function handleFinalChoice(choice) {
    const overlay = document.querySelector('.fade-overlay');
    if (overlay) {
        overlay.remove();
    }

    // 선택에 따른 효과 적용
    updateStats(choice.effects);

    // 최종 결과 계산
    const ending = calculateEnding();

    // 엔딩 표시
    showEnding(ending);
}
