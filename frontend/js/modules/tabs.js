export function abrirAba(id) {
    // 1. Esconde as secoes
    document.getElementById('home').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('ranking').style.display = 'none';

    // 2. Mostra a clicada
    document.getElementById(id).style.display = 'block';

    // 3. Atualiza botoes e linha
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

export function initTabs() {

    const tabs = document.querySelectorAll(".tab-button");
    const tabsContainer = document.querySelector(".tabs-container");
    const tabsList = document.querySelector(".tabs-list");
    const indicador = document.querySelector(".tab-indicator");

    if (!tabsContainer || !tabsList || tabs.length === 0) return;

    function updateIndicator(tab) {
        const rect = tab.getBoundingClientRect();
        const containerRect = tabsList.getBoundingClientRect();

        if (indicador) {
            indicador.style.setProperty(
                "--indicator-left",
                rect.left - containerRect.left + "px"
            );

            indicador.style.setProperty(
                "--indicator-width",
                rect.width + "px"
            );
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            updateIndicator(tab);
        });
    });

    const activeTab = document.querySelector(".tab-button.active");
    if (activeTab) updateIndicator(activeTab);

    window.addEventListener('resize', () => {
        const atual = document.querySelector(".tab-button.active");
        if (atual) updateIndicator(atual);
    });
}
