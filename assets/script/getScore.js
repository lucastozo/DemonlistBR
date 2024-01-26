// EQUAÇÂO DE PONTUAÇÂO ABAIXO, IMPORTANTE
// latex pontuação geral: P = \sum_{i \in L} \frac{100}{\sqrt{p_i}}
function getScore(position) {
    var score = 100 / Math.sqrt(position);
    return score;
}
function getScoreProgress(position, progress) {
    var score = getScore(position) * (progress / 100);
    return score;
}