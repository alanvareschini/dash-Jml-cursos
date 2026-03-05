const API = "http://localhost:8080/backend/api/";
const cache = {};

export async function authCheck() {
    const res = await fetch(`${API}auth_check.php`, {
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error("Erro ao verificar autenticação");
    }

    return res.json();
}
export async function logout() {
    await fetch(`${API}logout.php`, { credentials: "include" });
    window.location.href = "login.html";
}

export async function getCursos(ano) {
    const response = await fetch(`${API}get_cursos.php?ano=${ano}`, {
    credentials: "include"
});
    if (!response.ok) throw new Error('Erro ao buscar cursos');
    return response.json();
}

export async function getDados(ano, curso) {
    const response = await fetch(`${API}get_dados.php?ano=${ano}&curso=${encodeURIComponent(curso)}`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error('Erro ao buscar dados do dashboard');
    return response.json();
}

export async function getRankingEventos(ano) {

    const chave = `rankingEventos_${ano}`;

    // verifica se já existe no cache
    if (cache[chave]) {
        return cache[chave];
    }

    const res = await fetch(
        `${API}get_ranking_eventos.php?ano=${ano}`,
        { credentials: "include" }
    );

    const data = await res.json();

    // salva no cache
    cache[chave] = data;

    return data;
}

export async function getRankingOrigens(ano) {

    const chave = `rankingOrigens_${ano}`;

    if (cache[chave]) {
        return cache[chave];
    }

    const res = await fetch(
        `${API}get_ranking_origens.php?ano=${ano}`,
        { credentials: "include" }
    );

    const data = await res.json();

    cache[chave] = data;

    return data;
}  