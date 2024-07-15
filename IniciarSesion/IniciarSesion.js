// Función para enviar el formulario mediante AJAX
function submitForm() {
  console.log('Formulario enviado'); // Puedes dejar o quitar esta línea según necesites

  // Obtener los valores de los campos
  var nombre = document.getElementById('nombre').value;
  var password = document.getElementById('password').value;

  // Realizar una solicitud AJAX para enviar los datos
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'ProcesarInicioSesion.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Establecer encabezado para datos codificados en URL
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);

      if (response.success) {
        // Inicio de sesión exitoso
        alert("Inicio de sesión exitoso");
        window.location.href = "../PaginaPrincipalCalendario/paginaPrincipal.html";
      } else {
        // Inicio de sesión fallido, mostrar mensaje de error al usuario
        alert(response.error);
        // También puedes borrar el contenido del cuadro de contraseña si es necesario
        document.getElementById('password').value = '';
      }
    } else {
      // Manejar otros estados de la solicitud si es necesario
      console.error('Error en la solicitud AJAX');
    }
  };

  // Codificar datos para enviarlos como parte del cuerpo de la solicitud
  var data = 'nombre=' + encodeURIComponent(nombre) + '&password=' + encodeURIComponent(password);

  // Enviar la solicitud con los datos
  xhr.send(data);
}

// Función para manejar el clic en el botón de retroceso
function goBack() {
  var backButton = document.getElementById('backButton');
  backButton.style.transform = 'scale(1.1)';

  setTimeout(function () {
    backButton.style.transform = 'scale(1)';
  }, 200);
}
