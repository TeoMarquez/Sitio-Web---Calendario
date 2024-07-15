<?php
session_start(); // Iniciar la sesión si aún no está iniciada

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Establecer conexión con la base de datos
    $servername = "localhost"; // Tu servidor MySQL
    $username = "root"; // Tu nombre de usuario de MySQL
    $password = "12345678"; // Tu contraseña de MySQL
    $dbname = "calendario"; // Nombre de tu base de datos

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Obtener los datos del POST
        $month = $_POST['month'];
        $day = $_POST['day'];
        $eventName = $_POST['eventName'];
        $idCuenta = $_SESSION['id_cuenta']; // Obtener el ID de cuenta de la sesión

        // Eliminar el evento seleccionado
        $stmt = $conn->prepare("DELETE FROM Eventos WHERE mes_id IN (SELECT id FROM meses WHERE nombre_mes = :month) AND dia = :day AND nombre_evento = :eventName AND cuenta_id = :idCuenta");
        $stmt->bindParam(':month', $month);
        $stmt->bindParam(':day', $day);
        $stmt->bindParam(':eventName', $eventName);
        $stmt->bindParam(':idCuenta', $idCuenta);
        $stmt->execute();

        echo "Evento seleccionado eliminado correctamente.";
    } catch(PDOException $e) {
        echo "Error al eliminar el evento seleccionado: " . $e->getMessage();
    }

    // Cerrar la conexión
    $conn = null;
}
?>