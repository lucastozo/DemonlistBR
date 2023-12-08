fetch('leveldata.json')
.then(response => response.json())
.then(data => 
    {
        data.sort(function(a, b) {
        return a.position_lvl - b.position_lvl;
    });

    var contentDiv = document.getElementById('ListContent');

    for (var i = 0; i < data.length; i++) 
    {
        var section = document.createElement('section');
        section.className = 'ListSection';

        var videoDiv = document.createElement('div');
        videoDiv.className = 'video';

        var videoId = data[i].video_lvl.split('https://youtu.be/')[1];
        var thumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/0.jpg';
        var videoUrl = 'https://youtu.be/' + videoId;
        
        videoDiv.innerHTML = '<a href="' + videoUrl + '" target="_blank"><img src="' + thumbnailUrl + '"style="width:320px; height:180px; object-fit:cover;"></a>';
        section.appendChild(videoDiv);

        var textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.innerHTML = '<h2>' + data[i].position_lvl + '. ' + data[i].name_lvl + '</h2>' +
                            '<p>Criador: ' + data[i].creator_lvl + '</p>' +
                            '<p>Verificado por: ' + data[i].verifier_lvl + '</p>';
                            if (data[i].publisher_lvl !== "") 
                            {
                                textDiv.innerHTML += '<p class="fw-lighter">Publicado por: ' + data[i].publisher_lvl + '</p>';
                            }
        section.appendChild(textDiv);

        contentDiv.appendChild(section);
    }
});


function NotAvailabeAlert() 
{
    alert('Função não disponível ainda.');
}
