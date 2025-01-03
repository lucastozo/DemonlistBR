const LIST_SETTINGS_PATH = '/DemonlistBR/data/listsettings.json';

// EQUAÇÂO DE PONTUAÇÂO ABAIXO, IMPORTANTE
// latex pontuação geral: P = \sum_{i \in L} \frac{200}{e^{\frac{X}{20}}}
function getScore(position) {
    return 200 / Math.exp(position / 20);
}
function getScoreProgress(position, progress) {
    return getScore(position) * (progress / 100);
}

async function getMainListValue(value='mainList') {
    // leave param blank to get main list value or pass 'extendedList' to get extended list value
    
    const response = await fetch(LIST_SETTINGS_PATH);
    const data = await response.json();
    if (value === 'mainList') {
        return data.mainList;
    }
    return data.extendedList;
}

async function getExtendedListValue() {
    return getMainListValue('extendedList');
}

function ExtractVideoId(url) {
    var regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/\?.*v=))([\w-]{11})/;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : false;
}