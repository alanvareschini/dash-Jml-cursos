import { getRankingEventos, getRankingOrigens } from '../services/api.js';
import { state } from '../core/state.js';

let chartRankingOrigens = null;
let visaoAtualOrigem = 'lista';
let rankingOrigensAtual = [];
let tipoRankingAtual = 'eventos';

function obterContainersRankingOrigem() {
    return {
        lista: document.getElementById('listaRankingOrigens'),
        grafico: document.getElementById('rankingOrigens')
    };
}

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

function destruirGraficoOrigens() {
    if (!chartRankingOrigens) return;

    chartRankingOrigens.destroy();
    chartRankingOrigens = null;
}

function renderizarGraficoOrigens(ranking) {
    const { grafico } = obterContainersRankingOrigem();
    if (!grafico || !ranking.length) return;

    const ctx = grafico.getContext('2d');
    if (!ctx) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    destruirGraficoOrigens();
    chartRankingOrigens = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ranking.map(r => r.origem),
            datasets: [{
                label: 'Total de respostas',
                data: ranking.map(r => r.total_respostas),
                backgroundColor: 'rgba(157, 80, 187, 0.6)',
                borderRadius: 8,
                borderSkipped: false,
                barThickness: isMobile ? 22 : 28,
                maxBarThickness: isMobile ? 28 : 34
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: isMobile
                    ? { top: 6, right: 12, bottom: 0, left: 12 }
                    : { top: 10, right: 12, bottom: 0, left: 8 }
            },
            plugins: {
                legend: {
                    display: !isMobile,
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
                    offset: isMobile,
                    ticks: {
                        autoSkip: isMobile,
                        maxTicksLimit: isMobile ? 6 : undefined,
                        maxRotation: isMobile ? 20 : 0,
                        minRotation: 0,
                        padding: isMobile ? 8 : 6,
                        callback(value) {
                            const texto = String(this.getLabelForValue(value) ?? '');
                            if (!isMobile || texto.length <= 14) return texto;
                            return `${texto.slice(0, 14)}...`;
                        },
                        font: {
                            size: isMobile ? 12 : 15,
                            weight: isMobile ? '600' : '500'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grace: '8%',
                    ticks: {
                        precision: 0,
                        padding: isMobile ? 8 : 6,
                        font: {
                            size: isMobile ? 12 : 15,
                            weight: isMobile ? '600' : '500'
                        }
                    }
                }
            }
        }
    });
}

export function mudarVisao(tipoVisao, elemento) {
    const visaoNormalizada = tipoVisao === 'grafico' ? 'grafico' : 'lista';
    visaoAtualOrigem = visaoNormalizada;

    const { lista, grafico } = obterContainersRankingOrigem();
    if (!lista || !grafico) return;

    atualizarBotoesVisaoOrigem(visaoNormalizada);

    if (elemento) {
        const grupo = elemento.parentElement;
        grupo?.querySelectorAll('.switch-btn').forEach(btn => btn.classList.remove('active'));
        elemento.classList.add('active');
    }

    if (visaoNormalizada === 'lista') {
        mostrarElemento(lista);
        esconderElemento(grafico);
        destruirGraficoOrigens();
        return;
    }

    esconderElemento(lista);
    mostrarElemento(grafico);

    if (!chartRankingOrigens && rankingOrigensAtual.length > 0) {
        renderizarGraficoOrigens(rankingOrigensAtual);
    }

    setTimeout(() => {
        if (chartRankingOrigens) chartRankingOrigens.resize();
    }, 100);
}

export function mudarVisaoOrigem(tipoVisao, elemento) {
    mudarVisao(tipoVisao, elemento);
}

function resetarVisaoOrigem() {
    visaoAtualOrigem = 'lista';
    mudarVisao('lista');
}

function formatarTotalRespostas(valor) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return String(valor ?? 0);
    return new Intl.NumberFormat('pt-BR').format(numero);
}

function obterElementoResumoTotalRanking() {
    return document.getElementById('rankingTotalRespostas');
}

function calcularTotalRespostasRanking(ranking = []) {
    return ranking.reduce((acumulado, item) => {
        const valor = Number(item?.total_respostas ?? 0);
        return acumulado + (Number.isFinite(valor) ? valor : 0);
    }, 0);
}

