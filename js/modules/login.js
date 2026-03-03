document.getElementById("formLogin").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    fetch("php/login.php", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = "index.php";
        } else {
            alert("Email ou senha inválidos");
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    
    const emailInput = document.getElementById('email');
    const lembrarCheckbox = document.getElementById('lembrar');
    const form = document.getElementById('formLogin');
    

    const emailSalvo = localStorage.getItem('email_lembrado');
    
    if (emailSalvo) {
        emailInput.value = emailSalvo;        // Preenche o campo
        lembrarCheckbox.checked = true;       // Marca o checkbox
    }
    

    form.addEventListener('submit', function() {
        
        if (lembrarCheckbox.checked) {
            // Salva o email no localStorage
            localStorage.setItem('email_lembrado', emailInput.value);
        } else {
            // Remove o email salvo
            localStorage.removeItem('email_lembrado');
        }
        
        // O formulário vai continuar o envio normal para o PHP
        // (não precisa de preventDefault aqui porque queremos que envie)
    });
    
    // 3. (OPCIONAL) Se quiser limpar quando desmarcar
    lembrarCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            localStorage.removeItem('email_lembrado');
        }
    });
});