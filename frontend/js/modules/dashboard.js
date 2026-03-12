import { getCursos, getDados } from '../services/api.js';

let tipoGrafico = 'linhasMultiplas';

function normalizarTexto(valor = '') {
    return String(valor)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function classificarTipoEvento(tipoEvento = '') {
    const tipoNormalizado = normalizarTexto(tipoEvento);
    const temPresencial = /\bpresencial\b/.test(tipoNormalizado);
    const temOnline = /\bonline\b|\bon-line\b/.test(tipoNormalizado);

    if (tipoNormalizado.includes('misto') || tipoNormalizado.includes('hibrido') || (temPresencial && temOnline)) {
        return 'misto';
    }

    if (temPresencial) {
        return 'presencial';
    }

    if (temOnline) {
        return 'online';
    }

    return 'online';
}

function obterCorTipo(tipoEvento = '') {
    const tipoClassificado = classificarTipoEvento(tipoEvento);

    if (tipoClassificado === 'misto') {
        return { cor: '#22c55e', label: 'Misto' };
    }

    if (tipoClassificado === 'presencial') {
        return { cor: '#dc3545', label: 'Presencial' };
    }

    if (tipoClassificado === 'online') {
        return { cor: '#007bff', label: 'Online' };
    }

    return { cor: '#007bff', label: 'Online' };
}

function limparNomeEvento(nomeOriginal = '', tipoEvento = '') {
    const tipoClassificado = classificarTipoEvento(tipoEvento);

    if (tipoClassificado === 'misto') {
        return nomeOriginal
            .replace(/\s*-\s*(Misto|H[\u00edi]brido|Presencial\s*e\s*Online)\b/i, '')
            .trim();
    }

    if (tipoClassificado === 'presencial') {
        return nomeOriginal.replace(/\s*-\s*Presencial\b/i, '').trim();
    }

    if (tipoClassificado === 'online') {
        return nomeOriginal.replace(/\s*-\s*(On-?line|Online)\b/i, '').trim();
    }

    return nomeOriginal;
}

function limparSufixosTipoNome(nome = '') {
    return String(nome)
        .replace(/\s*-\s*(Presencial|On-?line|Online|Misto|H[\u00edi]brido|Presencial\s*e\s*Online)\b/i, '')
        .trim();
}

function obterDadosCurso(curso) {
    if (typeof curso === 'string') {
        return { nomeEvento: curso, tiposEvento: '' };
    }

    return {
        nomeEvento: String(curso?.nome_evento ?? ''),
        tiposEvento: String(curso?.tipos_evento ?? curso?.tipo_evento ?? '')
    };
}

function montarTituloCursoFiltro(nomeEvento = '', tiposEvento = '') {
    const nomeLimpo = limparSufixosTipoNome(nomeEvento);
    const tipoClassificado = classificarTipoEvento(tiposEvento || nomeEvento);

    if (tipoClassificado === 'misto') {
        return `${nomeLimpo} (Misto)`;
    }

    if (tipoClassificado === 'online') {
        return `${nomeLimpo} (Online)`;
    }

    return nomeLimpo;
}

function ordenarOrigens(origens) {
    return [...origens].sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);

        if (Number.isFinite(na) && Number.isFinite(nb)) {
            return na - nb;
        }

        return String(a).localeCompare(String(b), 'pt-BR');
    });
}

export async function carregarCursos() {
    const filtroAno = document.getElementById('filtroAno');
    const select = document.getElementById('filtroCurso');

    if (!filtroAno || !select) return;

    const ano = filtroAno.value;
    select.innerHTML = '<option value="">Selecione o curso</option>';

    let cursos = [];
    try {
        cursos = await getCursos(ano);
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        select.innerHTML = '<option value="">Erro ao carregar cursos</option>';
        return;
    }

    cursos.forEach(curso => {
        const { nomeEvento, tiposEvento } = obterDadosCurso(curso);
        if (!nomeEvento) return;

        const option = document.createElement('option');
        option.value = nomeEvento;
        option.textContent = montarTituloCursoFiltro(nomeEvento, tiposEvento);
        select.appendChild(option);
    });

    if (cursos.length > 0) {
        const { nomeEvento: primeiroCurso } = obterDadosCurso(cursos[0]);
        select.value = primeiroCurso || '';
        await carregarDashboard();
    }
}

