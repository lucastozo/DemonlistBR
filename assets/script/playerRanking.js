import { mainListMaxPosition } from "./script.js";

async function loadIgnoredNames() {
    const response = await fetch('/data/ignoredNames.txt');
    const data = await response.text();
    return data.split('\n').map(name => name.trim().toLowerCase());
}

main();
async function main() {
    loadIgnoredNames = await loadIgnoredNames();
    let scores = await processScore();
    //console.log(scores);
    let playerData = pickPlayerData('IcyWindy', scores);
    console.log(playerData);
    
}

async function processScore() {
    let scores = {};
    let originalNames = {};
    let levelMap = {};

    // Fetch data together to reduce network overhead
    const [levelResponse, playerResponse] = await Promise.all([
        fetch('/data/leveldata.json'),
        fetch('/data/playerdata.json')
    ]);

    const levelData = (await levelResponse.json()).Data;
    const playerData = (await playerResponse.json()).Data;

    // Process level data
    levelData.forEach(level => {
        let verifier = level.verifier_lvl.toLowerCase();
        originalNames[verifier] = level.verifier_lvl;

        // Check if verifier name is not in the ignored list
        if (!loadIgnoredNames.includes(verifier)) {
            let score = 0;
            if (level.position_lvl <= mainListMaxPosition) {
                score = getScore(level.position_lvl);
            }
            scores[verifier] = (scores[verifier] || 0) + score;
        }
        levelMap[level.name_lvl.toLowerCase()] = level;
    });

    // Process player data
    playerData.forEach(player => {
        let playerName = player.player_name.toLowerCase();
        originalNames[playerName] = player.player_name;

        // Check if player name is not in the ignored list
        if (!loadIgnoredNames.includes(playerName)) {
            let level = levelMap[player.level_name.toLowerCase()];

            // Check if level exists and meets conditions
            if (level && level.position_lvl <= mainListMaxPosition) {
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

    // Sort scores based on scores and original names
    let sortedScores = Object.entries(scores)
        .sort((a, b) => {
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            return originalNames[a[0]].localeCompare(originalNames[b[0]]);
        });

    // Return or process the sorted scores as needed
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
    const ogName = name;
    name = name.toLowerCase();

    let player = {
        name: ogName,
        score: 0,
        position: 0,
        creations: [],
        completions: [],
        verifications: [],
        progresses: []
    };

    // Find the player's score
    let playerScore = scores.find(player => player[0] === name);
    if (playerScore) {
        player.score = playerScore[1];
        player.position = scores.indexOf(playerScore) + 1;
    }

    // get verifications and completions
    const [levelResponse, playerResponse] = await Promise.all([
        fetch('/data/leveldata.json'),
        fetch('/data/playerdata.json')
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
        levelMap[level.name_lvl.toLowerCase()] = level;
    });

    playerData.forEach(record => {
        let playerName = record.player_name.toLowerCase();
        originalNames[playerName] = record.player_name;
        if (playerName === name) {
            let level = levelMap[record.level_name.toLowerCase()];
            if (level) {
                if (record.progress >= 100) {
                    player.completions.push(level);
                } else if (record.progress >= level.listpct_lvl) {
                    player.progresses.push({ level, progress: record.progress }); // push level + record.progress
                }
            }
        }
    });
    return player;
}