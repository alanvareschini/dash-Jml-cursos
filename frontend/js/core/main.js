import { abrirAba } from '../modules/tabs.js';
import { carregarCursos, carregarDashboard, inicializarControleTipoGrafico } from '../modules/dashboard.js';
import { atualizarRanking, toggleRanking, mudarVisaoOrigem } from '../modules/ranking.js';
import { initTabs } from '../modules/tabs.js';
import { authCheck, logout } from '../services/api.js';

const DASHBOARD_ENTRY_ANIMATION_KEY = 'jml_dashboard_entry_animation';
const AUTH_PENDING_CLASS = 'auth-pending';
const AUTH_READY_CLASS = 'auth-ready';

const aplicarAnimacaoEntradaDashboard = () => {
    let deveAnimar = false;

    try {
        deveAnimar = sessionStorage.getItem(DASHBOARD_ENTRY_ANIMATION_KEY) === '1';
        if (deveAnimar) {
            sessionStorage.removeItem(DASHBOARD_ENTRY_ANIMATION_KEY);
        }
    } catch {
        deveAnimar = false;
    }

    if (!deveAnimar) return;

    document.body.classList.add('dashboard-enter');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('dashboard-enter-active');
        });
    });

    window.setTimeout(() => {
        document.body.classList.remove('dashboard-enter', 'dashboard-enter-active');
    }, 620);
};

const iniciarTelaValidacaoAuth = () => {
    const gate = document.getElementById('authGate');

    document.body.classList.add(AUTH_PENDING_CLASS);
    document.body.classList.remove(AUTH_READY_CLASS);

    if (!gate) return;

    gate.setAttribute('aria-hidden', 'false');
    gate.setAttribute('aria-busy', 'true');
};

const finalizarTelaValidacaoAuth = () => {
    const gate = document.getElementById('authGate');

    document.body.classList.remove(AUTH_PENDING_CLASS);
    document.body.classList.add(AUTH_READY_CLASS);

    if (!gate) return;

    gate.setAttribute('aria-hidden', 'true');
    gate.setAttribute('aria-busy', 'false');
};

const validarSessao = async () => {
    try {
        const data = await authCheck();
        return Boolean(data?.authenticated);
    } catch {
        return false;
    }
};

const atualizarEstadoMenuMobile = (abaAtual = 'home') => {
    const botoesMenuMobile = document.querySelectorAll('#mobileMenuPanel [data-abrir-aba]');
    if (!botoesMenuMobile.length) return;

    botoesMenuMobile.forEach((botao) => {
        const ativo = botao.getAttribute('data-abrir-aba') === abaAtual;
        botao.classList.toggle('is-current', ativo);
        if (ativo) {
            botao.setAttribute('aria-current', 'page');
            return;
        }

        botao.removeAttribute('aria-current');
    });
};

const obterAbaAtiva = () => {
    const botaoAtivo = document.querySelector('.tab-button.active');
    const id = botaoAtivo?.id?.replace('btn-', '');
    return id || 'home';
};

const abrirDashboardComAno = async (ano) => {
    const filtroAno = document.getElementById('filtroAno');

    if (!filtroAno) {
        await carregarDashboard();
        return;
    }

    const anoDesejado = String(ano);
    const possuiAno = Array.from(filtroAno.options).some((opt) => opt.value === anoDesejado);

    if (possuiAno) {
        filtroAno.value = anoDesejado;
    }

    await carregarCursos();
    await carregarDashboard();
};

const navegarParaAba = async (aba, opcoes = {}) => {
    if (aba === 'dashboard') {
        abrirAba('dashboard');
        atualizarEstadoMenuMobile('dashboard');
        if (opcoes.anoDashboard) {
            await abrirDashboardComAno(opcoes.anoDashboard);
            return;
        }

        await carregarDashboard();
        return;
    }

    if (aba === 'ranking') {
        abrirAba('ranking');
        atualizarEstadoMenuMobile('ranking');
        await atualizarRanking();
        return;
    }

    abrirAba('home');
    atualizarEstadoMenuMobile('home');
};

