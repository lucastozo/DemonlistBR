const REPO = "DemonlistBR", OWNER = "lucastozo"
function getData(version)
{
    return fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/data/leveldata.json?ref=${version}`, {
        headers: { 'Accept': 'application/vnd.github.VERSION.raw' }
    })
    .then(response => response.json())
    .then(levelData => {
        levelData.Data.sort((a, b) => a.position_lvl - b.position_lvl);
        return levelData;
    })
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
        return null;
    });
}

async function getCommitHash(untilDate) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/commits?until=${untilDate}`;
    try {
        const response = await fetch(url);
        const commits = await response.json();
        const commitHash = commits[0].sha;
        return commitHash;
    } catch (error) {
        console.error('Erro ao obter o hash do commit:', error);
        return null;
    }
}

function timeWarpPickerValues(hasDateParam = false){
    function getToday(){
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }
    const timeWarpPicker = document.getElementById('timeWarpPicker');
    if(timeWarpPicker){
        const today = getToday();
        const MIN_DATE = '2023-12-29';
        timeWarpPicker.setAttribute('min', MIN_DATE);
        timeWarpPicker.setAttribute('max', today);
        if(hasDateParam){
            timeWarpPicker.setAttribute('value', hasDateParam);
        } else {
            timeWarpPicker.setAttribute('value', today);
        }
    }
}

function changeTimeWarpTip(date){
    // time warp tip é, originalmente:
    // "Você está vendo a lista atual, para ver as versões anteriores, selecione uma data abaixo e clique no botão."
    // quando o usuário seleciona uma data, o texto muda para:
    // "Você está vendo a lista em [data]."
    const timeWarpTip = document.getElementById('timeWarp-tip');
    const dateParts = date.split('-');
    const dateFormatted = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    timeWarpTip.textContent = 'Você está vendo a lista em ' + dateFormatted.toLocaleDateString('pt-BR');
}