import { listMaxPosition } from "/DemonlistBR/assets/script/script.js";

async function loadIgnoredNames() {
    const response = await fetch('/DemonlistBR/data/ignoredNames.txt');
    const data = await response.text();
    return data.split('\n').map(name => name.trim().toLowerCase());
}

main();
async function main() {
    loadIgnoredNames = await loadIgnoredNames();
    let scores = await processScore();
    fillPlayerList(scores);
    await updatePlayerCard(scores[0][0]);

    const playerRanking = document.getElementById('player-ranking');
    playerRanking.style.visibility = 'visible';
}

async function processScore() {
    let scores = {};
    let originalNames = {};
    let levelMap = {};

    const [levelResponse, playerResponse] = await Promise.all([
        fetch('/DemonlistBR/data/leveldata.json'),
        fetch('/DemonlistBR/data/playerdata.json')
    ]);

    const levelData = (await levelResponse.json()).Data;
    const playerData = (await playerResponse.json()).Data;

    // Process level data
    levelData.forEach(level => {
        let creator = level.creator_lvl.toLowerCase();
        let verifier = level.verifier_lvl.toLowerCase();
        originalNames[creator] = level.creator_lvl;
        originalNames[verifier] = level.verifier_lvl;

        if (!loadIgnoredNames.includes(verifier)) {
            let score = 0;
            if (level.position_lvl <= listMaxPosition) {
                score = getScore(level.position_lvl);
            }
            scores[verifier] = (scores[verifier] || 0) + score;
        }
        if (!loadIgnoredNames.includes(creator)) {
            scores[creator] = (scores[creator] || 0);
        }
        levelMap[level.id_lvl] = level;
    });

    // Process player data
    playerData.forEach(player => {
        let playerName = player.player_name.toLowerCase();
        originalNames[playerName] = player.player_name;

        if (!loadIgnoredNames.includes(playerName)) {
            let level = levelMap[player.id_lvl];

            if (level && level.position_lvl <= listMaxPosition) {
                let score = 0;
                if (player.progress >= 100) {
                    score = getScore(level.position_lvl);
                } else if (player.progress >= level.listpct_lvl) {
                    score = getScoreProgress(level.position_lvl, player.progress);
                }
                scores[playerName] = (scores[playerName] || 0) + score;
            }
        }
    });

    // sort
    let sortedScores = Object.entries(scores)
        .sort((a, b) => {
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            return originalNames[a[0]].localeCompare(originalNames[b[0]]);
        })
        .map(score => [originalNames[score[0]], score[1]]);

    return sortedScores;
}

async function pickPlayerData(name, scores) {
    // a função deve retornar um objeto com as seguintes propriedades:
    // - name: nome do jogador
    // - score: pontuação do jogador
    // - position: posição do jogador no ranking
    // - creations: todos os níveis criados pelo jogador
    // - completions: todos os níveis completados pelo jogador
    // - verifications: todos os níveis verificados pelo jogador
    // - progresses: todos os níveis em progresso pelo jogador

    let levelMap = {};
    let originalNames = {};

    let player = {
        name: name,
        score: 0,
        position: 0,
        creations: [],
        completions: [],
        verifications: [],
        progresses: []
    };

    name = name.toLowerCase();
    
    let playerScore = scores.find(player => player[0].toLowerCase() === name);
    if (playerScore) {
        player.score = playerScore[1];
        player.position = scores.indexOf(playerScore) + 1;
    }

    // get verifications and completions
    const [levelResponse, playerResponse] = await Promise.all([
        fetch('/DemonlistBR/data/leveldata.json'),
        fetch('/DemonlistBR/data/playerdata.json')
    ]);

    const levelData = (await levelResponse.json()).Data;
    const playerData = (await playerResponse.json()).Data;

    levelData.forEach(level => {
        let verifier = level.verifier_lvl.toLowerCase();
        originalNames[verifier] = level.verifier_lvl;

        if(level.creator_lvl.toLowerCase() === name) {
            player.creations.push(level);
        }

        if (verifier === name) {
            player.verifications.push(level);
        }
        levelMap[level.id_lvl] = level;
    });

    playerData.forEach(record => {
        let playerName = record.player_name.toLowerCase();
        originalNames[playerName] = record.player_name;
        if (playerName === name) {
            let level = levelMap[record.id_lvl];
            console.log(level);
            if (level) {
                if (record.progress >= 100) {
                    player.completions.push(level);
                } else if (record.progress >= level.listpct_lvl) {
                    player.progresses.push({ level, progress: record.progress }); // push level + record.progress
                }
            }
        }
    });
    player.completions.sort((a, b) => a.position_lvl - b.position_lvl);
    player.verifications.sort((a, b) => a.position_lvl - b.position_lvl);
    
    return player;
}

