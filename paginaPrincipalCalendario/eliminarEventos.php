<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "root";
    $password = "12345678";
    $dbname = "calendario";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $month = $_POST['month'];
        $day = $_POST['day'];

        $stmt = $conn->prepare("DELETE FROM Eventos WHERE mes_id IN (SELECT id FROM meses WHERE nombre_mes = :month) AND dia = :day");
        $stmt->bindParam(':month', $month);
        $stmt->bindParam(':day', $day);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo "Eventos eliminados correctamente.";
        } else {
            echo "No se encontraron eventos para eliminar.";
        }
    } catch(PDOException $e) {
        echo "Error al eliminar eventos: " . $e->getMessage();
    }

    $conn = null;
}
?>
