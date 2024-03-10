import { mainListMaxPosition } from "./script.js";

async function loadIgnoredNames() {
    const response = await fetch('/data/ignoredNames.txt');
    const data = await response.text();
    return data.split('\n').map(name => name.trim().toLowerCase());
}

main();
async function main() {
    loadIgnoredNames = await loadIgnoredNames();
    processLevelData();
}

function processLevelData()
{
    let levelData;
    let scores = {};
    let originalNames = {};
    
    fetch('/data/leveldata.json')
    .then(response => response.json())
    .then(data => {
        levelData = data.Data;
        levelData.forEach(level => {
            let verifier = level.verifier_lvl.toLowerCase();
            originalNames[verifier] = level.verifier_lvl;
            if (!loadIgnoredNames.includes(verifier)) 
            {
                let score = 0;
                let levelIsLegacy = false;
                if(level.position_lvl > mainListMaxPosition)
                {
                    levelIsLegacy = true;
                }
                if(!levelIsLegacy)
                {
                    score = getScore(level.position_lvl);
                }
                if (verifier in scores) {
                    scores[verifier] += score;
                } else {
                    scores[verifier] = score;
                }
            }
        });
        return fetch('/data/playerdata.json');
    })
    .then(response => response.json())
    .then(playerData => {
        playerData.Data.forEach(player => {
            let playerName = player.player_name.toLowerCase();
            let levelDataLowercase = levelData.map(l => ({...l, name_lvl: l.name_lvl.toLowerCase()}));
            originalNames[playerName] = player.player_name;
            if (!loadIgnoredNames.includes(playerName)) {
                let level = levelDataLowercase.find(l => l.name_lvl === player.level_name.toLowerCase());
                if (level) 
                {
                    let score = 0;
                    if(level.position_lvl <= mainListMaxPosition)
                    {
                        if (player.progress >= 100) {
                            score = getScore(level.position_lvl);
                        } else if (player.progress >= levelData.find(l => l.name_lvl === player.level_name).listpct_lvl) {
                            score = getScoreProgress(level.position_lvl, player.progress);
                        }
                    }
                    if (playerName in scores) {
                        scores[playerName] += score;
                    } else {
                        scores[playerName] = score;
                    }
                }
            }
        });
        let sortedScores = Object.entries(scores).sort((a, b) => {
            // First, compare the scores
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            // If the scores are equal, compare the player names
            return originalNames[a[0]].localeCompare(originalNames[b[0]]);
        });

        let tableBody = document.getElementById('table-body');
        let modalBody = document.querySelector('.modal-body');
        let position = 1;
        sortedScores.forEach(score => {
            let row = document.createElement('tr');
            let positionCell = document.createElement('td');
            positionCell.innerText = '#' + position;
            positionCell.classList.add('text-center');
            row.appendChild(positionCell);
            let playerCell = document.createElement('td');
            playerCell.innerText = originalNames[score[0]];
            playerCell.classList.add('text-center');
            row.appendChild(playerCell);
            let scoreCell = document.createElement('td');
            scoreCell.innerText = score[1].toFixed(2);
            scoreCell.classList.add('text-center');
            row.appendChild(scoreCell);
            let detailsCell = document.createElement('td');
            detailsCell.classList.add('text-center');
            let detailsButton = document.createElement('button');
            detailsButton.innerHTML = '<i class="fas fa-eye"></i>';
            detailsButton.setAttribute('data-bs-toggle', 'tooltip');
            detailsButton.setAttribute('data-bs-placement', 'top');
            detailsButton.setAttribute('title', 'Ver detalhes');
            detailsButton.classList.add('btn', 'btn-primary', 'btn-sm');
            detailsButton.setAttribute('data-bs-toggle', 'modal');
            detailsButton.setAttribute('data-bs-target', '#playerDetails-modal');
            detailsButton.addEventListener('click', () => {
                let i;
                modalBody.innerHTML = '';
                const playerDetailsLabel = document.getElementById('playerDetailsLabel');
                playerDetailsLabel.innerText = originalNames[score[0]];

                //adicionar levels completados
                let levelDataLowercase = levelData.map(l => ({...l, name_lvl: l.name_lvl.toLowerCase()}));
                let playerLevels = playerData.Data.filter(p => {
                    let playerName = p.player_name.toLowerCase();
                    originalNames[playerName] = p.player_name;
                    return playerName === score[0].toLowerCase() && p.progress === 100;
                });

                if (playerLevels.length > 0) {
                    playerLevels.sort((a, b) => {
                        let aLevelData = levelDataLowercase.find(l => l.name_lvl === a.level_name.toLowerCase());
                        let bLevelData = levelDataLowercase.find(l => l.name_lvl === b.level_name.toLowerCase());
                        if (aLevelData && bLevelData) {
                            return aLevelData.position_lvl - bLevelData.position_lvl;
                        } else {
                            return 0;
                        }
                    });

                    i = 0;
                    playerLevels.forEach(() => {i++;});
                    let levelsCompleted = document.createElement('h3');
                    levelsCompleted.innerText = 'Demons completados (' + i + '):';
                    modalBody.appendChild(levelsCompleted);
                    playerLevels.forEach(level => {
                        let levelDataItem = levelDataLowercase.find(l => l.name_lvl === level.level_name.toLowerCase());
                        if (levelDataItem) {
                            //get id_lvl
                            level.id_lvl = levelDataItem.id_lvl;

                            level.position_lvl = levelDataItem.position_lvl;
                            let levelElement = document.createElement('a');
                            levelElement.textContent = '#' + level.position_lvl + '. ' + level.level_name;
                            levelElement.href = '/pages/leveldetails.html?id=' + level.id_lvl;
                            let pElement = document.createElement('p');
                            pElement.appendChild(levelElement);
                            modalBody.appendChild(pElement);
                        } else {
                            console.log('Nenhum nível correspondente encontrado para:', level.level_name);
                        }
                    });
                }

                //adicionar levels verificados
                let playerVerifiedLevels = levelData.filter(l => {
                    let verifier = l.verifier_lvl.toLowerCase();
                    originalNames[verifier] = l.verifier_lvl;
                    return verifier === score[0].toLowerCase();
                });

                playerVerifiedLevels.sort((a, b) => a.position_lvl - b.position_lvl);
                if (playerVerifiedLevels.length > 0) {
                    i = 0;
                    playerVerifiedLevels.forEach(() => {i++;});
                    let levelsVerified = document.createElement('h3');
                    levelsVerified.innerText = 'Demons verificados (' + i + '):';
                    modalBody.appendChild(levelsVerified);
                    playerVerifiedLevels.forEach(level => {
                        //get id_lvl
                        level.id_lvl = levelDataLowercase.find(l => l.name_lvl === level.name_lvl.toLowerCase()).id_lvl;

                        let levelElement = document.createElement('a');
                        levelElement.textContent = '#' + level.position_lvl + '. ' + level.name_lvl;
                        levelElement.href = '/pages/leveldetails.html?id=' + level.id_lvl;
                        let pElement = document.createElement('p');
                        pElement.appendChild(levelElement);
                        modalBody.appendChild(pElement);
                    });
                }

                //adicionar levels em progresso
                let playerProgressLevels = playerData.Data.filter(p => {
                    let playerName = p.player_name.toLowerCase();
                    originalNames[playerName] = p.player_name;
                    return playerName === score[0].toLowerCase() && p.progress < 100;
                });
                if (playerProgressLevels.length > 0) {
                    const listpct = levelDataLowercase.find(l => l.name_lvl === playerProgressLevels[0].level_name.toLowerCase()).listpct_lvl;
                    if (playerProgressLevels.some(p => p.progress >= listpct)) {
                        let levelsProgress = document.createElement('h3');
                        levelsProgress.innerText = 'Progressos:';
                        modalBody.appendChild(levelsProgress);
                        playerProgressLevels.forEach(level => {
                            let levelDataItem = levelDataLowercase.find(l => l.name_lvl === level.level_name.toLowerCase());
                            if (levelDataItem) {
                                //get id_lvl
                                level.id_lvl = levelDataItem.id_lvl;

                                level.position_lvl = levelDataItem.position_lvl;
                                let levelElement = document.createElement('a');
                                levelElement.textContent = '#' + level.position_lvl + '. ' + level.level_name + ', ' + level.progress + '%';
                                levelElement.href = '/pages/leveldetails.html?id=' + level.id_lvl;
                                let pElement = document.createElement('p');
                                pElement.appendChild(levelElement);
                                modalBody.appendChild(pElement);
                            } else {
                                console.log('Nenhum nível correspondente encontrado para:', level.level_name);
                            }
                        });
                    }
                }
            });
            detailsCell.appendChild(detailsButton);
            row.appendChild(detailsCell);
            
            tableBody.appendChild(row);
            position++;
        });
    })
}