export async function carregarDashboard() {
    const container = document.getElementById('graficos');
    const filtroAno = document.getElementById('filtroAno');
    const filtroCurso = document.getElementById('filtroCurso');

    if (!container || !filtroAno || !filtroCurso) return;

    const ano = filtroAno.value;
    const curso = filtroCurso.value;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (!curso) {
        container.innerHTML = '<p class="placeholder">Selecione um curso para visualizar os dados.</p>';
        animarNumero('total-respostas', 0);
        return;
    }

    container.innerHTML = '<div class="loader"></div>';

    let dadosResponse = [];
    try {
        dadosResponse = await getDados(ano, curso);
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        container.innerHTML = '<p class="placeholder">N\u00e3o foi poss\u00edvel carregar os dados.</p>';
        return;
    }

    const dados = Array.isArray(dadosResponse?.dados)
        ? dadosResponse.dados
        : (Array.isArray(dadosResponse) ? dadosResponse : []);

    const totalGeral = dados.reduce((soma, item) => soma + (parseInt(item.total, 10) || 0), 0);
    animarNumero('total-respostas', totalGeral);

    container.innerHTML = '';

    if (dados.length === 0) {
        container.innerHTML = '<p class="placeholder">Sem dados para os filtros selecionados.</p>';
        return;
    }

    if (tipoGrafico === 'linhasMultiplas') {
        const origens = ordenarOrigens(new Set(dados.map(d => d.origem)));
        const combinacoesEventoTipo = [...new Set(
            dados.map(d => JSON.stringify([d.nome_evento, d.tipo_evento || '']))
        )].map(item => JSON.parse(item));

        const datasets = combinacoesEventoTipo.map(([evento, tipoEvento]) => {
            const { cor, label } = obterCorTipo(tipoEvento);

            const valoresPorOrigem = origens.map(origem => {
                const registro = dados.find(
                    d =>
                        d.nome_evento === evento &&
                        String(d.tipo_evento || '') === String(tipoEvento || '') &&
                        String(d.origem) === String(origem)
                );
                return registro ? (parseInt(registro.total, 10) || 0) : 0;
            });

            return {
                label: `${limparNomeEvento(evento, tipoEvento)} (${label})`,
                data: valoresPorOrigem,
                borderColor: cor,
                backgroundColor: `${cor}20`,
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: cor,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: false
            };
        });

        const chartCard = document.createElement('article');
        chartCard.className = 'chart-card chart-card--wide';

        const header = document.createElement('div');
        header.className = 'chart-card-header';

        const titulo = document.createElement('h3');
        titulo.className = 'chart-card-title';

        const subtitulo = document.createElement('p');
        subtitulo.className = 'chart-card-subtitle';

        if (combinacoesEventoTipo.length === 1) {
            const [eventoBase, tipoBase] = combinacoesEventoTipo[0];
            const nomeExibicao = limparNomeEvento(eventoBase, tipoBase);
            const { cor, label } = obterCorTipo(tipoBase);

            titulo.textContent = nomeExibicao;
            subtitulo.innerHTML = `Tipo: <span style="color: ${cor}; font-weight: 700;">${label}</span>`;
        } else {
            const nomesUnicos = [...new Set(combinacoesEventoTipo.map(([evento]) => evento))];
            if (nomesUnicos.length === 1) {
                titulo.textContent = limparNomeEvento(nomesUnicos[0], '');
                subtitulo.textContent = 'Comparativo por tipo dispon\u00edvel na legenda';
            } else {
                titulo.textContent = 'Comparativo de eventos';
                subtitulo.textContent = 'Nome e tipo dispon\u00edveis na legenda';
            }
        }

        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'chart-canvas-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'chart-canvas';

        header.appendChild(titulo);
        header.appendChild(subtitulo);
        chartCard.appendChild(header);
        canvasWrap.appendChild(canvas);
        chartCard.appendChild(canvasWrap);
        container.appendChild(chartCard);

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: origens,
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                animation: {
                    duration: 900,
                    easing: 'easeOutQuart'
                },
                layout: {
                    padding: isMobile
                        ? { top: 4, right: 12, bottom: 0, left: 12 }
                        : { top: 8, right: 10, bottom: 0, left: 10 }
                },
                plugins: {
                    legend: {
                        position: isMobile ? 'bottom' : 'top',
                        labels: {
                            boxWidth: isMobile ? 10 : 16,
                            boxHeight: isMobile ? 10 : 12,
                            padding: isMobile ? 10 : 14,
                            font: {
                                size: isMobile ? 10 : 12,
                                weight: isMobile ? '600' : '500'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                return `Respostas por origem: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        offset: isMobile,
                        ticks: {
                            autoSkip: isMobile,
                            maxTicksLimit: isMobile ? 6 : undefined,
                            maxRotation: isMobile ? 22 : 0,
                            minRotation: 0,
                            padding: isMobile ? 8 : 6,
                            callback(value) {
                                const texto = String(this.getLabelForValue(value) ?? '');
                                if (!isMobile || texto.length <= 14) return texto;
                                return `${texto.slice(0, 14)}...`;
                            },
                            font: {
                                size: isMobile ? 11 : 12,
                                weight: isMobile ? '600' : '500'
                            }
                        },
                        title: {
                            display: !isMobile,
                            text: 'Origens'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grace: '8%',
                        grid: { color: '#f0f0f0' },
                        ticks: {
                            precision: 0,
                            padding: isMobile ? 8 : 6,
                            font: {
                                size: isMobile ? 11 : 12,
                                weight: isMobile ? '600' : '500'
                            }
                        },
                        title: {
                            display: !isMobile,
                            text: 'N\u00famero de respostas'
                        }
                    }
                }
            }
        });

        return;
    }

    const chavesUnicas = [...new Set(dados.map(d => `${d.nome_evento}|${d.tipo_evento}`))];

    chavesUnicas.forEach(chave => {
        const [nomeOriginal, tipoEvento] = chave.split('|');
        const nomeExibicao = limparNomeEvento(nomeOriginal, tipoEvento);
        const { cor, label } = obterCorTipo(tipoEvento);

        const dadosFiltrados = dados.filter(
            d => d.nome_evento === nomeOriginal && d.tipo_evento === tipoEvento
        );

        const labels = dadosFiltrados.map(d => d.origem);
        const valores = dadosFiltrados.map(d => parseInt(d.total, 10) || 0);

        const chartCard = document.createElement('article');
        chartCard.className = 'chart-card chart-card--wide';

        const header = document.createElement('div');
        header.className = 'chart-card-header';

        const titulo = document.createElement('h3');
        titulo.className = 'chart-card-title';
        titulo.textContent = nomeExibicao;

        const subtitulo = document.createElement('p');
        subtitulo.className = 'chart-card-subtitle';
        subtitulo.innerHTML = `Tipo: <span style="color: ${cor}; font-weight: 700;">${label}</span>`;

        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'chart-canvas-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'chart-canvas';

        canvasWrap.appendChild(canvas);
        header.appendChild(titulo);
        header.appendChild(subtitulo);
        chartCard.appendChild(header);
        chartCard.appendChild(canvasWrap);
        container.appendChild(chartCard);

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Respostas',
                    data: valores,
                    backgroundColor: `${cor}99`
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                layout: {
                    padding: isMobile
                        ? { top: 6, right: 12, bottom: 0, left: 12 }
                        : { top: 10, right: 12, bottom: 0, left: 8 }
                },
                plugins: {
                    legend: {
                        display: false
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
                                size: isMobile ? 11 : 12,
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
                                size: isMobile ? 11 : 12,
                                weight: isMobile ? '600' : '500'
                            }
                        }
                    }
                }
            }
        });
    });
}

export function inicializarControleTipoGrafico() {
    const botoes = Array.from(document.querySelectorAll('.grafico-btn'));
    if (!botoes.length) return;

    const aplicarEstadoBotoes = (tipoSelecionado) => {
        botoes.forEach((botao) => {
            const ativo = botao.dataset.tipo === tipoSelecionado;
            botao.classList.toggle('active', ativo);
            botao.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });
    };

    const tipoInicialDisponivel = botoes.some((b) => b.dataset.tipo === tipoGrafico)
        ? tipoGrafico
        : (botoes.find((b) => b.classList.contains('active'))?.dataset.tipo || botoes[0].dataset.tipo);

    tipoGrafico = tipoInicialDisponivel;
    aplicarEstadoBotoes(tipoGrafico);

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            tipoGrafico = btn.dataset.tipo;
            aplicarEstadoBotoes(tipoGrafico);
            carregarDashboard();
        });
    });
}

function animarNumero(id, valorFinal) {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.__animFrame) {
        cancelAnimationFrame(el.__animFrame);
    }

    const inicio = Number.parseInt(String(el.textContent).replace(/\D/g, ''), 10) || 0;
    const alvo = Math.max(0, Number(valorFinal) || 0);
    const duracao = 340;
    const inicioTempo = performance.now();

    el.classList.remove('is-updating');
    void el.offsetWidth;
    el.classList.add('is-updating');

    if (inicio === alvo) {
        el.textContent = String(alvo);
        setTimeout(() => el.classList.remove('is-updating'), 220);
        return;
    }

    const easeOutCubic = (t) => 1 - ((1 - t) ** 3);

    const passo = (agora) => {
        const progresso = Math.min(1, (agora - inicioTempo) / duracao);
        const valorAtual = Math.round(inicio + ((alvo - inicio) * easeOutCubic(progresso)));
        el.textContent = String(valorAtual);

        if (progresso < 1) {
            el.__animFrame = requestAnimationFrame(passo);
            return;
        }

        el.textContent = String(alvo);
        el.__animFrame = null;
        setTimeout(() => el.classList.remove('is-updating'), 60);
    };

    el.__animFrame = requestAnimationFrame(passo);
}
