function goBack() {
    var backButton = document.getElementById('backButton');
    backButton.style.transform = 'scale(1.1)'; // Aumenta el tamaño al hacer clic
  
    // Después de 200 milisegundos (ajusta este valor según sea necesario)
    setTimeout(function() {
      backButton.style.transform = 'scale(1)'; // Devuelve al tamaño original
      // Agrega aquí la lógica para volver atrás en tu aplicación si es necesario
    }, 200);
  }
