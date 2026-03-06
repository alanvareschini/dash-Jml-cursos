import { getRankingEventos, getRankingOrigens } from '../services/api.js';
import { state } from '../core/state.js';

let chartRankingOrigens = null;
let visaoAtualOrigem = 'lista';

function mostrarElemento(el) {
    if (!el) return;
    el.classList.remove('hidden');
}

function esconderElemento(el) {
    if (!el) return;
    el.classList.add('hidden');
}

function atualizarBotoesVisaoOrigem(tipoVisao) {
    const optionsOrigem = document.getElementById('viewOptionsOrigens');
    if (!optionsOrigem) return;

    optionsOrigem.querySelectorAll('.switch-btn').forEach(btn => {
        const ativo = btn.dataset.view === tipoVisao;
        btn.classList.toggle('active', ativo);
    });
}

export function mudarVisaoOrigem(tipoVisao, elemento) {
    visaoAtualOrigem = tipoVisao;

    const lista = document.getElementById('listaRankingOrigens');
    const grafico = document.getElementById('rankingOrigens');

    if (!lista || !grafico) return;

    if (elemento) {
        const grupo = elemento.parentElement;
        grupo?.querySelectorAll('.switch-btn').forEach(btn => btn.classList.remove('active'));
        elemento.classList.add('active');
    } else {
        atualizarBotoesVisaoOrigem(tipoVisao);
    }

    if (tipoVisao === 'lista') {
        mostrarElemento(lista);
        esconderElemento(grafico);
        return;
    }

    esconderElemento(lista);
    mostrarElemento(grafico);

    setTimeout(() => {
        if (chartRankingOrigens) chartRankingOrigens.resize();
    }, 100);
}

export function toggleRanking() {
    state.mostrarTodosRanking = !state.mostrarTodosRanking;
    const botao = document.getElementById('btnToggleRanking');

    if (botao) {
        botao.classList.toggle('active', state.mostrarTodosRanking);
        botao.innerText = state.mostrarTodosRanking
            ? 'Mostrar apenas Top 5'
            : 'Mostrar todos';
    }

    atualizarRanking();
}

export async function carregarRankingEventos() {
    const ano = document.getElementById('filtroAnoRanking')?.value ?? '';
    const botao = document.getElementById('btnToggleRanking');
    const container = document.getElementById('rankingEventos');

    if (!container) return;

    container.innerHTML = '<div class="loader"></div>';
    mostrarElemento(container);

    let ranking = [];
    try {
        ranking = await getRankingEventos(ano);
    } catch (error) {
        console.error('Erro ao carregar ranking de eventos:', error);
        container.innerHTML = '<p class="placeholder">Nao foi possivel carregar o ranking de eventos.</p>';
        return;
    }

    const totalEventosAno = ranking.length;

    if (ano === '2023' || ano === '2024') {
        state.mostrarTodosRanking = true;
        if (botao) botao.style.display = 'none';
    } else if (!state.mostrarTodosRanking) {
        ranking = ranking.slice(0, 5);
    }

    container.innerHTML = '';

    ranking.forEach((item, index) => {
        const medalha = `${index + 1}o`;

        const linha = document.createElement('div');
        linha.classList.add('ranking-item');
        if (index === 0) linha.classList.add('podio-ouro');
        if (index === 1) linha.classList.add('podio-prata');
        if (index === 2) linha.classList.add('podio-bronze');
        linha.setAttribute('data-label', `Quantidade de respostas por evento: ${item.total_respostas}`);

        linha.innerHTML = `
            <div class="ranking-linha">
                <span class="ranking-posicao">${medalha}</span>
                <span class="ranking-nome" title="${item.nome_evento}">${item.nome_evento}</span>
            </div>
            <span class="ranking-total">${item.total_respostas}</span>
        `;

        container.appendChild(linha);
    });

    const titulo = document.createElement('div');
    titulo.style.marginBottom = '10px';
    titulo.style.fontWeight = '600';
    titulo.textContent = `Total de eventos em ${ano || 'Todos os anos'}: ${totalEventosAno}`;

    container.prepend(titulo);
}

