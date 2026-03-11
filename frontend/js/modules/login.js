import { resolveApiBase } from '../services/apiBase.js';

const API = resolveApiBase();
const REDIRECT_DELAY_MS = 520;
const BUTTON_FEEDBACK_MS = 650;
const DASHBOARD_ENTRY_ANIMATION_KEY = 'jml_dashboard_entry_animation';

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function hideLoginError() {
    const alertBox = document.getElementById('loginAlert');
    if (!alertBox) return;

    alertBox.hidden = true;
    alertBox.classList.add('hidden');
}

function showLoginError(message) {
    const alertBox = document.getElementById('loginAlert');
    const alertMessage = alertBox?.querySelector('.alert-message');

    if (!alertBox || !alertMessage) {
        alert(message);
        return;
    }

    alertMessage.textContent = message;
    alertBox.hidden = false;
    alertBox.classList.remove('hidden');
}

function setButtonState(button, state = 'idle') {
    if (!button) return;

    const buttonText = button.querySelector('.btn-login-text');
    const buttonIcon = button.querySelector('.btn-login-icon');
    const originalLabel = button.dataset.originalLabel || buttonText?.textContent || 'Entrar no sistema';
    button.dataset.originalLabel = originalLabel;

    button.classList.remove('loading', 'success', 'error');

    if (state !== 'idle') {
        button.classList.add(state);
    }

    if (buttonText) {
        if (state === 'loading') {
            buttonText.textContent = 'Entrando...';
        } else if (state === 'success') {
            buttonText.textContent = 'Acesso liberado';
        } else if (state === 'error') {
            buttonText.textContent = 'Tentar novamente';
        } else {
            buttonText.textContent = originalLabel;
        }
    }

    if (buttonIcon) {
        buttonIcon.setAttribute('aria-hidden', state === 'loading' ? 'true' : 'false');
    }

    const isBlocked = state === 'loading' || state === 'success';
    button.disabled = isBlocked;
    button.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
}

function enableRememberedEmail(emailInput, lembrarCheckbox) {
    const emailSaved = localStorage.getItem('email_lembrado');
    if (!emailSaved) return;

    emailInput.value = emailSaved;
    lembrarCheckbox.checked = true;
}

function handleRememberToggle(lembrarCheckbox) {
    lembrarCheckbox.addEventListener('change', function () {
        if (!this.checked) {
            localStorage.removeItem('email_lembrado');
        }
    });
}

async function runSuccessTransition(button) {
    setButtonState(button, 'success');
    document.body.classList.add('login-success-transition');
    await delay(REDIRECT_DELAY_MS);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const lembrarCheckbox = document.getElementById('lembrar');
    const loginButton = document.getElementById('btnLogin');

    if (!form || !emailInput || !senhaInput || !lembrarCheckbox || !loginButton) return;

    enableRememberedEmail(emailInput, lembrarCheckbox);
    handleRememberToggle(lembrarCheckbox);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const senha = senhaInput.value;

        hideLoginError();
        document.body.classList.remove('login-success-transition');
        setButtonState(loginButton, 'loading');

        try {
            const response = await fetch(`${API}login.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const raw = await response.text();
            let data;

            try {
                data = JSON.parse(raw);
            } catch {
                throw new Error(`Resposta invalida do servidor: ${raw.slice(0, 120)}`);
            }

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao autenticar');
            }

            if (!data.success) {
                throw new Error('E-mail ou senha invalidos');
            }

            if (lembrarCheckbox.checked) {
                localStorage.setItem('email_lembrado', email);
            } else {
                localStorage.removeItem('email_lembrado');
            }

            await runSuccessTransition(loginButton);
            sessionStorage.setItem(DASHBOARD_ENTRY_ANIMATION_KEY, '1');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erro no login:', error);

            const message = error instanceof Error && error.message
                ? error.message
                : 'Erro ao processar login. Verifique servidor e banco.';

            showLoginError(message);
            setButtonState(loginButton, 'error');
            await delay(BUTTON_FEEDBACK_MS);
            setButtonState(loginButton, 'idle');
        }
    });
});
