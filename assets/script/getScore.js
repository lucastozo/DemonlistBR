// EQUAÇÂO DE PONTUAÇÂO ABAIXO, IMPORTANTE
// latex pontuação geral: P = \sum_{i \in L} \frac{100}{\sqrt{p_i}}
function getScore(position) {
    return 100 / Math.sqrt(position);
}
function getScoreProgress(position, progress) {
    return getScore(position) * (progress / 100);
}