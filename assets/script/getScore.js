// EQUAÇÂO DE PONTUAÇÂO ABAIXO, IMPORTANTE
// latex pontuação geral: P = \sum_{i \in L} \frac{200}{e^{\frac{X}{20}}}
function getScore(position) {
    return 200 / Math.exp(position / 20);
}
function getScoreProgress(position, progress) {
    return getScore(position) * (progress / 100);
}