// ==========================
// DASHBOARD PRINCIPAL
// ==========================

import { getCursos, getDados } from '../services/api.js';
let tipoGrafico = "linhasMultiplas";

export async function carregarCursos() {
    const filtroAno = document.getElementById('filtroAno');
    if (!filtroAno) return;

    const ano = filtroAno.value;
    const select = document.getElementById('filtroCurso');

    select.innerHTML = '<option value="">Selecione o curso</option>';

    const response = await fetch(`http://localhost:8080/backend/api/get_cursos.php?ano=${ano}`);
    const cursos = await response.json();

    cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        let nomeParaExibirNoFiltro = curso.replace(/ - Presencial/i, '').trim();
        option.textContent = nomeParaExibirNoFiltro;
        select.appendChild(option);
    });

    if (cursos.length > 0) {
        select.value = cursos[0];
        carregarDashboard();
    }
}

export async function carregarDashboard() {
    const containerRanking = document.getElementById('rankingEventos');
    containerRanking.innerHTML = '<div class="loader"></div>';
    const ano = document.getElementById('filtroAno').value;
    const curso = document.getElementById('filtroCurso').value;
    if (!curso) return;

    const response = await fetch(`http://localhost:8080/backend/api/get_dados.php?ano=${ano}&curso=${encodeURIComponent(curso)}`);
    const dadosResponse = await response.json();
    const dados = dadosResponse.dados || dadosResponse;

    const totalGeral = dados.reduce((soma, item) => soma + parseInt(item.total), 0);
    animarNumero("total-respostas", totalGeral);

    const container = document.getElementById('graficos');
    container.innerHTML = '';

    // SE FOR LINHAS MÚLTIPLAS - GRÁFICO ÚNICO
    if (tipoGrafico === "linhasMultiplas") {
        // PREPARA OS DADOS
        const anos = [...new Set(dados.map(d => d.origem))].sort();
        const eventos = [...new Set(dados.map(d => d.nome_evento))];

        const cores = ['#007bff', '#dc3545', '#28a745', '#ffc107', '#17a2b8', '#6610f2'];

        const datasets = eventos.map((evento) => {
            // DESCOBRE O TIPO DO EVENTO
            const registroExemplo = dados.find(d => d.nome_evento === evento);
            const tipoEvento = registroExemplo ? registroExemplo.tipo_evento : '';

            // DEFINE A COR BASEADA NO TIPO (MESMA LÓGICA DO VERTICAL)
            let corLinha = '#007bff'; // Azul (Online)
            let nomeTipo = 'Online';

            if (tipoEvento === 'Presencial') {
                corLinha = '#dc3545'; // Vermelho
                nomeTipo = 'Presencial';
            } else if (tipoEvento === 'Online') {
                corLinha = '#007bff'; // Azul
                nomeTipo = 'Online';
            } else if (tipoEvento.toLowerCase().includes('e online') || tipoEvento.toLowerCase().includes('misto')) {
                corLinha = '#991c8c'; // Roxo
                nomeTipo = 'Misto';
            }

            // PEGA OS VALORES PARA CADA ANO
            const valoresPorAno = anos.map(ano => {
                const registro = dados.find(d => d.nome_evento === evento && d.origem === ano.toString());
                return registro ? parseInt(registro.total) : 0;
            });

            return {
                label: `${evento} (${nomeTipo})`, // MOSTRA O TIPO NA LEGENDA
                data: valoresPorAno,
                borderColor: corLinha,
                backgroundColor: corLinha + '20', // COR TRANSPARENTE
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: corLinha,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: false
            };
        });

        // CRIA UM ÚNICO CANVAS
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        container.appendChild(canvas);

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: anos,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
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
                            text: 'Anos'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' },
                        title: {
                            display: true,
                            text: 'Número de Respostas'
                        }
                    }
                }
            }
        });
    }
    // SE FOR HORIZONTAL - MÚLTIPLOS GRÁFICOS (SEU CÓDIGO ORIGINAL)
    else {
        // Agrupamos por nome_evento e tipo_evento para gerar gráficos separados
        const chavesUnicas = [...new Set(dados.map(d => `${d.nome_evento}|${d.tipo_evento}`))];

        chavesUnicas.forEach(chave => {
            const [nomeOriginal, tipoEvento] = chave.split('|');

            // --- REGRA DE TÍTULO SOLICITADA ---
            let nomeExibicao = nomeOriginal;

            if (tipoEvento === 'Presencial') {
                nomeExibicao = nomeOriginal.replace(/ - Presencial/i, '').trim();
            }
            else if (tipoEvento === 'Online') {
                nomeExibicao = nomeOriginal.replace(/ - Online/i, '').trim();
            }
            else if (tipoEvento.toLowerCase().includes('misto') || tipoEvento.toLowerCase().includes('e online')) {
                nomeExibicao = nomeOriginal.replace(/ - Misto/i, '').replace(/ - Online/i, '').trim();
            }

            let corTag = '#007bff'; // Azul (Online)
            let textoTag = tipoEvento;

            if (tipoEvento === 'Presencial') {
                corTag = '#dc3545'; // Vermelho (Presencial)
            } else if (tipoEvento.toLowerCase().includes('e online') || tipoEvento.toLowerCase().includes('misto')) {
                corTag = '#991c8c'; // Roxo (Misto)
                textoTag = 'Misto';
            }

            const dadosFiltrados = dados.filter(d => d.nome_evento === nomeOriginal && d.tipo_evento === tipoEvento);
            const labels = dadosFiltrados.map(d => d.origem);
            const valores = dadosFiltrados.map(d => parseInt(d.total));

            // --- RENDERIZAÇÃO ---
            const titulo = document.createElement('h3');
            titulo.style.marginTop = "35px";
            titulo.innerHTML = `${nomeExibicao} <span style="color: ${corTag}; font-weight: bold;">(${textoTag})</span>`;
            container.appendChild(titulo);

            const canvas = document.createElement('canvas');
            container.appendChild(canvas);

            new Chart(canvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: `Respostas por origem`,
                        data: valores,
                        backgroundColor: corTag + '99'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                }
            });
        });
    }
}
export function inicializarControleTipoGrafico() {
    const botoes = document.querySelectorAll(".grafico-btn");

    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            tipoGrafico = btn.dataset.tipo;
            carregarDashboard();
        });
    });
}

function animarNumero(id, valorFinal) {

    const el = document.getElementById(id);
    let atual = 0;

    const incremento = Math.ceil(valorFinal / 40);

    const intervalo = setInterval(() => {

        atual += incremento;

        if (atual >= valorFinal) {
            atual = valorFinal;
            clearInterval(intervalo);
        }

        el.textContent = atual;

    }, 25);
}