function montarTextoResumoTotalRanking(tipo, ano, totalRespostas) {
    const periodo = ano ? `em ${ano}` : 'em todos os anos';
    const totalFormatado = formatarTotalRespostas(totalRespostas);

    if (tipo === 'origens') {
        return `Total de respostas por origem ${periodo}: ${totalFormatado}`;
    }

    return `Total de respostas ${periodo}: ${totalFormatado}`;
}

function atualizarResumoTotalRanking(tipo, ano, ranking) {
    const resumo = obterElementoResumoTotalRanking();
    if (!resumo) return;

    const totalRespostas = calcularTotalRespostasRanking(ranking);
    resumo.textContent = montarTextoResumoTotalRanking(tipo, ano, totalRespostas);
    resumo.classList.remove('hidden');
}

function ocultarResumoTotalRanking() {
    const resumo = obterElementoResumoTotalRanking();
    if (!resumo) return;
    resumo.classList.add('hidden');
}

function escaparAtributoHtml(valor = '') {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function montarNomeRanking(nome, limiteTooltip = 44) {
    const nomeTexto = String(nome ?? '').trim();
    const nomeEscapado = escaparAtributoHtml(nomeTexto);
    return `<span class="ranking-nome">${nomeEscapado}</span>`;
}

function montarBlocoTotalRespostas(valor, contexto = 'evento') {
    const valorFormatado = formatarTotalRespostas(valor);
    return `
        <span class="ranking-total">
            <span class="ranking-total-value">${valorFormatado}</span>
        </span>
    `;
}

function montarTextoTooltipCard(valor, contexto = 'evento') {
    const valorFormatado = formatarTotalRespostas(valor);
    return contexto === 'canal'
        ? `Respostas totais deste canal: ${valorFormatado}`
        : `Respostas totais deste evento: ${valorFormatado}`;
}

function ativarHoverEleganteRanking(container) {
    if (!container) return;

    container.querySelectorAll('.ranking-item').forEach((card) => {
        if (card.dataset.hoverEleganteAtivo === '1') return;

        card.addEventListener('pointermove', (event) => {
            const area = card.getBoundingClientRect();
            if (!area.width || !area.height) return;

            const x = ((event.clientX - area.left) / area.width) * 100;
            const y = ((event.clientY - area.top) / area.height) * 100;

            const xLimitado = Math.max(0, Math.min(100, x)).toFixed(2);
            const yLimitado = Math.max(0, Math.min(100, y)).toFixed(2);

            card.style.setProperty('--mx', `${xLimitado}%`);
            card.style.setProperty('--my', `${yLimitado}%`);

            // Smart tooltip positioning to avoid clipping/overlap near card edges.
            const espacoDireita = area.right - event.clientX;
            const espacoTopo = event.clientY - area.top;
            card.dataset.tooltipAlign = espacoDireita < 240 ? 'left' : 'right';
            card.dataset.tooltipPos = espacoTopo < 56 ? 'below' : 'above';
        });

        card.addEventListener('pointerleave', () => {
            card.style.removeProperty('--mx');
            card.style.removeProperty('--my');
            delete card.dataset.tooltipAlign;
            delete card.dataset.tooltipPos;
        });

        card.dataset.hoverEleganteAtivo = '1';
    });
}

function renderizarListaOrigens(ranking) {
    const { lista } = obterContainersRankingOrigem();
    if (!lista) return;

    lista.innerHTML = '';

    ranking.forEach((item, index) => {
        const medalha = `${index + 1}o`;

        const linha = document.createElement('div');
        linha.classList.add('ranking-item');
        if (index === 0) linha.classList.add('podio-ouro');
        if (index === 1) linha.classList.add('podio-prata');
        if (index === 2) linha.classList.add('podio-bronze');
        linha.style.animationDelay = `${Math.min(index * 0.04, 0.2)}s`;
        const tooltipCard = montarTextoTooltipCard(item.total_respostas, 'canal');
        linha.setAttribute('data-label', `Quantidade de respostas por origem: ${item.total_respostas}`);
        linha.setAttribute('aria-label', tooltipCard);

        linha.innerHTML = `
            <div class="ranking-linha">
                <span class="ranking-posicao">${medalha}</span>
                ${montarNomeRanking(item.origem, 36)}
            </div>
            ${montarBlocoTotalRespostas(item.total_respostas, 'canal')}
            <span class="ranking-card-tooltip" role="tooltip" aria-hidden="true">${escaparAtributoHtml(tooltipCard)}</span>
        `;

        lista.appendChild(linha);
    });

    ativarHoverEleganteRanking(lista);
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
        container.innerHTML = '<p class="placeholder">N\u00e3o foi poss\u00edvel carregar o ranking de eventos.</p>';
        ocultarResumoTotalRanking();
        return;
    }

    if (ano === '2023' || ano === '2024') {
        state.mostrarTodosRanking = true;
        if (botao) botao.style.display = 'none';
    } else if (!state.mostrarTodosRanking) {
        ranking = ranking.slice(0, 5);
    }

    atualizarResumoTotalRanking('eventos', ano, ranking);
    container.innerHTML = '';

    ranking.forEach((item, index) => {
        const medalha = `${index + 1}o`;

        const linha = document.createElement('div');
        linha.classList.add('ranking-item');
        if (index === 0) linha.classList.add('podio-ouro');
        if (index === 1) linha.classList.add('podio-prata');
        if (index === 2) linha.classList.add('podio-bronze');
        linha.style.animationDelay = `${Math.min(index * 0.04, 0.2)}s`;
        const tooltipCard = montarTextoTooltipCard(item.total_respostas, 'evento');
        linha.setAttribute('data-label', `Quantidade de respostas por evento: ${item.total_respostas}`);
        linha.setAttribute('aria-label', tooltipCard);

        linha.innerHTML = `
            <div class="ranking-linha">
                <span class="ranking-posicao">${medalha}</span>
                ${montarNomeRanking(item.nome_evento)}
            </div>
            ${montarBlocoTotalRespostas(item.total_respostas, 'evento')}
            <span class="ranking-card-tooltip" role="tooltip" aria-hidden="true">${escaparAtributoHtml(tooltipCard)}</span>
        `;

        container.appendChild(linha);
    });

    ativarHoverEleganteRanking(container);
}