const registrarAberturaPorDataAttr = () => {
    document.querySelectorAll('[data-abrir-aba]')
        .forEach((el) => {
            const alvo = el.getAttribute('data-abrir-aba');
            if (!alvo) return;
            const anoDashboard = el.getAttribute('data-dashboard-ano');

            el.addEventListener('click', (event) => {
                event.preventDefault();
                if (alvo === 'dashboard' && anoDashboard) {
                    void navegarParaAba(alvo, { anoDashboard });
                    return;
                }

                void navegarParaAba(alvo);
            });

            if (el.tagName.toLowerCase() === 'button') return;

            el.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();

                if (alvo === 'dashboard' && anoDashboard) {
                    void navegarParaAba(alvo, { anoDashboard });
                    return;
                }

                void navegarParaAba(alvo);
            });
        });
};

const inicializarMenuMobile = () => {
    const botaoMenu = document.getElementById('btnMobileMenu');
    const painelMenu = document.getElementById('mobileMenuPanel');

    if (!botaoMenu || !painelMenu) {
        return { fechar: () => {} };
    }

    let aberto = false;

    const abrir = () => {
        aberto = true;
        atualizarEstadoMenuMobile(obterAbaAtiva());
        painelMenu.classList.add('is-open');
        botaoMenu.classList.add('is-open');
        document.body.classList.add('mobile-menu-open');
        botaoMenu.setAttribute('aria-expanded', 'true');
        painelMenu.setAttribute('aria-hidden', 'false');
    };

    const fechar = () => {
        aberto = false;
        painelMenu.classList.remove('is-open');
        botaoMenu.classList.remove('is-open');
        document.body.classList.remove('mobile-menu-open');
        botaoMenu.setAttribute('aria-expanded', 'false');
        painelMenu.setAttribute('aria-hidden', 'true');
    };

    botaoMenu.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (aberto) {
            fechar();
            return;
        }
        abrir();
    });

    painelMenu.querySelectorAll('[data-abrir-aba], [data-logout]')
        .forEach((item) => item.addEventListener('click', fechar));

    painelMenu.querySelectorAll('[data-mobile-close]')
        .forEach((item) => item.addEventListener('click', fechar));

    document.addEventListener('keydown', (event) => {
        if (!aberto) return;
        if (event.key !== 'Escape') return;
        fechar();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) fechar();
    });

    return { fechar };
};

const inicializarAplicacao = () => {
    initTabs();
    aplicarAnimacaoEntradaDashboard();
    abrirAba('home');
    atualizarEstadoMenuMobile('home');
    registrarAberturaPorDataAttr();
    const mobileMenu = inicializarMenuMobile();

    const filtroAno = document.getElementById('filtroAno');
    const filtroCurso = document.getElementById('filtroCurso');
    const filtroAnoRank = document.getElementById('filtroAnoRanking');
    const filtroRank = document.getElementById('filtroRanking');

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

    if (filtroAnoRank) filtroAnoRank.addEventListener('change', atualizarRanking);
    if (filtroRank) filtroRank.addEventListener('change', atualizarRanking);

    document.getElementById('btn-home')
        ?.addEventListener('click', () => void navegarParaAba('home'));

    document.getElementById('btn-dashboard')
        ?.addEventListener('click', () => void navegarParaAba('dashboard'));

    document.getElementById('btn-ranking')
        ?.addEventListener('click', () => void navegarParaAba('ranking'));

    document.getElementById('btnToggleRanking')
        ?.addEventListener('click', toggleRanking);

    document.querySelectorAll('#viewOptionsOrigens .switch-btn')
        .forEach((btn) => {
            btn.addEventListener('click', () => {
                mudarVisaoOrigem(btn.dataset.view, btn);
            });
        });

    document.querySelectorAll('[data-logout]')
        .forEach((botao) => {
            botao.addEventListener('click', async () => {
                mobileMenu.fechar();
                await logout();
                window.location.href = 'login.html';
            });
        });

    Promise.resolve(carregarCursos())
        .catch((erro) => console.error('Falha ao carregar cursos:', erro));

    Promise.resolve(atualizarRanking())
        .catch((erro) => console.error('Falha ao atualizar ranking:', erro));

    Promise.resolve(inicializarControleTipoGrafico())
        .catch((erro) => console.error('Falha ao inicializar controle de grafico:', erro));
};

const bootstrap = async () => {
    iniciarTelaValidacaoAuth();

    const autenticado = await validarSessao();
    if (!autenticado) {
        window.location.replace('login.html');
        return;
    }

    inicializarAplicacao();
    requestAnimationFrame(() => {
        finalizarTelaValidacaoAuth();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    void bootstrap();
});
