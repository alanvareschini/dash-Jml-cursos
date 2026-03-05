import { abrirAba } from '../modules/tabs.js';
import { carregarCursos, carregarDashboard } from '../modules/dashboard.js';
import { atualizarRanking } from '../modules/ranking.js';
import { toggleRanking, mudarVisaoOrigem } from '../modules/ranking.js';
import { inicializarControleTipoGrafico } from '../modules/dashboard.js';
import { initTabs } from "../modules/tabs.js";
import { logout } from "../services/api.js";

document.addEventListener("DOMContentLoaded", () => {
    initTabs();
});

fetch("http://localhost:8080/backend/api/auth_check.php", {
    credentials: "include"
})
    .then(res => res.json())
    .then(data => {
        if (!data.authenticated) {
            window.location.href = "login.html";
        }
    });

window.addEventListener('DOMContentLoaded', () => {

    abrirAba('home');

    carregarCursos();
    atualizarRanking();
    inicializarControleTipoGrafico();


    const filtroAno = document.getElementById('filtroAno');
    const filtroCurso = document.getElementById('filtroCurso');

    if (filtroAno) {
        filtroAno.addEventListener('change', async () => {
            await carregarCursos();
            carregarDashboard();
        });
    }

    if (filtroCurso) {
        filtroCurso.addEventListener('change', () => {
            carregarDashboard();
        });
    }

    const filtroAnoRank = document.getElementById('filtroAnoRanking');
    const filtroRank = document.getElementById('filtroRanking');

    if (filtroAnoRank) filtroAnoRank.addEventListener('change', atualizarRanking);
    if (filtroRank) filtroRank.addEventListener('change', atualizarRanking);

    // BOTÕES MENU
    document.getElementById('btn-home')
        ?.addEventListener('click', () => abrirAba('home'));

    document.getElementById('btn-dashboard')
        ?.addEventListener('click', () => {
            abrirAba('dashboard');
            carregarDashboard();
        });

    document.getElementById('btn-ranking')
        ?.addEventListener('click', () => {
            abrirAba('ranking');
            atualizarRanking();
        });

    document.getElementById('btnToggleRanking')
        ?.addEventListener('click', toggleRanking);

    document.querySelectorAll('#viewOptionsOrigens .switch-btn')
        .forEach(btn => {
            btn.addEventListener('click', () => {
                mudarVisaoOrigem(btn.dataset.view, btn);
            });
        });

    document.getElementById("btnLogout")?.addEventListener("click", async () => {
        await logout();
        window.location.href = "login.html";
    });


    // CARDS HOME
    const cards = document.querySelectorAll(".card-link");

    if (cards[0]) {
        cards[0].addEventListener("click", () => abrirAba("dashboard"));
        carregarDashboard();
    }

    if (cards[1]) {
        cards[1].addEventListener("click", () => abrirAba("ranking"));
    }

});

