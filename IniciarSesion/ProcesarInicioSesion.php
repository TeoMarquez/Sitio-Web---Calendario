<?php
session_start(); // Iniciar la sesión si aún no está iniciada

// Función para obtener el nombre de usuario o correo
function obtenerNombreUsuario($conn, $nombreOCorreo) {
    $stmt = $conn->prepare("SELECT nombre FROM cuentas WHERE nombre = :nombreOCorreo OR correo = :nombreOCorreo");
    $stmt->bindParam(':nombreOCorreo', $nombreOCorreo);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['nombre'];
}

// Función para obtener el ID de la cuenta
function obtenerIdCuenta($conn, $nombreOCorreo) {
    $stmt = $conn->prepare("SELECT id FROM cuentas WHERE nombre = :nombreOCorreo OR correo = :nombreOCorreo");
    $stmt->bindParam(':nombreOCorreo', $nombreOCorreo);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['id'];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Establecer conexión con la base de datos
    $servername = "localhost"; // Puede variar según tu configuración
    $username = "root"; // Tu nombre de usuario de MySQL
    $password = "12345678"; // Tu contraseña de MySQL
    $dbname = "calendario"; // El nombre de tu base de datos

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Obtener los valores del formulario
        $nombreOCorreo = $_POST['nombre'];
        $password = $_POST['password'];

        // Verificar si el nombre de usuario y la contraseña coinciden en la base de datos
        $stmt = $conn->prepare("SELECT * FROM cuentas WHERE (nombre = :nombreOCorreo OR correo = :nombreOCorreo) AND contrasena = :password");
        $stmt->bindParam(':nombreOCorreo', $nombreOCorreo);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Inicio de sesión exitoso, guardar información en la sesión
            $_SESSION['nombre_usuario'] = obtenerNombreUsuario($conn, $nombreOCorreo);
            $_SESSION['id_cuenta'] = obtenerIdCuenta($conn, $nombreOCorreo);
        
            // Enviar respuesta JSON al JavaScript
            echo json_encode(["success" => true]);
        } else {
            // Inicio de sesión fallido, enviar mensaje de error al JavaScript
            echo json_encode(["error" => "Nombre de usuario o contraseña incorrectos"]);
        }
    } catch(PDOException $e) {
        // Error en la conexión, enviar mensaje de error al JavaScript
        echo json_encode(["error" => "Error en la conexión: " . $e->getMessage()]);
    }

    // Cerrar conexión
    $conn = null;
}
?>
