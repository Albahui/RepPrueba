// assets/js/login.js - JavaScript para el formulario de login

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username_or_email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');

    // Verificar si hay mensajes de error en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');

    if (error) {
        showError(getErrorMessage(error));
    }

    if (success) {
        showSuccess(success);
    }

    // Validación del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // Limpiar errores previos
            clearErrors();

            // Validaciones
            let isValid = true;

            // Verificar username/email
            if (!usernameInput.value.trim()) {
                showFieldError('loginError', 'Username o email sono obbligatori');
                isValid = false;
            }

            // Verificar password
            if (!passwordInput.value.trim()) {
                showFieldError('passwordError', 'La password è obbligatoria');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                return false;
            }

            // Mostrar loading
            showLoading();
        });
    }

    // Limpiar errores cuando el usuario empiece a escribir
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            clearFieldError('loginError');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            clearFieldError('passwordError');
        });
    }

    // Función para mostrar errores
    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
            loginError.style.color = '#c62828';
            loginError.style.background = '#fdeaea';
            loginError.style.padding = '12px';
            loginError.style.borderRadius = '8px';
            loginError.style.border = '1px solid #f44336';
            loginError.style.marginTop = '10px';
        }
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            color: #2e7d32;
            background: #e8f5e8;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #4caf50;
            margin-bottom: 20px;
            text-align: center;
        `;
        
        const container = document.querySelector('.form-container');
        if (container) {
            container.insertBefore(successDiv, container.firstChild);
        }

        // Auto-hide success message
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    function showFieldError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = '#c62828';
            errorElement.style.fontSize = '14px';
            errorElement.style.marginTop = '5px';
        }
    }

    function clearFieldError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }

    function clearErrors() {
        clearFieldError('loginError');
        clearFieldError('passwordError');
        if (loginError) {
            loginError.style.display = 'none';
        }
    }

    function showLoading() {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Accesso in corso...';
            submitButton.style.opacity = '0.7';
        }
    }

    function getErrorMessage(errorCode) {
        const errorMessages = {
            'campi_obbligatori': 'Tutti i campi sono obbligatori.',
            'utente_non_trovato': 'Username o email non trovati. Verifica i dati inseriti.',
            'password_errata': 'Password non corretta. Riprova.',
            'errore_sistema': 'Errore del sistema. Riprova più tardi.',
            'errore_generale': 'Si è verificato un errore. Riprova.',
            'dati_incompleti': 'Dati del formulario incompleti.'
        };

        return errorMessages[errorCode] || 'Si è verificato un errore sconosciuto.';
    }

    // Validazione email in tempo reale
    if (usernameInput) {
        usernameInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && value.includes('@')) {
                // È un email, validarlo
                if (!isValidEmail(value)) {
                    showFieldError('loginError', 'Formato email non valido');
                }
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Gestione del tasto Invio
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && (e.target === usernameInput || e.target === passwordInput)) {
            e.preventDefault();
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Mostrar/nascondere password
    const togglePasswordButton = document.createElement('button');
    togglePasswordButton.type = 'button';
    togglePasswordButton.textContent = '👁️';
    togglePasswordButton.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        width: 24px;
        height: 24px;
    `;
    togglePasswordButton.setAttribute('aria-label', 'Mostra/nascondi password');

    if (passwordInput) {
        const passwordContainer = passwordInput.parentElement;
        passwordContainer.style.position = 'relative';
        passwordContainer.appendChild(togglePasswordButton);

        togglePasswordButton.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                this.textContent = '👁️';
            }
        });
    }

    // Auto-focus sul primo campo vuoto
    if (usernameInput && !usernameInput.value) {
        usernameInput.focus();
    } else if (passwordInput && !passwordInput.value) {
        passwordInput.focus();
    }

    // Prevenir doble envío del formulario
    let formSubmitted = false;
    if (loginForm) {
        loginForm.addEventListener('submit', function() {
            if (formSubmitted) {
                return false;
            }
            formSubmitted = true;
            
            // Reset después de un tiempo como fallback
            setTimeout(() => {
                formSubmitted = false;
                const submitButton = this.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Accedi';
                    submitButton.style.opacity = '1';
                }
            }, 5000);
        });
    }
});