fetch('leveldata.json')
.then(response => response.json())
.then(data => {
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
        videoDiv.innerHTML = '<iframe width="320" height="180" src="' + data[i].video_url + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        section.appendChild(videoDiv);

        var textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.innerHTML = '<h2>' + data[i].position_lvl + '. ' + data[i].name_lvl + '</h2>' +
                            '<p>Criador: ' + data[i].creator_lvl + '</p>';
        section.appendChild(textDiv);

        contentDiv.appendChild(section);
    }
});


function NotAvailabeAlert() 
{
    alert('Função não disponível ainda.');
}
