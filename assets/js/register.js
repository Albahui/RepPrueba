document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    
    // Mostrar mensajes de error si están en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    if (error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = '❌ ' + decodeURIComponent(error);
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    if (success) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '✅ ' + decodeURIComponent(success);
        form.insertBefore(successDiv, form.firstChild);
    }
    
    // Validación en tiempo real
    form.addEventListener('submit', function(e) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('conferma_password').value;
        
        if (password !== confirmPassword) {
            e.preventDefault();
            alert('Le password non corrispondono!');
            return false;
        }
        
        if (password.length < 8) {
            e.preventDefault();
            alert('La password deve contenere almeno 8 caratteri!');
            return false;
        }
    });
});