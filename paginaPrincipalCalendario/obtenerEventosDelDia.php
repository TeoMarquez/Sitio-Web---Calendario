<?php
session_start(); // Iniciar la sesión si aún no está iniciada

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Establecer conexión con la base de datos
    $servername = "localhost"; // Puede variar según tu configuración
    $username = "root"; // Tu nombre de usuario de MySQL
    $password = "12345678"; // Tu contraseña de MySQL
    $dbname = "calendario"; // El nombre de tu base de datos

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Obtener el día y el mes enviados por GET
        $day = isset($_GET['day']) ? $_GET['day'] : null;
        $monthName = isset($_GET['month']) ? $_GET['month'] : null;
        $idCuenta = isset($_SESSION['id_cuenta']) ? $_SESSION['id_cuenta'] : null; // Obtener el ID de cuenta de la sesión

        if ($day !== null && $monthName !== null && $idCuenta !== null) {
            // Obtener el ID del mes basado en el nombre del mes
            $stmtMonth = $conn->prepare("SELECT id FROM meses WHERE nombre_mes = :monthName");
            $stmtMonth->bindParam(':monthName', $monthName);
            $stmtMonth->execute();
            $resultMonth = $stmtMonth->fetch(PDO::FETCH_ASSOC);

            if ($resultMonth) {
                $monthId = $resultMonth['id']; // Obtener el ID del mes
                // Obtener los eventos del día para el mes, día y cuenta dados
                $stmtEvents = $conn->prepare("SELECT nombre_evento FROM Eventos WHERE mes_id = :monthId AND dia = :day AND cuenta_id = :idCuenta");
                $stmtEvents->bindParam(':monthId', $monthId);
                $stmtEvents->bindParam(':day', $day);
                $stmtEvents->bindParam(':idCuenta', $idCuenta);
                $stmtEvents->execute();
                $eventos = $stmtEvents->fetchAll(PDO::FETCH_ASSOC);

                // Devolver los eventos encontrados como respuesta (formato de lista)
                echo json_encode($eventos);  // Corregir aquí
            } else {
                echo "No se proporcionaron los parámetros necesarios.";
            }
        }
    } catch(PDOException $e) {
        echo "Error al obtener los eventos del día: " . $e->getMessage();
    }
    // Cerrar conexión
    $conn = null;
}
?>
