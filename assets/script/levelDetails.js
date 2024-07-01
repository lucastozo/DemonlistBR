import { listMaxPosition } from "./script.js";

document.addEventListener('DOMContentLoaded', () => {
    let params = new URLSearchParams(window.location.search);
    let levelId = params.get('id');

    //percorrer json e ver se existe o id, se não, mostrar mensagem de erro
    fetch('/data/leveldata.json')
    .then(response => response.json())
    .then(levelDataJson => {
        const levelData = levelDataJson.Data.find(level => level.id_lvl === levelId)
        if(levelData == null){
            idNotFound();
        }
    })
    .catch(error => console.error(error));

    //chamada GDBrowser
    getLevelInfo(levelId);
    async function getLevelInfo(levelId) {
        try {
            HideContentLoading(0); //flag 0 = loading, flag 1 = content

            const response = await fetch(`https://gdbrowser.com/api/level/${levelId}`);
            const data = await response.json();

            const responseLevelData = await fetch('/data/leveldata.json');
            const levelDataJson = await responseLevelData.json();
            const levelData = levelDataJson.Data.find(level => level.id_lvl === levelId)

            const combinedData = {...data, ...levelData};
            LoadLevelInfo(combinedData);

            HideContentLoading(1);
            await getPlayerData(data, levelData);
        } catch (error) {
            console.error(error);
        }
    }

    //chamada playerdata
    async function getPlayerData(levelDataGDB, levelDataJson) {
        try {
            const response = await fetch('/data/playerdata.json');
            const playerData = await response.json();
            const combinedData = {...playerData, ...levelDataGDB, ...levelDataJson};
            LoadProgress(combinedData);
        } catch (error) {
            console.error(error);
        }
    }
});

function LoadLevelInfo(data){
    document.title = '#' + data.position_lvl + '. ' + data.name;
    const levelName = document.getElementById("level-name");
    levelName.innerHTML = data.name;
    //se não existir publisher: criado por: creator, se existir: criado por: creator, publicado por: publisher
    const levelCreator = document.getElementById("level-creator");
    if(data.creator_lvl === data.verifier_lvl){
        levelCreator.innerHTML = 'Criado por: ' + data.creator_lvl;
    } else {
        levelCreator.innerHTML = 'Criado por: ' + data.creator_lvl + ', verificado por: ' + data.verifier_lvl;
    } if(data.publisher_lvl){
        levelCreator.innerHTML = levelCreator.innerHTML + ', publicado por: ' + data.author;
    }
    const levelDescription = document.getElementById("level-description");
    if(data.description !== "(No description provided)")
    {
        levelDescription.innerHTML = "\"" + data.description + "\"";
    } else {
        levelDescription.style.display = 'none';
    }

    const videoIframe = document.getElementById("level-video-iframe");
    videoIframe.src = "https://www.youtube.com/embed/" + ExtractVideoId(data.video_lvl);

    //level-info div
    const id = document.getElementById("level-id");
    id.innerHTML = data.id;
    const difficulty = document.getElementById("level-difficulty");
    if(data.cp !== 0){
        difficulty.innerHTML = data.difficulty;
    } else {
        difficulty.innerHTML = data.difficulty + " (unrated)";
    }
    if(data.demonList){
        const demonlist = document.getElementById("level-pointercrate");
        demonlist.innerHTML = "<a href='https://pointercrate.com/demonlist/" + data.demonList + "' target='_blank'>#" + data.demonList + "</a>";
        document.getElementById("level-pointercrate-div").style.display = 'block';
    }
    const song = document.getElementById("level-song");
    let songAdd;
    if(data.songID && typeof data.songID === 'string' && data.songID.includes('Level')){
        songAdd = "<p>"+ data.songName + "</p>";
    } else {
        songAdd = "<a href='https://www.newgrounds.com/audio/listen/" + data.songID + "' target='_blank'>" + data.songName + "</a>";
    }
    song.innerHTML = songAdd;
}

function LoadProgress(data) {
    const scoreCompletion = document.getElementById("score-completion");
    const scoreListpctTitle = document.getElementById("score-listpct-title");
    const scoreListpct = document.getElementById("score-listpct");
    const scoreCompletionDiv = document.getElementById("score-completion-div");
    const scoreListpctDiv = document.getElementById("score-listpct-div");
    const tableBody = document.getElementById('table-body');
    let listpct = 100;

    if (data.position_lvl <= listMaxPosition) {
        scoreCompletion.textContent = getScore(data.position_lvl).toFixed(2);
        if (data.listpct_lvl) {
            scoreListpctTitle.textContent = `Pontos em Ranking (${data.listpct_lvl}%)`;
            scoreListpct.textContent = getScoreProgress(data.position_lvl, data.listpct_lvl).toFixed(2);
            listpct = data.listpct_lvl;
        } else {
            scoreListpctDiv.style.display = 'none';
        }
    } else {
        scoreCompletionDiv.style.display = 'none';
        scoreListpctDiv.style.display = 'none';
    }

    const playerRecords = data.Data.filter(record => record.level_name.toLowerCase() === data.name.toLowerCase());
    playerRecords.sort((a, b) => b.progress - a.progress);

    playerRecords.forEach(record => {
        if(record.progress >= listpct){
            const row = document.createElement('tr');
            const playerNameCell = document.createElement('td');
            playerNameCell.textContent = record.player_name;
            row.appendChild(playerNameCell);
            const progressCell = document.createElement('td');
            progressCell.innerHTML = `<a href='${record.video}' target='_blank'>${record.progress}%</a>`;
            row.appendChild(progressCell);
            tableBody.appendChild(row);
        }
    });
}

function ExtractVideoId(videoUrl){
    let videoId;
    if(videoUrl == null || videoUrl === ''){
        return null;
    }
    if(videoUrl.includes('https://www.youtube.com/watch?v=')){
        videoId = videoUrl.split('https://www.youtube.com/watch?v=')[1];
    } else if(videoUrl.includes('https://youtu.be/')){
        videoId = videoUrl.split('https://youtu.be/')[1].split('?')[0];
    } else if(videoUrl.includes('https://m.youtube.com/watch?v=')){
        videoId = videoUrl.split('https://m.youtube.com/watch?v=')[1];
    } else if(videoUrl.includes('https://youtu.be/')){
        videoId = videoUrl.split('https://youtu.be/')[1];
    }
    return videoId;
}

function HideContentLoading(flag){
    if(flag === 0){
        document.getElementById('loading-spinner').style.display = 'block';
        document.getElementById('loading-spinner').style.margin = 'auto';

        document.getElementById('level-div').style.display = 'none';
    } else {
        document.getElementById('level-div').style.display = 'block';

        document.getElementById('loading-spinner').style.display = 'none';
    }
}

function idNotFound(){
    const levelDetails = document.getElementById("levelDetails");
    levelDetails.style.display = 'none';

    // sortear um número pra decidir qual gif de erro mostrar, por que não?
    const errorIdImg = document.getElementById("error-id-img");
    if(Math.random() < 0.5){
        errorIdImg.src = "https://media1.tenor.com/m/qBbREqnOqtkAAAAC/fatal-error-turn-it-off.gif";
    }

    const errorIdSection = document.getElementById("error-id-section");
    errorIdSection.style.display = 'block';
}