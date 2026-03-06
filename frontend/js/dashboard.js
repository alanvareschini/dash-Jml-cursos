// ==========================
// VARIÁVEIS GLOBAIS
// ==========================
let chartRankingEventos = null;
let chartRankingOrigens = null;
let mostrarTodosRanking = false;
let visaoAtualOrigem = 'lista'; // Mantém a escolha do usuário entre gráfico e lista
let abaAtual = 'home'; // Para controlar a aba ativa

// ==========================
// FUNÇÕES DE APOIO E ALTERNÂNCIA
// ==========================


function mudarVisaoOrigem(tipoVisao, elemento) {
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
    if (lista && grafico) {
        if (tipoVisao === 'lista') {
            lista.style.display = 'block';
            grafico.style.display = 'none';
        } else {
            lista.style.display = 'none';
            grafico.style.display = 'block';

            // Redesenha o gráfico para não ficar achatado
            setTimeout(() => {
                if (chartRankingOrigens) chartRankingOrigens.resize();
            }, 100);
        }
    }
}

function toggleRanking() {
    mostrarTodosRanking = !mostrarTodosRanking;
    const botao = document.getElementById('btnToggleRanking');

    if (botao) {
        // Adiciona ou remove a sombra branca/cinza
        botao.classList.toggle('active');

        botao.innerText = mostrarTodosRanking
            ? '🏆 Mostrar apenas Top 5'
            : '🏆 Mostrar todos';
    }
    atualizarRanking();
}

function abrirAba(id) {
    // 1. Esconde as seções
    document.getElementById('home').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('ranking').style.display = 'none';

    // 2. Mostra a clicada
    document.getElementById(id).style.display = 'block';

    // 3. Atualiza botões e linha
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

    const btnAtivo = document.getElementById('btn-' + id);
    if (btnAtivo) {
        btnAtivo.classList.add('active');

        // Move a linha neon
        const indicador = document.querySelector('.tab-indicator');
        if (indicador) {
            indicador.style.setProperty('--indicator-width', btnAtivo.offsetWidth + 'px');
            indicador.style.setProperty('--indicator-left', btnAtivo.offsetLeft + 'px');
        }
    }
}

// ==========================
// DASHBOARD PRINCIPAL
// ==========================

async function carregarCursos() {
    const filtroAno = document.getElementById('filtroAno');
    if (!filtroAno) return;

    const ano = filtroAno.value;
    const select = document.getElementById('filtroCurso');

    select.innerHTML = '<option value="">Selecione o curso</option>';

    const response = await fetch(`./php/get_cursos.php?ano=${ano}`);
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

async function carregarDashboard() {
    const ano = document.getElementById('filtroAno').value;
    const curso = document.getElementById('filtroCurso').value;
    if (!curso) return;

    const response = await fetch(`./php/get_dados.php?ano=${ano}&curso=${encodeURIComponent(curso)}`);
    const dadosResponse = await response.json();
    const dados = dadosResponse.dados || dadosResponse;

    const totalGeral = dados.reduce((soma, item) => soma + parseInt(item.total), 0);
    document.getElementById('total-respostas').innerText = totalGeral;

    // Agrupamos por nome_evento e tipo_evento para gerar gráficos separados
    const chavesUnicas = [...new Set(dados.map(d => `${d.nome_evento}|${d.tipo_evento}`))];

    const container = document.getElementById('graficos');
    container.innerHTML = '';

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
            corTag = '#991c8c'; // Verde (Misto)
            textoTag = 'Misto';
        }


        const dadosFiltrados = dados.filter(d => d.nome_evento === nomeOriginal && d.tipo_evento === tipoEvento);
        const labels = dadosFiltrados.map(d => d.origem);
        const valores = dadosFiltrados.map(d => parseInt(d.total));
        const totalEvento = valores.reduce((a, b) => a + b, 0);

        // --- RENDERIZAÇÃO ---
        const titulo = document.createElement('h3');
        titulo.style.marginTop = "35px";
        // Resultado esperado: "Nome Curso (Presencial)" ou "Nome Curso - Online (Online)"
        titulo.innerHTML = `${nomeExibicao} <span style="color: ${corTag}; font-weight: bold;">(${textoTag})</span>`;
        container.appendChild(titulo);

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: `Respostas por origem `,
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

// ==========================
// RANKING EVENTOS
// ==========================

async function carregarRankingEventos() {
    const ano = document.getElementById('filtroAnoRanking').value;
    const botao = document.getElementById('btnToggleRanking');

    let url = './php/get_ranking_eventos.php';
    if (ano) {
        url += `?ano=${ano}`;
    }

    const response = await fetch(url);
    let ranking = await response.json();

    const totalEventosAno = ranking.length;

    // Se for 2023 ou 2024, mostrar todos e esconder botão
    if (ano === '2023' || ano === '2024') {
        mostrarTodosRanking = true;
        if (botao) botao.style.display = 'none';
    } else {
        if (botao) botao.style.display = 'inline-block';
        if (!mostrarTodosRanking) {
            ranking = ranking.slice(0, 5);
        }
    }

    const container = document.getElementById('rankingEventos');
    container.innerHTML = '';

    ranking.forEach((item, index) => {
        let medalha = '';
        if (index === 0) medalha = '🥇';
        else if (index === 1) medalha = '🥈';
        else if (index === 2) medalha = '🥉';
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

async function carregarRankingOrigens() {
    const ano = document.getElementById('filtroAnoRanking').value;
    let url = './php/get_ranking_origens.php';
    if (ano) url += `?ano=${ano}`;

    const response = await fetch(url);
    let ranking = await response.json();

    if (!mostrarTodosRanking) ranking = ranking.slice(0, 5);

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
        <span class="ranking-nome">${item.origem}</span>
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

function atualizarRanking() {
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
        document.getElementById('rankingOrigens').style.display = 'none';
        document.getElementById('listaRankingOrigens').style.display = 'none';

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
}
// ==========================
// INICIALIZAÇÃO
// ==========================

window.addEventListener('DOMContentLoaded', () => {

    // Define aba inicial
    abrirAba('home');

    // Carrega dados iniciais
    carregarCursos();
    atualizarRanking();

    // Eventos Dashboard
    const filtroAno = document.getElementById('filtroAno');
    const filtroCurso = document.getElementById('filtroCurso');

    if (filtroAno) filtroAno.addEventListener('change', carregarCursos);
    if (filtroCurso) filtroCurso.addEventListener('change', carregarDashboard);

    // Eventos Ranking
    const filtroAnoRank = document.getElementById('filtroAnoRanking');
    const filtroRank = document.getElementById('filtroRanking');

    if (filtroAnoRank) filtroAnoRank.addEventListener('change', atualizarRanking);
    if (filtroRank) filtroRank.addEventListener('change', atualizarRanking);

});


