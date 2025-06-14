const SCENARIOS = {
    1: {
        day_start: {
            question: "어이~ 자네! 오늘 회식인데 \n당연히 올 거지?",
            background: "img/background-office.png",
            character: "img/boss.png",
            choices: {
                attend: {
                    text: "네, 참석하겠습니다!",
                    result: {
                        text: "삼겹살 전문점에서 팀장님과 \n즐거운 회식을 했습니다.\n건강은 조금 걱정되지만, 팀원들과 더 \n가까워진 것 같습니다.",
                        character: "img/boss-happy.png",
                        background: "img/background-restaurant.png"
                    },
                    stats: { relationship: 1, health: -1 }
                },
                decline: {
                    text: "죄송합니다, 다른 약속이...",
                    result: {
                        text: "급한 개인 사정을 \n핑계로 회식을 거절했습니다.\n다음날 아침, 팀장님의 표정이 \n좋지 않습니다...",
                        character: "img/boss-angry.png",
                        background: "img/background-office.png"
                    },
                    stats: { relationship: -1, health: 1 }
                }
            }
        },
        day_end: {
            question: "하루가 지났습니다...",
            nextDay: 2
        }
    },
    2: {
        day_start: {
            question: "이번 프로젝트 고생들 많았어~ \n오늘 저녁에 맛있는 거 사줄게 \n다들 일정 비워~ 😊",
            background: "img/background-day2.png",
            character: "img/boss.png",
            choices: {
                attend: {
                    text: "네, 감사합니다!",
                    result: {
                        text: "맛있는 식사와 함께 \n팀원들과 즐거운 시간을 보냈습니다.\n팀장님께서 매우 기뻐하시는 \n것 같습니다.",
                        character: "img/boss-happy.png",
                        background: "img/background-restaurant.png"
                    },
                    stats: { relationship: 1, career: 1, health: -1 }
                },
                decline: {
                    text: "죄송합니다, 오늘은...",
                    result: {
                        text: "이번 회식을 거절했습니다.\n팀장님이 많이 실망한 것 같습니다.",
                        character: "img/boss-angry.png",
                        background: "img/background-day2.png"
                    },
                    stats: { career: -1, health: 1, relationship: -1 }
                }
            }
        },
        day_end: {
            question: "또 하루가 지나며...",
            nextDay: 3
        }
    },
    3: {
        day_start: {
            question: "부장님이 회식 참석을 종용하는데...\n오늘은 미리 준비한 \n도시락이 있습니다.\n어떻게 하시겠습니까?",
            background: "img/background-office.png",
            character: "img/boss.png",
            draggableItems: [
                {
                    id: "lunchbox",
                    image: "img/item-lunchbox.png",
                    tooltip: "맛있는 도시락",
                    initialPosition: { x: 400, y: 500 }
                }
            ],
            dropZones: [
                {
                    id: "boss",
                    position: { x: 300, y: 300 },
                    text: "부장님께 도시락을 선물하기",
                    result: {
                        text: "부장님이 감동받으셨습니다!\n'자네 요즘 힘들었지?' \n오늘은 일찍 퇴근하라며 \n회식을 건너뛰게 해주셨습니다.",
                        character: "img/boss-happy.png",
                        background: "img/background-office.png",
                        stats: { relationship: 2, health: -1, career: 1 }
                    }
                },
                {
                    id: "desk",
                    position: { x: 500, y: 300 },
                    text: "몰래 도시락 먹기",
                    result: {
                        text: "부장님 몰래 도시락을 \n먹으려다 들키고 말았습니다.\n'이렇게 성의가 없어서야...'",
                        character: "img/boss-angry.png",
                        background: "img/background-office.png",
                        stats: { relationship: -2, career: -1, health: 1 }
                    }
                }
            ]
        },
        day_end: {
            question: "도시락의 향기가 사무실에 퍼졌습니다...",
            nextDay: 4
        }
    },
    4: {
        day_start: {
            question: "오늘은 중요한 \n거래처와의 회식입니다.\n술잔이 돌아가는데...",
            background: "img/background-bar.png",
            character: "img/client.png",
            draggableItems: [
                {
                    id: "sojuGlass",
                    image: "img/item-soju.png",
                    initialPosition: { x: 300, y: 500 }
                },
                {
                    id: "waterGlass",
                    image: "img/item-water.png",
                    initialPosition: { x: 500, y: 500 }
                }
            ],
            dropZones: [
                {
                    id: "client",
                    position: { x: 300, y: 300 },
                    text: "거래처 상무님께",
                    validItems: {
                        sojuGlass: {
                            text: "상무님과 즐거운 시간을 보냈습니다.\n계약 성사의 기회를 얻었지만, \n다음날 숙취가 엄청납니다.",
                            character: "img/client-happy.png",
                            background: "img/background-bar.png",
                            stats: { career: 2, relationship: 1, health: -2 }
                        },
                        waterGlass: {
                            text: "물을 건네자 상무님의 \n표정이 굳어졌습니다.\n'아... 자네는 술을 못하나?'\n분위기가 매우 어색해졌습니다.",
                            character: "img/client-angry.png",
                            background: "img/background-bar.png",
                            stats: { career: -2, relationship: -2, health: 1 }
                        }
                    }
                },
                {
                    id: "self",
                    position: { x: 500, y: 300 },
                    text: "자신의 자리에",
                    validItems: {
                        waterGlass: {
                            text: "물을 마시며 적당히 \n회식을 버텼습니다.\n건강은 지켰지만, 분위기가 다소 \n싸해졌습니다.",
                            character: "img/client-angry.png",
                            background: "img/background-bar.png",
                            stats: { health: 1, career: -1, relationship: -1 }
                        },
                        sojuGlass: {
                            text: "혼자서 술을 마시다가 취해버렸습니다.\n실수로 상무님께 실례를 했고,\n다음날 아침 머리가 깨질 것 같습니다.",
                            character: "img/client-angry.png",
                            background: "img/background-bar.png",
                            stats: { health: -2, career: -2, relationship: -1 }
                        }
                    }
                }
            ]
        },
        day_end: {
            question: "술자리가 끝나고 다음날이 밝았습니다...",
            nextDay: 5
        }
    },
    5: {
        day_start: {
            question: "오늘은 거래처와 \n늦은 회식이 잡혔습니다.\n남은 에너지를 어떻게 \n분배하시겠습니까?",
            background: "img/background-day2.png",
            character: "img/character.png",
            useSlider: true,
            sliderInteraction: {
                sliders: [
                    {
                        id: "relationship",
                        label: "회식 참여도",
                        description: "높을수록 인간관계에 좋지만 건강은 나빠집니다"
                    },
                    {
                        id: "health",
                        label: "휴식",
                        description: "건강을 회복하지만 회식 참여도가 낮아집니다"
                    },
                    {
                        id: "career",
                        label: "업무 집중",
                        description: "업무에 집중하면 커리어는 좋아지지만..."
                    }
                ],
                totalPoints: 10,
                results: {
                    relationshipFocus: {
                        condition: { relationship: 6 },
                        text: "늦은 시간까지 회식에 \n열심히 참여했습니다.\n팀장님이 매우 흡족해하시지만...\n다음날 아침, 힘들어서 \n움직일 수가 없습니다.",
                        character: "img/character.png",
                        background: "img/background-restaurant.png",
                        stats: { relationship: 2, health: -2, career: -1 }
                    },
                    healthFocus: {
                        condition: { health: 6 },
                        text: "적당히 핑계를 대고 일찍 귀가했습니다.\n편안히 쉴 수 있었지만,\n팀장님의 눈빛이 심상치 않습니다.",
                        character: "img/boss-angry.png",
                        background: "img/background-day2.png",
                        stats: { relationship: -2, health: 2, career: -1 }
                    },
                    careerFocus: {
                        condition: { career: 6 },
                        text: "회식 대신 야근을 선택했습니다.\n프로젝트는 순조롭게 진행되지만,\n팀원들과 거리가 멀어지는 것 같습니다.",
                        character: "img/character-working.png",
                        background: "img/background-office-night.png",
                        stats: { relationship: -1, health: -1, career: 2 }
                    },
                    balanced: {
                        condition: "default",
                        text: "모든 것을 적당히 조절했습니다.\n특별한 문제는 없지만,\n무언가 아쉬운 하루였습니다.",
                        character: "img/character.png",
                        background: "img/background-day2.png",
                        stats: { relationship: 0, health: 0, career: 0 }
                    }
                }
            }
        },
        day_end: {
            question: "하루가 저물어갑니다...",
            nextDay: 6
        }
    },
    6: {
        // 6일차 내용
        day_start: {
            question: "대표이사님과의 회식입니다.\n오늘 마시는 술의 강도를 \n조절해야 합니다.",
            background: "img/background-vip-room.png",
            character: "img/ceo.png",
            useSlider: true,
            sliderInteraction: {
                sliders: [
                    {
                        id: "drinkingPace",
                        label: "술자리 페이스",
                        description: "빠를수록 관계는 좋아지지만 건강은 나빠집니다"
                    }
                ],
                totalPoints: 10,
                results: {
                    heavyDrinking: {
                        condition: {drinkingPace: 8},
                        text: "대표님과 막걸리부터 위스키까지...\n완벽한 인연을 쌓았지만,\n다음날 병원에 실려갈 것 같습니다.",
                        character: "img/ceo-happy.png",
                        background: "img/background-vip-room.png",
                        stats: {relationship: 3, health: -3, career: 2}
                    },
                    moderateDrinking: {
                        condition: {drinkingPace: 5},
                        text: "적당히 분위기를 맞추며 건배했습니다.\n무난한 저녁이었지만,\n특별한 인상을 남기진 못했습니다.",
                        character: "img/ceo.png",
                        background: "img/background-vip-room.png",
                        stats: {relationship: 1, health: -1, career: 0}
                    },
                    lightDrinking: {
                        condition: {drinkingPace: 2},
                        text: "술을 거의 마시지 않았습니다.\n건강은 지켰지만, 대표님께서\n실망한 기색이 역력합니다.",
                        character: "img/ceo-angry.png",
                        background: "img/background-vip-room.png",
                        stats: {relationship: -2, health: 1, career: -2}
                    }
                }
            }
        },
        day_end: {
            question: "점점 일주일이 마무리 될 무렵...",
            nextDay: 7
        }
    },
    
    7: {
        day_start: {
            question: "마지막 날입니다. \n어떻게 마무리하시겠습니까?",
            background: "img/background-office.png",
            character: "img/character.png",
            finalDay: true,  // 최종일 표시
            choices: {
                finalDayChoices: [
                    {
                        id: 1,
                        title: "마지막까지 열심히",
                        image: "img/cards/work-hard.png",
                        description: "마지막까지 일에 집중하며 체면 차리기",
                        effects: {
                            relationship: -1,
                            health: -1,
                            career: +2
                        }
                    },
                    {
                        id: 2,
                        title: "적당한 밸런스",
                        image: "img/cards/balance.png",
                        description: "무난하게 마무리하기",
                        effects: {
                            relationship: +2,
                            health: +2,
                            career: +2
                        }
                    },
                    {
                        id: 3,
                        title: "화끈한 마무리",
                        image: "img/cards/party-hard.png",
                        description: "마지막은 확실하게 놀아버리기",
                        effects: {
                            relationship: +2,
                            health: -1,
                            career: -1
                        }
                    }
                ]
            }
        },
        endings: {
            successCareer: {
                title: "팀장으로 승진했지만 고립됨",
                image: "img/endings/lonely-boss.png",
                description: "당신은 성공했지만, 혼자가 되었습니다..."
            },
            healthyFired: {
                title: "몸은 건강하지만 짤림",
                image: "img/endings/healthy-fired.png",
                description: "건강을 지켰지만, 직장은 잃었습니다."
            },
            normalQuit: {
                title: "평범하게 퇴사",
                image: "img/endings/normal-quit.png",
                description: "모든 것이 적당했던 퇴사였습니다."
            },
            burnout: {
                title: "회식 지옥에서 번아웃",
                image: "img/endings/burnout.png",
                description: "모든 것을 잃어버렸습니다..."
            },
            popularTired: {
                title: "인싸지만 탈진",
                image: "img/endings/popular-tired.png",
                description: "인기는 얻었지만, 건강을 잃었습니다."
            }
        }
    }
};