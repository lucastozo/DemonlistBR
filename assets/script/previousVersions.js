// time warp function to go back to previous versions of the website data

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