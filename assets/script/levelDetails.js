document.addEventListener('DOMContentLoaded', (event) => {    
    let params = new URLSearchParams(window.location.search);
    let levelId = params.get('id');
    //chamada GDBrowser
    async function getLevelInfo(levelId) {
        try {
            HideContentLoading(0);

            const response = await fetch(`https://gdbrowser.com/api/level/${levelId}`);
            const data = await response.json();

            const responseLevelData = await fetch('/data/leveldata.json');
            const levelDataJson = await responseLevelData.json();
            const levelData = levelDataJson.Data.find(level => level.id_lvl == levelId)

            const combinedData = {...data, ...levelData};
            LoadLevelInfo(combinedData);

            HideContentLoading(1);
        } catch (error) {
            console.error(error);
        }
    }
    getLevelInfo(levelId);
});

function LoadLevelInfo(data){
    console.log(data);
    var levelName = document.getElementById("level-name");
    levelName.innerHTML = data.name;
    //se não existir publisher: criado por: creator, se existir: criado por: creator, publicado por: publisher
    var levelCreator = document.getElementById("level-creator");
    if(data.publisher_lvl){
        levelCreator.innerHTML = 'Criado por: ' + data.author + ', publicado por: ' + data.publisher_lvl;
    } else {
        levelCreator.innerHTML = 'Criado por: ' + data.author;
    }
    var levelDescription = document.getElementById("level-description");
    levelDescription.innerHTML = "\"" + data.description + "\"";
    levelDescription.style.fontStyle = 'italic';

    var videoIframe = document.getElementById("level-video-iframe");
    videoIframe.src = "https://www.youtube.com/embed/" + ExtractVideoId(data.video_lvl);

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

        document.getElementById('level-header').style.display = 'none';
        document.getElementById('level-video').style.display = 'none';
        document.getElementById('horizontal-line').style.display = 'none';
    } else {
        document.getElementById('level-header').style.display = 'block';
        document.getElementById('level-video').style.display = 'block';
        document.getElementById('horizontal-line').style.display = 'block';

        document.getElementById('loading-spinner').style.display = 'none';
    }
}