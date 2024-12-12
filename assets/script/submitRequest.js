async function sendLevelOrRecordRequest(dataMode) {
    // dataMode: 'level' or 'record'
    if (!await goodToGo(dataMode)) return;

    disableSubmitButton(true, dataMode);
    const object = await getObject(dataMode);

    try {
        const response = await fetch('https://listdatamanager.vercel.app/api/request-api', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                object: object,
                dataMode: dataMode
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        showAlertForFiveSeconds('success', dataMode, 'Requisição enviada com sucesso!');
        clearForm(dataMode);
    } catch (error) {
        console.error('Erro na requisição:', error);
        showAlertForFiveSeconds('danger', dataMode, 'Erro ao enviar a requisição. Tente novamente mais tarde.');
    }
    disableSubmitButton(false, dataMode);
}

async function getObject(dataMode)
{
    if (dataMode === 'level') {
        const name_lvl = document.getElementById('level-name').value;
        const id_lvl = document.getElementById('level-id').value;
        const creator_lvl = document.getElementById('level-creator').value;
        const verifier_lvl = document.getElementById('level-verifier').value;
        const video_lvl = document.getElementById('level-video').value;
        return {
            "name_lvl": name_lvl,
            "id_lvl": id_lvl,
            "creator_lvl": creator_lvl,
            "verifier_lvl": verifier_lvl,
            "video_lvl": video_lvl
        };
    } else if (dataMode === 'record') {
        const id_lvl = document.getElementById('record-id').value;
        const level = await getLevelById(id_lvl);
        const name_lvl = level.name_lvl;
        const player_name = document.getElementById('record-player').value;
        const progress = document.getElementById('record-progress').value;
        const video = document.getElementById('record-video').value;
        return {
            "id_lvl": id_lvl,
            "name_lvl": name_lvl,
            "player_name": player_name,
            "progress": progress,
            "video": video
        };
    }
    return {};
}

async function goodToGo(dataMode)
{
    function isAllFieldsFilled(dataMode)
    {
        if (dataMode === 'level') {
            const name_lvl = document.getElementById('level-name').value;
            const id_lvl = document.getElementById('level-id').value;
            const creator_lvl = document.getElementById('level-creator').value;
            const verifier_lvl = document.getElementById('level-verifier').value;
            const video_lvl = document.getElementById('level-video').value;
            return name_lvl && id_lvl && creator_lvl && verifier_lvl && video_lvl;
        } else if (dataMode === 'record') {
            const id_lvl = document.getElementById('record-id').value;
            const player_name = document.getElementById('record-player').value;
            const progress = document.getElementById('record-progress').value;
            const video = document.getElementById('record-video').value;
            return id_lvl && player_name && progress && video;
        }
        return false;
    }
    // check 1: all fields are filled
    if (!isAllFieldsFilled(dataMode)) {
        showAlertForFiveSeconds('danger', dataMode, 'Preencha todos os campos!');
        return false;
    }

    let levelGotByID;
    if (dataMode === 'record') {
        const id_lvl = document.getElementById('record-id').value;
        levelGotByID = await getLevelById(id_lvl);
    }

    // check 2: level id exists in DLBR
    if (dataMode === 'record' && !levelGotByID) {
        showAlertForFiveSeconds('danger', dataMode, 'O level informado não existe na Demonlist BR');
        return false;
    }

    // check 3: level is beyond extended list
    if (dataMode === 'record') {
        const response = await fetch('/DemonlistBR/data/listsettings.json');
        const data = await response.json();
        const extendedList = data.ExtendedList;
        if (levelGotByID.id_lvl > extendedList) {
            showAlertForFiveSeconds('danger', dataMode, 'O level informado está além da extended list');
            return false;
        }
    }

    // check 4: progress is inside list%
    if (dataMode === 'record') {
        const progress = parseInt(document.getElementById('record-progress').value);
        if (progress < 0 || progress < levelGotByID.listpct_lvl) {
            showAlertForFiveSeconds('danger', dataMode, 'O progresso informado está fora do list%');
            return false;
        } else if (progress % 1 !== 0) {
            showAlertForFiveSeconds('danger', dataMode, 'O progresso informado deve ser um número inteiro');
            return false;
        }
    }
    return true;
}

async function getLevelById(id) {
    const response = await fetch('/DemonlistBR/data/leveldata.json');
    const data = await response.json();
    const levels = data.Data;
    const level = levels.find(l => l.id_lvl === id);
    console.log(level);
    return level;
}

function showAlertForFiveSeconds(alertType, levelOrRecord, message)
{
    let alert;
    switch(alertType)
    {
        case 'success':
            levelOrRecord === 'level' ? alert = document.getElementById('level-alert-success') : alert = document.getElementById('record-alert-success');
            break;
        case 'danger':
            levelOrRecord === 'level' ? alert = document.getElementById('level-alert-danger') : alert = document.getElementById('record-alert-danger');
            break;
    }
    alert.innerHTML = message;
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

function disableSubmitButton(disable, dataMode)
{
    let submitButton;
    switch(dataMode)
    {
        case 'level':
            submitButton = document.getElementById('level-submit-button');
            break;
        case 'record':
            submitButton = document.getElementById('record-submit-button');
            break;
    }
    submitButton.disabled = disable;
    if (disable) submitButton.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i> Enviando...";
    else submitButton.innerHTML = "Enviar";
}

function clearForm(dataMode)
{   switch(dataMode)
    {
        case 'level':
            document.getElementById('level-name').value = '';
            document.getElementById('level-id').value = '';
            document.getElementById('level-creator').value = '';
            document.getElementById('level-verifier').value = '';
            document.getElementById('level-video').value = '';
            break;
        case 'record':
            document.getElementById('record-id').value = '';
            document.getElementById('record-player').value = '';
            document.getElementById('record-progress').value = '';
            document.getElementById('record-video').value = '';
            break;
    }
}