export async function carregarRankingOrigens() {
    const ano = document.getElementById('filtroAnoRanking')?.value ?? '';
    const containerEventos = document.getElementById('rankingEventos');
    const { lista: containerLista, grafico: canvasOrigens } = obterContainersRankingOrigem();

    if (!containerLista || !canvasOrigens) return;

    esconderElemento(containerEventos);
    mostrarElemento(containerLista);
    esconderElemento(canvasOrigens);
    destruirGraficoOrigens();
    ocultarResumoTotalRanking();
    containerLista.innerHTML = '<div class="loader"></div>';

    let ranking = [];
    try {
        ranking = await getRankingOrigens(ano);
    } catch (error) {
        console.error('Erro ao carregar ranking de origens:', error);
        containerLista.innerHTML = '<p class="placeholder">N\u00e3o foi poss\u00edvel carregar o ranking de origens.</p>';
        ocultarResumoTotalRanking();
        mudarVisaoOrigem('lista');
        return;
    }

    if (!state.mostrarTodosRanking) {
        ranking = ranking.slice(0, 5);
    }

    atualizarResumoTotalRanking('origens', ano, ranking);

    rankingOrigensAtual = ranking;
    renderizarListaOrigens(ranking);
    mudarVisao(visaoAtualOrigem);
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
    destruirGraficoOrigens();
    ocultarResumoTotalRanking();
    if (optionsOrigem) optionsOrigem.style.display = 'none';

    if (tipo === 'eventos') {
        tipoRankingAtual = 'eventos';
        if (legenda) {
            legenda.innerText = 'Exibindo o ranking de participa\u00e7\u00e3o por cada curso/evento realizado.';
        }

        mostrarElemento(rankingEventos);

        if (btnToggle) btnToggle.style.display = 'inline-flex';
        carregarRankingEventos();
        return;
    }

    if (legenda) {
        legenda.innerHTML = "Baseado em: <strong>'COMO FICOU SABENDO DESTE EVENTO?'</strong>";
    }

    if (tipoRankingAtual !== 'origens') {
        resetarVisaoOrigem();
    }
    tipoRankingAtual = 'origens';

    if (optionsOrigem) optionsOrigem.style.display = 'inline-flex';
    if (btnToggle) btnToggle.style.display = 'inline-flex';

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



