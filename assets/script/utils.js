const LIST_SETTINGS_PATH = '/DemonlistBR/data/listsettings.json';

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