function fillPlayerCard(player) {
    const playerName = document.getElementById('card-player-name');
    const playerPosition = document.getElementById('card-player-pos');
    const playerScore = document.getElementById('card-player-score');

    // Limpar os elementos
    const elementsToClear = ['card-player-creations', 'card-player-completions', 'card-player-verifications', 'card-player-progresses'];
    elementsToClear.forEach(elementId => {
        const element = document.getElementById(elementId);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    });

    playerName.textContent = player.name;
    player.score > 0 ? playerPosition.textContent = `#${player.position}` : playerPosition.textContent = '-';
    playerScore.textContent = player.score.toFixed(2);

    function createLinks(playerData, elementId, progress = false) {
        const element = document.getElementById(elementId);
        if (playerData.length === 0) {
            element.textContent = 'Nenhum';
            return;
        }
        for (const data of playerData) {
            const a = document.createElement('a');
            a.classList.add('small-margin-p');
            a.href = `/DemonlistBR/pages/leveldetails.html?id=${data.level ? data.level.id_lvl : data.id_lvl}`;
            a.style.textDecoration = 'none';
            a.textContent = progress ? `${data.level.name_lvl} (${data.progress}%)` : data.name_lvl;
            a.textContent = progress ? `#${data.level.position_lvl}. ${a.textContent}` : `#${data.position_lvl}. ${a.textContent}`
            element.appendChild(a);

            const br = document.createElement('br');
            element.appendChild(br);
        }
    }

    createLinks(player.creations, 'card-player-creations');
    createLinks(player.completions, 'card-player-completions');
    createLinks(player.verifications, 'card-player-verifications');
    createLinks(player.progresses, 'card-player-progresses', true);
}

function fillPlayerList(players) {
    const playerList = document.getElementById('player-list');
    for (let i = 0; i < players.length; i++) {
       const player = players[i];
       const li = document.createElement('li');
       i === 0 ? li.classList.add('active') : null;
       li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
       li.id = `player-${i}`;
       const pos = document.createElement('span');
       pos.id = 'player-pos';
       player[1] > 0 ? pos.textContent = `#${i + 1}` : pos.textContent = '-';
       const name = document.createElement('span');
       name.id = 'player-name';
       name.textContent = player[0];
       const score = document.createElement('span');
       score.id = 'player-score';
       score.classList.add('badge', 'text-bg-primary', 'rounded-pill');
       score.textContent = player[1].toFixed(2);
       li.appendChild(pos);
       li.appendChild(name);
       li.appendChild(score);
       playerList.appendChild(li);

       li.addEventListener('click', function() {
            if (li.classList.contains('active')) return;
            const listItems = playerList.getElementsByTagName('li');
            for (let j = 0; j < listItems.length; j++) {
                listItems[j].classList.remove('active');
            }
            li.classList.add('active');
            
            updatePlayerCard(player[0]);
       });
    }
}

async function updatePlayerCard(name) {
    let scores = await processScore();
    let playerData = await pickPlayerData(name, scores);
    fillPlayerCard(playerData);
}