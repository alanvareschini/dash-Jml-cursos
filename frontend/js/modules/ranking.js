import { getRankingEventos, getRankingOrigens } from '../services/api.js';
import { state } from '../core/state.js';

let chartRankingOrigens = null;
let visaoAtualOrigem = 'lista';

export function mudarVisaoOrigem(tipoVisao, elemento) {
    visaoAtualOrigem = tipoVisao;

    const lista = document.getElementById('listaRankingOrigens');
    const grafico = document.getElementById('rankingOrigens');

    // 1. Gerenciar a classe 'active' (Sombra)
    // Se a função recebeu o 'elemento' (clique manual)
    if (elemento) {
        const grupo = elemento.parentElement;
        grupo.querySelectorAll('.switch-btn').forEach(btn => btn.classList.remove('active'));
        elemento.classList.add('active');
    }

    // 2. Alternar Visibilidade
    if (tipoVisao === 'lista') {
        lista.classList.remove('hidden');
        grafico.classList.add('hidden');
    } else {
        lista.classList.add('hidden');
        grafico.classList.remove('hidden');

        setTimeout(() => {
            if (chartRankingOrigens) chartRankingOrigens.resize();
        }, 100);
    }
}

export function toggleRanking() {
    state.mostrarTodosRanking = !state.mostrarTodosRanking;
    const botao = document.getElementById('btnToggleRanking');

    if (botao) {
        // Adiciona ou remove a sombra branca/cinza
        botao.classList.toggle('active');

        botao.innerText = state.mostrarTodosRanking
            ? '🏆 Mostrar apenas Top 5'
            : '🏆 Mostrar todos';
    }
    atualizarRanking();
}

// ==========================
// RANKING EVENTOS
// ==========================

export async function carregarRankingEventos() {
    const ano = document.getElementById('filtroAnoRanking').value;
    const botao = document.getElementById('btnToggleRanking');

    let url = './php/get_ranking_eventos.php';
    if (ano) {
        url += `?ano=${ano}`;
    }

    let ranking = await getRankingEventos(ano);

    renderTop3(ranking, "eventos");
    renderListaRanking(ranking, "eventos");

    const totalEventosAno = ranking.length;

    // Se for 2023 ou 2024, mostrar todos e esconder botão
    if (ano === '2023' || ano === '2024') {
        state.mostrarTodosRanking = true;
        if (botao) botao.style.display = 'none';
    } else {
        if (!state.mostrarTodosRanking) {
            ranking = ranking.slice(0, 5);
        }
    }

    const container = document.getElementById('rankingEventos');
    container.innerHTML = '';

    ranking.forEach((item, index) => {
        let medalha = '';
        if (index === 0) medalha = "🥇";
        else if (index === 1) medalha = "🥈";
        else if (index === 2) medalha = "🥉";
        else medalha = `${index + 1}º`;

        // 1. PRIMEIRO: Criar o elemento
        const linha = document.createElement('div');

        // 2. DEPOIS: Adicionar classe e atributos
        linha.classList.add('ranking-item');
        linha.setAttribute('data-label', `Quantidade de respostas por evento : ${item.total_respostas}`);

        // 3. POR ÚLTIMO: Definir o HTML interno
        linha.innerHTML = `
            <div class="ranking-linha">
                <span class="ranking-posicao">${medalha}</span>
                <span class="ranking-nome" title="${item.nome_evento}">${item.nome_evento}</span>
            </div>
            <span class="ranking-total">${item.total_respostas}</span>
        `;

        container.appendChild(linha);
    });

    // Mostrar total de eventos do ano
    const titulo = document.createElement('div');
    titulo.style.marginBottom = '10px';
    titulo.style.fontWeight = '600';
    titulo.innerHTML = `Total de eventos em ${ano || 'Todos os anos'}: ${totalEventosAno}`;

    container.prepend(titulo);
}
// ==========================
// RANKING ORIGENS (CANAIS DE ENTRADA)
// ==========================

