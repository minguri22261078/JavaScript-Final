class UI {
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 텍스트 애니메이션 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    static async typeText(element, text) {
        if (!element) return;
        
        // 텍스트 컨텐츠 초기화
        element.textContent = '';
        const characters = text.split('');
        let displayText = '';
        
        // 한 글자씩 타이핑 효과 구현
        for (const char of characters) {
            displayText += char;
            element.textContent = displayText;
            await new Promise(resolve => setTimeout(resolve, 50)); // 타이핑 속도 조절 (50ms)
        }
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // HUD (상태창) 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    static updateHUD(statKey, value) {
        // HUD 컨테이너 찾기
        const container = document.querySelector(`#hud-${statKey} .hud-boxes`);
        if (!container) return;

        // 상태 박스 생성 및 채우기
        container.innerHTML = Array(CONFIG.MAX_STAT)
            .fill(null)
            .map((_, i) => `<div class="box ${i < value ? 'filled' : ''}"></div>`)
            .join('');
    }

    static initHUD(stats) {
        // HUD 요소 표시
        const hud = document.getElementById('hud');
        if (hud) hud.style.display = 'flex';

        // 모든 스탯에 대해 HUD 업데이트
        Object.entries(stats).forEach(([key, value]) => {
            this.updateHUD(key, value);
        });
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 요소 표시/숨기기 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    static showElement(elementId) {
        // 요소 찾아서 표시 (HUD는 flex, 나머지는 block으로 표시)
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = elementId === 'hud' ? 'flex' : 'block';
        }
    }

    static hideElement(elementId) {
        // 요소 찾아서 숨기기
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'none';
    }

    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 슬라이더 관련 메서드
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    static showSlider() {
        // 슬라이더 컨테이너 표시
        const sliderContainer = document.getElementById('slider-container');
        if (sliderContainer) {
            sliderContainer.style.display = 'block';
        }
    }

    static hideSlider() {
        // 슬라이더 컨테이너 숨기기
        const sliderContainer = document.getElementById('slider-container');
        if (sliderContainer) {
            sliderContainer.style.display = 'none';
        }
    }

    static resetSliders() {
        // 모든 슬라이더 기본값으로 초기화
        const sliders = ['relationship', 'health', 'career'];
        sliders.forEach(type => {
            const slider = document.getElementById(`${type}-slider`);
            if (slider) {
                slider.value = 5; // 기본값 5로 설정
            }
        });
    }

    static setupSliders(sliderConfig, scenarioResults) {
        const container = document.getElementById('slider-container');
        const rowLabels = container.querySelector('.row.mb-4');
        const rowSliders = container.querySelector('.row.mb-2');

        rowLabels.innerHTML = '';
        rowSliders.innerHTML = '';

        // 현재 슬라이더 값들을 추적하기 위한 객체
        this.currentValues = {};

        sliderConfig.forEach(slider => {
            const labelCol = document.createElement('div');
            labelCol.className = 'col text-center text-white';
            labelCol.textContent = slider.label;
            rowLabels.appendChild(labelCol);

            const sliderCol = document.createElement('div');
            sliderCol.className = 'col';
            sliderCol.innerHTML = `
            <input type="range" class="form-range" 
                id="${slider.id}-slider" 
                min="0" max="10" value="5">
            <div class="text-center text-white" id="${slider.id}-value">5</div>
        `;
            rowSliders.appendChild(sliderCol);

            // 초기값 설정
            this.currentValues[slider.id] = 5;

            const sliderElement = sliderCol.querySelector('.form-range');
            const valueDisplay = sliderCol.querySelector(`#${slider.id}-value`);

            sliderElement.addEventListener('input', (e) => {
                const newValue = parseInt(e.target.value);
                const sliderId = e.target.id.replace('-slider', '');
            
                // 다른 슬라이더들의 현재 총합 계산
                const otherSlidersTotal = Object.entries(this.currentValues)
                    .filter(([key]) => key !== sliderId)
                    .reduce((sum, [, value]) => sum + value, 0);

                // 새로운 값이 허용되는지 확인
                if (otherSlidersTotal + newValue > 10) {
                    // 초과하는 경우, 다른 슬라이더들의 값을 비례적으로 감소
                    const excess = otherSlidersTotal + newValue - 10;
                    const otherSliders = Object.keys(this.currentValues)
                        .filter(key => key !== sliderId);
                
                    otherSliders.forEach(key => {
                        const currentValue = this.currentValues[key];
                        const reduction = Math.floor(excess * (currentValue / otherSlidersTotal));
                        const newSliderValue = Math.max(0, currentValue - reduction);
                    
                        this.currentValues[key] = newSliderValue;
                        const otherSlider = document.getElementById(`${key}-slider`);
                        const otherDisplay = document.getElementById(`${key}-value`);
                        if (otherSlider && otherDisplay) {
                            otherSlider.value = newSliderValue;
                            otherDisplay.textContent = newSliderValue;
                        }
                    });
                }

                // 현재 슬라이더 값 업데이트
                this.currentValues[sliderId] = newValue;
                valueDisplay.textContent = newValue;
            });
        });

        // 결정 버튼 이벤트 리스너
        const submitButton = document.getElementById('slider-submit');
        if (submitButton) {
            submitButton.replaceWith(submitButton.cloneNode(true));
            const newSubmitButton = document.getElementById('slider-submit');
        
            newSubmitButton.addEventListener('click', () => {
                console.log('결정 버튼 클릭됨');
                const values = this.currentValues; // getSliderValues() 대신 현재 값들 사용
                console.log('현재 슬라이더 값들:', values);
            
                this.processSliderResult(values, scenarioResults);
                this.hideSlider();
            });
        }
    }

    static getSliderValues() {
        return { ...this.currentValues };
    }

    static processSliderResult(values, results) {
        let result;
        if (values.relationship >= 6) {
            result = results.relationshipFocus;
        } else if (values.health >= 6) {
            result = results.healthFocus;
        } else if (values.career >= 6) {
            result = results.careerFocus;
        } else {
            result = results.balanced;
        }

        // 결과 표시
        if (result) {
            // 배경 변경
            const background = document.getElementById('background');
            if (background) {
                background.style.backgroundImage = `url(${result.background})`;
            }

            // 캐릭터 변경
            const character = document.getElementById('character');
            if (character) {
                character.src = result.character;
                character.style.display = 'block';
            }

            // 텍스트 표시
            const textBox = document.getElementById('text');
            if (textBox) {
                this.typeText(textBox, result.text);
            }

            // 스탯 업데이트
            if (result.stats) {
                Object.entries(result.stats).forEach(([key, value]) => {
                    this.updateHUD(key, value);
                });
            }
        }
    }
}