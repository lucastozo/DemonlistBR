Promise.all
([
    fetch('leveldata.json').then(response => response.json()),
    fetch('playerdata.json').then(response => response.json())
]).then(([levelData, playerData]) => {
    levelData.Data.sort((a, b) => a.position_lvl - b.position_lvl);

    var contentDiv = document.getElementById('ListContent');

    for (var i = 0; i < levelData.Data.length; i++) {
        var section = document.createElement('section');
        section.className = 'ListSection';

        var videoDiv = document.createElement('div');
        videoDiv.className = 'video';

        // Adicione o código de extração do ID do vídeo aqui
        var videoUrl = levelData.Data[i].video_lvl;
        var videoId;

        if (videoUrl.includes('https://www.youtube.com/watch?v=')) 
        {
            videoId = videoUrl.split('https://www.youtube.com/watch?v=')[1];
        } 
        else if (videoUrl.includes('https://youtu.be/')) 
        {
            videoId = videoUrl.split('https://youtu.be/')[1];
        }

        var thumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/0.jpg';
        var videoUrl = 'https://youtu.be/' + videoId;

        videoDiv.innerHTML = '<a href="' + videoUrl + '" target="_blank"><img src="' + thumbnailUrl + '"style="width:320px; height:180px; object-fit:cover;"></a>';
        section.appendChild(videoDiv);

        var textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.innerHTML = '<h2>' + levelData.Data[i].position_lvl + '. ' + levelData.Data[i].name_lvl + '</h2>' +
                            '<p>Criador: ' + levelData.Data[i].creator_lvl + '</p>' +
                            '<p>Verificado por: ' + levelData.Data[i].verifier_lvl + '</p>';
        if ((levelData.Data[i].publisher_lvl !== "") && (levelData.Data[i].publisher_lvl !== null)) {
            textDiv.innerHTML += '<p class="fw-lighter">Publicado por: ' + levelData.Data[i].publisher_lvl + '</p>';
        }

        section.appendChild(textDiv);
        contentDiv.appendChild(section);

        //playerdata
        var playerRecords = playerData.Data.filter(record => record.level_name.toLowerCase() === levelData.Data[i].name_lvl.toLowerCase());
        playerRecords.sort((a, b) => b.progress - a.progress);
        if (playerRecords.length > 0) {
            var playerSection = document.createElement('section');
            playerSection.className = 'PlayerSection container text-center';
            playerSection.style.display = 'none';

            playerRecords.forEach(playerRecord => {
                var playerDiv = document.createElement('div');
                playerDiv.className = 'playerRecord';

                //adição do record com link de video e sem link de video
                if (playerRecord.video && playerRecord.video.trim() !== '') 
                {
                    playerDiv.innerHTML = '<p><a href="' + playerRecord.video + '" target="_blank">' + playerRecord.player_name + '</a> - ' + playerRecord.progress + '%</p>';
                } else 
                {
                    playerDiv.innerHTML = '<p>' + playerRecord.player_name + ' - ' + playerRecord.progress + '%</p>';
                }
                playerSection.appendChild(playerDiv);
            });

            contentDiv.appendChild(playerSection);

            //records btn
            var buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'relative';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';

            var button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = 'Records';
            button.style.position = 'absolute';
            button.style.right = '0';
            button.onclick = createToggleHandler(playerSection);


            buttonContainer.appendChild(button);

            section.appendChild(buttonContainer);
        }
    }
});

function createToggleHandler(playerSection) 
{
    return function() 
    {
        playerSection.style.display = playerSection.style.display === 'none' ? 'block' : 'none';
    };
}
