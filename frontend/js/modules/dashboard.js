import { getCursos, getDados } from '../services/api.js';

let tipoGrafico = 'linhasMultiplas';

function obterCorTipo(tipoEvento = '') {
    const tipoNormalizado = String(tipoEvento).toLowerCase();

    if (tipoNormalizado.includes('presencial')) {
        return { cor: '#dc3545', label: 'Presencial' };
    }

    if (tipoNormalizado.includes('misto') || tipoNormalizado.includes('e online')) {
        return { cor: '#991c8c', label: 'Misto' };
    }

    return { cor: '#007bff', label: 'Online' };
}

function limparNomeEvento(nomeOriginal = '', tipoEvento = '') {
    const tipoNormalizado = String(tipoEvento).toLowerCase();

    if (tipoNormalizado.includes('presencial')) {
        return nomeOriginal.replace(/ - Presencial/i, '').trim();
    }

    if (tipoNormalizado.includes('online')) {
        return nomeOriginal.replace(/ - Online/i, '').trim();
    }

    if (tipoNormalizado.includes('misto') || tipoNormalizado.includes('e online')) {
        return nomeOriginal
            .replace(/ - Misto/i, '')
            .replace(/ - Online/i, '')
            .trim();
    }

    return nomeOriginal;
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
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso.replace(/ - Presencial/i, '').trim();
        select.appendChild(option);
    });

    if (cursos.length > 0) {
        select.value = cursos[0];
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
        container.innerHTML = '<p class="placeholder">Nao foi possivel carregar os dados.</p>';
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
        const eventos = [...new Set(dados.map(d => d.nome_evento))];

        const datasets = eventos.map(evento => {
            const registroExemplo = dados.find(d => d.nome_evento === evento);
            const { cor, label } = obterCorTipo(registroExemplo?.tipo_evento);

            const valoresPorOrigem = origens.map(origem => {
                const registro = dados.find(
                    d => d.nome_evento === evento && String(d.origem) === String(origem)
                );
                return registro ? (parseInt(registro.total, 10) || 0) : 0;
            });

            return {
                label: `${evento} (${label})`,
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

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        container.appendChild(canvas);

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
                plugins: {
                    legend: { position: 'top' },
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
                        title: {
                            display: true,
                            text: 'Origens'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' },
                        title: {
                            display: true,
                            text: 'Numero de respostas'
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

        const titulo = document.createElement('h3');
        titulo.style.marginTop = '35px';
        titulo.innerHTML = `${nomeExibicao} <span style="color: ${cor}; font-weight: 700;">(${label})</span>`;
        container.appendChild(titulo);

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Respostas por origem',
                    data: valores,
                    backgroundColor: `${cor}99`
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    });
}

export function inicializarControleTipoGrafico() {
    const botoes = document.querySelectorAll('.grafico-btn');

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            botoes.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tipoGrafico = btn.dataset.tipo;
            carregarDashboard();
        });
    });
}

function animarNumero(id, valorFinal) {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.__animTimer) {
        clearInterval(el.__animTimer);
    }

    let atual = 0;
    const incremento = Math.max(1, Math.ceil(valorFinal / 40));

    el.__animTimer = setInterval(() => {
        atual += incremento;

        if (atual >= valorFinal) {
            atual = valorFinal;
            clearInterval(el.__animTimer);
            el.__animTimer = null;
        }

        el.textContent = atual;
    }, 25);
}
