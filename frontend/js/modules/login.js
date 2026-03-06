import { resolveApiBase } from '../services/apiBase.js';

const API = resolveApiBase();

function showLoginError(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const lembrarCheckbox = document.getElementById('lembrar');

    if (!form || !emailInput || !senhaInput || !lembrarCheckbox) return;

    const emailSalvo = localStorage.getItem('email_lembrado');
    if (emailSalvo) {
        emailInput.value = emailSalvo;
        lembrarCheckbox.checked = true;
    }

    lembrarCheckbox.addEventListener('change', function () {
        if (!this.checked) {
            localStorage.removeItem('email_lembrado');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const senha = senhaInput.value;

        if (lembrarCheckbox.checked) {
            localStorage.setItem('email_lembrado', email);
        } else {
            localStorage.removeItem('email_lembrado');
        }

        try {
            const res = await fetch(`${API}login.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const raw = await res.text();
            let data;

            try {
                data = JSON.parse(raw);
            } catch {
                throw new Error(`Resposta invalida do servidor: ${raw.slice(0, 120)}`);
            }

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao autenticar');
            }

            if (data.success) {
                window.location.href = 'index.html';
                return;
            }

            showLoginError('Email ou senha invalidos');
        } catch (error) {
            console.error('Erro no login:', error);
            showLoginError('Erro ao processar login. Verifique servidor e banco.');
        }
    });
});