export async function carregarRankingOrigens() {
    const ano = document.getElementById('filtroAnoRanking')?.value ?? '';
    const containerEventos = document.getElementById('rankingEventos');
    const containerLista = document.getElementById('listaRankingOrigens');
    const canvasOrigens = document.getElementById('rankingOrigens');

    if (!containerLista || !canvasOrigens) return;

    esconderElemento(containerEventos);
    containerLista.innerHTML = '<div class="loader"></div>';

    let ranking = [];
    try {
        ranking = await getRankingOrigens(ano);
    } catch (error) {
        console.error('Erro ao carregar ranking de origens:', error);
        containerLista.innerHTML = '<p class="placeholder">Nao foi possivel carregar o ranking de origens.</p>';
        mudarVisaoOrigem('lista');
        return;
    }

    if (!state.mostrarTodosRanking) {
        ranking = ranking.slice(0, 5);
    }

    containerLista.innerHTML = '';

    ranking.forEach((item, index) => {
        const medalha = `${index + 1}o`;

        const linha = document.createElement('div');
        linha.classList.add('ranking-item');
        if (index === 0) linha.classList.add('podio-ouro');
        if (index === 1) linha.classList.add('podio-prata');
        if (index === 2) linha.classList.add('podio-bronze');
        linha.setAttribute('data-label', `Quantidade de respostas por origem: ${item.total_respostas}`);

        linha.innerHTML = `
            <div class="ranking-linha">
                <span class="ranking-posicao">${medalha}</span>
                <span class="ranking-nome">${item.origem}</span>
            </div>
            <span class="ranking-total">${item.total_respostas}</span>
        `;

        containerLista.appendChild(linha);
    });

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
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 17,
                            weight: '600'
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 15
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 15
                        }
                    }
                }
            }
        }
    });

    mudarVisaoOrigem(visaoAtualOrigem);
}

export function atualizarRanking() {
    const tipo = document.getElementById('filtroRanking')?.value ?? 'eventos';
    const legenda = document.getElementById('legendaFiltro');
    const btnToggle = document.getElementById('btnToggleRanking');
    const optionsOrigem = document.getElementById('viewOptionsOrigens');
    const rankingEventos = document.getElementById('rankingEventos');
    const listaOrigens = document.getElementById('listaRankingOrigens');
    const graficoOrigens = document.getElementById('rankingOrigens');

    esconderElemento(rankingEventos);
    esconderElemento(listaOrigens);
    esconderElemento(graficoOrigens);

    if (optionsOrigem) optionsOrigem.style.display = 'none';

    if (tipo === 'eventos') {
        if (legenda) {
            legenda.innerText = 'Exibindo o ranking de participacao por cada curso/evento realizado.';
        }

        mostrarElemento(rankingEventos);

        if (btnToggle) btnToggle.style.display = 'inline-block';
        carregarRankingEventos();
        return;
    }

    if (legenda) {
        legenda.innerHTML = "Baseado em: <strong>'COMO FICOU SABENDO DESTE EVENTO?'</strong>";
    }

    if (optionsOrigem) optionsOrigem.style.display = 'block';
    if (btnToggle) btnToggle.style.display = 'inline-block';

    carregarRankingOrigens();
}

export function carregarRanking() {
    atualizarRanking();
}

export function inicializarRanking() {
    const filtroAnoRank = document.getElementById('filtroAnoRanking');
    const filtroRank = document.getElementById('filtroRanking');

    if (filtroAnoRank) filtroAnoRank.addEventListener('change', atualizarRanking);
    if (filtroRank) filtroRank.addEventListener('change', atualizarRanking);

    const btnToggle = document.getElementById('btnToggleRanking');
    if (btnToggle) btnToggle.addEventListener('click', toggleRanking);

    const optionsOrigem = document.getElementById('viewOptionsOrigens');
    if (optionsOrigem) {
        optionsOrigem.querySelectorAll('.switch-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                mudarVisaoOrigem(btn.dataset.view, btn);
            });
        });
    }
}
