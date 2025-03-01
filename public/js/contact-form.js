document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevenir el envío predeterminado del formulario
  
      // Verificar el captcha
      var recaptchaResponse = grecaptcha.getResponse();
      if (recaptchaResponse.length === 0) {
        alert('Por favor, completa el captcha.');
        return;
      }
  
      // Obtener valores del formulario
      var nombre = document.getElementById('nombre').value;
      var texto = document.getElementById('texto').value;
      var telefono = document.getElementById('telefono').value;
      var mail = document.getElementById('mail').value;
      
      // Mostrar indicador de carga
      const submitButton = document.querySelector('.button-primary');
      const buttonText = submitButton.textContent;
      submitButton.textContent = 'Enviando...';
      submitButton.disabled = true;
      
      // Enviar datos a nuestra API
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          texto: texto,
          telefono: telefono,
          mail: mail
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('¡ÉXITO!', data);
          // Redirigir a la página de confirmación
          window.location.href = "index.html";
        } else {
          console.log('FALLIDO...', data.error);
          alert('No se pudo enviar el mensaje. Por favor, inténtalo más tarde.');
          submitButton.textContent = buttonText;
          submitButton.disabled = false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('No se pudo enviar el mensaje. Por favor, inténtalo más tarde.');
        submitButton.textContent = buttonText;
        submitButton.disabled = false;
      });
    });
  });