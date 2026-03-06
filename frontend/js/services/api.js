import { resolveApiBase } from './apiBase.js';

const API = resolveApiBase();
const cache = {};

async function requestJson(path) {
    const res = await fetch(`${API}${path}`, {
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error(`Erro na requisicao: ${path} (${res.status})`);
    }

    return res.json();
}

export async function authCheck() {
    return requestJson("auth_check.php");
}

export async function logout() {
    await fetch(`${API}logout.php`, { credentials: "include" });
    window.location.href = "login.html";
}

export async function getCursos(ano) {
    return requestJson(`get_cursos.php?ano=${ano}`);
}

export async function getDados(ano, curso) {
    return requestJson(`get_dados.php?ano=${ano}&curso=${encodeURIComponent(curso)}`);
}

export async function getRankingEventos(ano) {
    const chave = `rankingEventos_${ano}`;

    if (cache[chave]) {
        return cache[chave];
    }

    const data = await requestJson(`get_ranking_eventos.php?ano=${ano}`);
    cache[chave] = data;

    return data;
}

export async function getRankingOrigens(ano) {
    const chave = `rankingOrigens_${ano}`;

    if (cache[chave]) {
        return cache[chave];
    }

    const data = await requestJson(`get_ranking_origens.php?ano=${ano}`);
    cache[chave] = data;

    return data;
}
