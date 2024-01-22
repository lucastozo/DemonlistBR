// EQUAÇÂO DE PONTUAÇÂO ABAIXO, IMPORTANTE
function getScore(position) {
    var score = 100 / Math.log(position + 1);
    return score;
}

let levelData;
let scores = {};

// ignorar não brasileiros
let ignoredNames = [
                    'Luqualizer',
                    'Atomic'
                    ].map(name => name.toLowerCase());

fetch('/data/leveldata.json')
.then(response => response.json())
.then(data => {
    levelData = data.Data;
    levelData.forEach(level => {
        let verifier = level.verifier_lvl;
        if (!ignoredNames.includes(verifier.toLowerCase())) {
            let score = getScore(level.position_lvl);
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
        if (!ignoredNames.includes(player.player_name.toLowerCase())) {
            let level = levelData.find(l => l.name_lvl === player.level_name);
            if (level) {
                let score = getScore(level.position_lvl);
                if (player.player_name in scores) {
                    scores[player.player_name] += score;
                } else {
                    scores[player.player_name] = score;
                }
            }
        }
    });
    let sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

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
        playerCell.innerText = score[0];
        playerCell.classList.add('text-center');
        row.appendChild(playerCell);
        let scoreCell = document.createElement('td');
        scoreCell.innerText = score[1].toFixed(2);
        scoreCell.classList.add('text-center');
        row.appendChild(scoreCell);
        let detailsCell = document.createElement('td');
        detailsCell.classList.add('text-center');
        let detailsButton = document.createElement('button');
        detailsButton.innerText = 'placeholder';
        detailsButton.classList.add('btn', 'btn-primary', 'btn-sm');
        detailsButton.setAttribute('data-bs-toggle', 'modal');
        detailsButton.setAttribute('data-bs-target', '#playerDetails-modal');
        detailsButton.addEventListener('click', () => {
            modalBody.innerHTML = '';
            var playerDetailsLabel = document.getElementById('playerDetailsLabel');
            playerDetailsLabel.innerText = score[0];

            //adicionar levels completados
            // TODO: conseguir ordenar por posição
            let playerLevels = playerData.Data.filter(p => p.player_name === score[0] && p.progress === 100);
            if (playerLevels.length > 0) {
                let levelsCompleted = document.createElement('h3');
                levelsCompleted.innerText = 'Demons completados:';
                modalBody.appendChild(levelsCompleted);
                playerLevels.forEach(level => {
                    let levelElement = document.createElement('p');
                    level.position_lvl = levelData.find(l => l.name_lvl === level.level_name).position_lvl;
                    levelElement.textContent = '#' + level.position_lvl + '. ' + level.level_name;
                    modalBody.appendChild(levelElement);
                });
            }

            //adicionar levels verificados
            let playerVerifiedLevels = levelData.filter(l => l.verifier_lvl === score[0]);
            playerVerifiedLevels.sort((a, b) => a.position_lvl - b.position_lvl);
            if (playerVerifiedLevels.length > 0) {
                let levelsVerified = document.createElement('h3');
                levelsVerified.innerText = 'Demons verificados:';
                modalBody.appendChild(levelsVerified);
                playerVerifiedLevels.forEach(level => {
                    let levelElement = document.createElement('p');
                    levelElement.textContent = '#' + level.position_lvl + '. ' + level.name_lvl;
                    modalBody.appendChild(levelElement);
                });
            }
        });
        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);
        
        tableBody.appendChild(row);
        position++;
    });
    
})
.catch(err => console.log(err));