export async function carregarRankingOrigens() {
    const ano = document.getElementById('filtroAnoRanking').value;
    let url = './php/get_ranking_origens.php';
    if (ano) url += `?ano=${ano}`;

    let ranking = await getRankingOrigens(ano);

    renderTop3(ranking, "origens");
    renderListaRanking(ranking, "origens");

    if (!state.mostrarTodosRanking) {
        ranking = ranking.slice(0, 5);
    }

    // 1. Atualiza a LISTA
    const containerLista = document.getElementById('listaRankingOrigens');
    if (containerLista) {
        containerLista.innerHTML = '';
        ranking.forEach((item, index) => {
            let medalha = (index === 0) ? '🥇' : (index === 1) ? '🥈' : (index === 2) ? '🥉' : `${index + 1}º`;

            const linha = document.createElement('div');
            linha.classList.add('ranking-item');

            // ALTERE PARA ESTA LINHA:
            linha.setAttribute('data-label', `Quantidade de respostas por origem : ${item.total_respostas}`);

            linha.innerHTML = `
    <div class="ranking-info">
        <span class="ranking-posicao">${medalha}</span>
        <span class="ranking-nome">${medalha} ${item.origem}</span>
    </div>
    <span class="ranking-total">${item.total_respostas}</span>
`;
            containerLista.appendChild(linha);
        });
    }

    // 2. Atualiza o GRÁFICO
    const canvasOrigens = document.getElementById('rankingOrigens');
    if (canvasOrigens) {
        const ctx = canvasOrigens.getContext('2d');
        if (chartRankingOrigens) chartRankingOrigens.destroy();
        chartRankingOrigens = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ranking.map(r => r.origem),
                datasets: [{
                    label: 'Total de respostas',
                    data: ranking.map(r => r.total_respostas),
                    backgroundColor: 'rgba(157, 80, 187, 0.6)'
                }]
            },
            options: { responsive: true }
        });
    }

    // 3. (CORREÇÃO) Força a exibição correta (Lista ou Gráfico) após carregar os dados
    mudarVisaoOrigem(visaoAtualOrigem);
}

// ==========================
// ATUALIZAÇÃO DA INTERFACE
// ==========================

export function atualizarRanking() {

    document.getElementById("rankingSkeleton")?.classList.remove("hidden");
    document.getElementById("rankingTop3")?.classList.add("hidden");
    document.getElementById("rankingLista")?.classList.add("hidden");
    document.getElementById("rankingGrafico")?.classList.add("hidden");

    const tipo = document.getElementById('filtroRanking').value;
    const legenda = document.getElementById('legendaFiltro');
    const btnToggle = document.getElementById('btnToggleRanking');
    const optionsOrigem = document.getElementById('viewOptionsOrigens');

    // Esconde APENAS o container de eventos inicialmente
    document.getElementById('rankingEventos').style.display = 'none';
    if (optionsOrigem) optionsOrigem.style.display = 'none';

    // (CORREÇÃO) Não escondemos rankingOrigens nem listaRankingOrigens aqui.
    // Deixamos a função carregarRankingOrigens e mudarVisaoOrigem cuidarem disso.

    if (tipo === 'eventos') {
        if (legenda) legenda.innerText = "Exibindo o ranking de participação por cada curso/evento realizado.";

        // Mostra eventos e esconde origens
        document.getElementById('rankingEventos').style.display = 'block';
        document.getElementById('rankingOrigens')?.classList.add('hidden');
        document.getElementById('listaRankingOrigens')?.classList.add('hidden');

        if (btnToggle) btnToggle.style.display = 'inline-block';
        carregarRankingEventos();
    } else {
        // Modo Canais de Entrada
        if (legenda) legenda.innerHTML = "Baseado em: <strong>'COMO FICOU SABENDO DESTE EVENTO?'</strong>";
        if (optionsOrigem) optionsOrigem.style.display = 'block';
        if (btnToggle) btnToggle.style.display = 'inline-block';

        // Carrega os dados (que irá chamar mudarVisaoOrigem no final)
        carregarRankingOrigens();
    }
    setTimeout(() => {

        document.getElementById("rankingSkeleton")?.classList.add("hidden");
        document.getElementById("rankingTop3")?.classList.remove("hidden");
        document.getElementById("rankingLista")?.classList.remove("hidden");

    }, 300);
    
}

export function renderTop3(dados, tipo) {

    const container = document.getElementById("rankingTop3");

    container.innerHTML = "";

    const top3 = dados.slice(0, 3);

    top3.forEach((item, index) => {

        const nome = tipo === "eventos"
            ? item.nome_evento
            : item.origem;

        const card = document.createElement("div");

        card.className = "top3-card";

        card.innerHTML = `
            <span class="posicao">#${index + 1}</span>
            <h3>${nome}</h3>
            <p>${item.total_respostas}</p>
        `;

        container.appendChild(card);

    });

}


export function renderListaRanking(dados, tipo) {

    const lista = document.getElementById("rankingLista");

    lista.innerHTML = "";

    dados.forEach((item, index) => {

        const nome = tipo === "eventos"
            ? item.nome_evento
            : item.origem;

        const div = document.createElement("div");

        div.className = "ranking-item";

        div.innerHTML = `
            <span>${index + 1}. ${nome}</span>
            <strong>${item.total_respostas}</strong>
        `;

        lista.appendChild(div);

    });

}

