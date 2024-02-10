const mainListMaxPosition = 100;

fetch('/data/leveldata.json')
.then(response => response.json())
.then(levelData => {
    levelData.Data.sort((a, b) => a.position_lvl - b.position_lvl);

    const contentDiv = document.getElementById('ListContent');
    levelData.Data.forEach(level => {
        const section = document.createElement('section');
        section.className = 'ListSection';

        const videoDiv = document.createElement('div');
        videoDiv.className = 'video';
        const videoId = ExtractVideoId(level.video_lvl);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        const videoUrl = `https://youtu.be/${videoId}`;
        videoDiv.innerHTML = `<a href="${videoUrl}" target="_blank"><img src="${thumbnailUrl}" style="width:320px; height:180px; object-fit:cover;" alt="Video Thumbnail"></a>`;
        section.appendChild(videoDiv);

        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.id = 'textDiv';

        const levelLink = document.createElement('a');
        levelLink.href = `/pages/leveldetails.html?id=${level.id_lvl}`;
        levelLink.id = 'levelLink';
        const levelName = document.createElement('h2');
        levelName.textContent = `${level.position_lvl}. ${level.name_lvl}`;
        levelName.id = 'levelName';
        levelLink.appendChild(levelName);
        textDiv.appendChild(levelLink);
        const creatorParagraph = document.createElement('p');
        creatorParagraph.textContent = `Criador: ${level.creator_lvl}`;
        creatorParagraph.id = 'creatorParagraph';
        textDiv.appendChild(creatorParagraph);
        const verifierParagraph = document.createElement('p');
        verifierParagraph.textContent = `Verificador: ${level.verifier_lvl}`;
        verifierParagraph.id = 'verifierParagraph';
        textDiv.appendChild(verifierParagraph);
        if (level.publisher_lvl) {
            const publisherParagraph = document.createElement('p');
            publisherParagraph.className = 'fw-lighter';
            publisherParagraph.textContent = `Publicado por: ${level.publisher_lvl}`;
            publisherParagraph.id = 'publisherParagraph';
            textDiv.appendChild(publisherParagraph);
        }

        const path = window.location.pathname;
        const page = path.split("/").pop();
        if(page === "legacylist.html") {
            if(level.position_lvl > mainListMaxPosition){
                // esconder error
                var errorIdSection = document.getElementById("error-id-section");
                errorIdSection.style.display = 'none';

                section.appendChild(textDiv);
                contentDiv.appendChild(section);
            }
        } else if(level.position_lvl <= mainListMaxPosition){
            section.appendChild(textDiv);
            contentDiv.appendChild(section);
        }
    });
});

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