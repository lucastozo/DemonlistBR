export const listMaxPosition = 100;
let legacyListHasLevels = false;
let timeWarp = false;

if(window.location.pathname === "/" || window.location.pathname === "/legacylist.html"){
    passLevelData();
}

function passLevelData(){
    if(!timeWarp){
        fetch('/data/leveldata.json')
        .then(response => response.json())
        .then(levelData => {
            levelData.Data.sort((a, b) => a.position_lvl - b.position_lvl);
            buildList(levelData);
        })
    } else {
        let date = "2024-12-30";
        let version;
        getCommitHash(date).then(hash => {
            version = hash;
            getData(version).then(data => {
                buildList(data);
            });
        });
    }
}

function buildList(levelData){
    const path = window.location.pathname;
    const page = path.split("/").pop();

    const contentDiv = document.getElementById('ListContent');
    levelData.Data.forEach(level => {
        if(page === "legacylist.html" && level.position_lvl <= listMaxPosition) return;
        if(path === "/" && level.position_lvl > listMaxPosition) return;

        function isLevelInList(level) {
            return level.position_lvl <= listMaxPosition;
        }
        const levelIsInList = isLevelInList(level);
        
        const section = document.createElement('section');
        section.className = 'ListSection';
        levelIsInList ? null : section.classList.add('text-center');

        if(levelIsInList){
            const videoDiv = document.createElement('div');
            videoDiv.className = 'video';
            const videoId = ExtractVideoId(level.video_lvl);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            const videoUrl = `https://youtu.be/${videoId}`;
            const thumbWidth = 320/1.3; const thumbHeight = 180/1.3;
            videoDiv.innerHTML = `<a href="${videoUrl}" target="_blank"><img src="${thumbnailUrl}" style="width:${thumbWidth}px; height:${thumbHeight}px; object-fit:cover;" alt="Video Thumbnail"></a>`;
            section.appendChild(videoDiv);
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        levelIsInList ? textDiv.classList.add('textLevelIsInList') : null;
        textDiv.id = 'textDiv';

        const levelLink = document.createElement('a');
        levelLink.href = `/pages/leveldetails.html?id=${level.id_lvl}`;
        levelLink.id = 'levelLink';
        const levelName = document.createElement('h2');

        // adicionar posição do level no texto apenas se não for da legacylist
        if(level.position_lvl <= listMaxPosition) {
            levelName.textContent = `${level.position_lvl}. ${level.name_lvl}`;
        } else {
            levelName.textContent = level.name_lvl;
        }
        levelName.id = 'levelName';
        levelLink.appendChild(levelName);

        textDiv.appendChild(levelLink);
        
        const creatorParagraph = document.createElement('p');
        creatorParagraph.textContent = `Criador: ${level.creator_lvl}`;
        creatorParagraph.id = 'creatorParagraph';
        textDiv.appendChild(creatorParagraph);

        if(page === "legacylist.html" && level.position_lvl > listMaxPosition){ legacyListHasLevels = true; }
        
        section.appendChild(textDiv);
        contentDiv.appendChild(section);
    });
    if(page === "legacylist.html" && !legacyListHasLevels){
        const errorSection = document.getElementById('error-id-section');
        errorSection.style.display = 'block';
    }
}

function ExtractVideoId(videoUrl){
    var videoId;
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

// Botão voltar ao topo
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.querySelector("#btn-back-to-top");

    window.onscroll = () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };

    backToTopButton.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
});