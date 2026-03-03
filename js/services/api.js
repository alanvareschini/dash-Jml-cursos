
export async function getCursos(ano) {
    const response = await fetch(`./php/get_cursos.php?ano=${ano}`);
    if (!response.ok) throw new Error('Erro ao buscar cursos');
    return response.json();
}

export async function getDados(ano, curso) {
    const response = await fetch(`./php/get_dados.php?ano=${ano}&curso=${encodeURIComponent(curso)}`);
    if (!response.ok) throw new Error('Erro ao buscar dados do dashboard');
    return response.json();
}

export async function getRankingEventos(ano) {
    let url = './php/get_ranking_eventos.php';
    if (ano) url += `?ano=${ano}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar ranking de eventos');
    return response.json();
}

export async function getRankingOrigens(ano) {
    let url = './php/get_ranking_origens.php';
    if (ano) url += `?ano=${ano}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar ranking de origens');
    return response.json();
}