document.addEventListener('DOMContentLoaded', (event) => {    
    let params = new URLSearchParams(window.location.search);
    let levelId = params.get('id');
    //chamada GDBrowser
    getLevelInfo(levelId);
    async function getLevelInfo(levelId) {
        try {
            HideContentLoading(0); //flag 0 = loading, flag 1 = content

            const response = await fetch(`https://gdbrowser.com/api/level/${levelId}`);
            const data = await response.json();

            const responseLevelData = await fetch('/data/leveldata.json');
            const levelDataJson = await responseLevelData.json();
            const levelData = levelDataJson.Data.find(level => level.id_lvl == levelId)

            const combinedData = {...data, ...levelData};
            LoadLevelInfo(combinedData);

            HideContentLoading(1);
            getPlayerData(data, levelData);
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
    console.log(data);
    var levelName = document.getElementById("level-name");
    levelName.innerHTML = data.name;
    //se não existir publisher: criado por: creator, se existir: criado por: creator, publicado por: publisher
    var levelCreator = document.getElementById("level-creator");
    levelCreator.innerHTML = 'Criado por: ' + data.author;
    if(data.publisher_lvl){
        levelCreator.innerHTML = levelCreator.innerHTML + ', publicado por: ' + data.publisher_lvl;
    }
    var levelDescription = document.getElementById("level-description");
    levelDescription.innerHTML = "\"" + data.description + "\"";

    var videoIframe = document.getElementById("level-video-iframe");
    videoIframe.src = "https://www.youtube.com/embed/" + ExtractVideoId(data.video_lvl);

    //level-info div
    var id = document.getElementById("level-id");
    id.innerHTML = data.id;
    var difficulty = document.getElementById("level-difficulty");
    difficulty.innerHTML = data.difficulty;
    if(data.demonList){
        var demonlist = document.getElementById("level-demonlist");
        demonlist.innerHTML = "<a href='https://pointercrate.com/demonlist/" + data.demonList + "' target='_blank'>#" + data.demonList + "</a>";
        document.getElementById("level-demonlist-div").style.display = 'block';
    }
    var song = document.getElementById("level-song");
    var songAdd;
    if(data.songID && typeof data.songID === 'string' && data.songID.includes('Level')){
        songAdd = "<p>"+ data.songName + "</p>";
    } else {
        songAdd = "<a href='https://www.newgrounds.com/audio/listen/" + data.songID + "' target='_blank'>" + data.songAuthor + ' - ' + data.songName + "</a>";
    }
    song.innerHTML = songAdd;
}

function LoadProgress(data){
    var scoreCompletion = document.getElementById("score-completion");
    scoreCompletion.innerHTML = getScore(data.position_lvl).toFixed(2);
    var scoreListpctTitle = document.getElementById("score-listpct-title");
    scoreListpctTitle.innerHTML = "Pontos em Ranking (" + data.listpct_lvl + "%)";
    var scoreListpct = document.getElementById("score-listpct");
    scoreListpct.innerHTML = getScoreProgress(data.position_lvl, data.listpct_lvl).toFixed(2);
    //buscar progressos que possuem o mesmo nome do level data.Name
    var playerRecords = data.Data.filter(record => record.level_name.toLowerCase() === data.name.toLowerCase());
    playerRecords.sort((a, b) => b.progress - a.progress);
    //adicionar progressos na tabela
    var tableBody = document.getElementById('table-body');
    playerRecords.forEach(record => {
        if(record.progress >= data.listpct_lvl){
            var row = document.createElement('tr');
            var playerNameCell = document.createElement('td');
            playerNameCell.innerHTML = record.player_name;
            row.appendChild(playerNameCell);
            var progressCell = document.createElement('td');
            progressCell.innerHTML = "<a href='" + record.video + "' target='_blank'>" + record.progress + "%</a>";
            row.appendChild(progressCell);
            tableBody.appendChild(row);
        }
    });
}

function ExtractVideoId(videoUrl){
    var videoId;
    if(videoUrl == null || videoUrl == undefined || videoUrl == ''){
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
    if(flag == 0){
        document.getElementById('loading-spinner').style.display = 'block';
        document.getElementById('loading-spinner').style.margin = 'auto';

        document.getElementById('level-div').style.display = 'none';
    } else {
        document.getElementById('level-div').style.display = 'block';

        document.getElementById('loading-spinner').style.display = 'none';
    }
}