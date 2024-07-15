<?php
session_start(); // Iniciar la sesión si aún no está iniciada

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
        $eventName = $_POST['eventName'];
        $day = $_POST['day'];
        $monthName = $_POST['month'];
        $nombreUsuario = $_SESSION['nombre_usuario']; // Obtener el nombre de usuario desde la sesión

        // Obtener el ID de la cuenta basado en el nombre de usuario
        $stmtUser = $conn->prepare("SELECT id FROM cuentas WHERE nombre = :nombre");
        $stmtUser->bindParam(':nombre', $nombreUsuario);
        $stmtUser->execute();
        $resultUser = $stmtUser->fetch(PDO::FETCH_ASSOC);

        // Obtener el ID del mes basado en el nombre del mes
        $stmtMonth = $conn->prepare("SELECT id FROM meses WHERE nombre_mes = :monthName");
        $stmtMonth->bindParam(':monthName', $monthName);
        $stmtMonth->execute();
        $resultMonth = $stmtMonth->fetch(PDO::FETCH_ASSOC);

        if ($resultUser && $resultMonth) {
            $accountId = $resultUser['id']; // Obtener el ID de la cuenta
            $monthId = $resultMonth['id']; // Obtener el ID del mes
            // Insertar el evento en la tabla de Eventos
            $stmt = $conn->prepare("INSERT INTO Eventos (nombre_evento, dia, cuenta_id, mes_id) VALUES (:eventName, :day, :accountId, :monthId)");
            $stmt->bindParam(':eventName', $eventName);
            $stmt->bindParam(':day', $day);
            $stmt->bindParam(':accountId', $accountId); // Usar el ID de la cuenta en lugar del nombre
            $stmt->bindParam(':monthId', $monthId); // Usar el ID del mes en lugar del nombre
            $stmt->execute();

            echo "Evento guardado exitosamente";
        } else {
            echo "No se encontró la cuenta o el mes asociados al evento.";
        }
    } catch(PDOException $e) {
        echo "Error al guardar el evento: " . $e->getMessage();
    }

    // Cerrar conexión
    $conn = null;
}
?>