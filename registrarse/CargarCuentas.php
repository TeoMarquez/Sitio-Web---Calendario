<?php
// Verificar si se han enviado los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Establecer conexión con la base de datos
    $servername = "localhost"; // Puede variar según tu configuración
    $username = "root"; // Tu nombre de usuario de MySQL
    $password = "12345678"; // Tu contraseña de MySQL
    $dbname = "calendario"; // El nombre de tu base de datos

    // Crear conexión utilizando PDO
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // Establecer el modo de error PDO en excepción
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Obtener los valores del formulario
        $nombre = $_POST['nombre'];
        $correo = $_POST['email']; // Cambiar a 'correo'
        $password = $_POST['password'];

        // Comprobar si la contraseña coincide con la confirmación de la contraseña
        if ($_POST['password'] !== $_POST['confirm-password']) {
            echo "Las contraseñas no coinciden";
        } else {
            // Verificar si el nombre de usuario ya existe en la base de datos
            $stmt = $conn->prepare("SELECT * FROM cuentas WHERE nombre = :nombre");
            $stmt->bindParam(':nombre', $nombre);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo "El nombre de usuario ya está en uso";
            } else {
                // Insertar datos en la base de datos
                $sql_insert = "INSERT INTO cuentas (nombre, correo, contrasena) VALUES (:nombre, :correo, :password)";
                $stmt_insert = $conn->prepare($sql_insert);
                $stmt_insert->bindParam(':nombre', $nombre);
                $stmt_insert->bindParam(':correo', $correo); // Cambiar a 'correo'
                $stmt_insert->bindParam(':password', $password);

                if ($stmt_insert->execute()) {
                    echo "Registro exitoso";
                    header('Location: ../IniciarSesion/IniciarSesion.html'); // Redirige a la página de inicio de sesión
                    exit(); // Termina la ejecución del script después de la redirección
                } else {
                    echo "Error en el registro";
                }
            }
        }
    } catch(PDOException $e) {
        echo "Error en la conexión: " . $e->getMessage();
    }

    // Cerrar conexión
    $conn = null;
}
?>
