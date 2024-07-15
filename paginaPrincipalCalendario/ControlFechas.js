let celdaSeleccionada;
let currentMonth; 

document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('.cell');

    cells.forEach(function (cell) {
        cell.addEventListener('click', function () {
            const cellText = cell.textContent.trim();

            // Evitar seleccionar celdas vacías
            if (cellText !== '') {
                const cellNumber = parseInt(cellText);
                // Remover la clase 'selected' de todas las celdas
                cells.forEach(function (otherCell) {
                    if (otherCell !== cell) {
                        otherCell.classList.remove('selected');
                    }
                });

                console.log(`Celda clickeada: ${cellNumber}`);
                cell.classList.toggle('selected');

                // Obtener el mes y día desde el texto del mes actual
                const currentMonth = document.getElementById('current-month').textContent.trim();
                const day = cellNumber;

                obtenerEventosDelDia(currentMonth, day);
            }
        });
    });


    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    let currentMonthIndex = 0; // Índice del mes actual
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthSpan = document.getElementById('current-month');
    const background = document.querySelector('.background');

    // Evento de cambio de mes al hacer clic en los botones
    function showPreviousMonth() {
        currentMonthIndex = (currentMonthIndex - 1 + months.length) % months.length;
        updateMonth();
    }

    function showNextMonth() {
        currentMonthIndex = (currentMonthIndex + 1) % months.length;
        updateMonth();
    }


    // Actualización del mes mostrado en pantalla
    function updateMonth() {
        currentMonth = months[currentMonthIndex]; // Actualizar el mes global
        console.log(`Mes actual: ${currentMonth}`); // Mostrar el mes actual en la consola
        currentMonthSpan.textContent = currentMonth;
        background.style.backgroundImage = getBackgroundForMonth(currentMonth);
        currentMonthSpan.classList.add('animate-month');
        setTimeout(() => {
            currentMonthSpan.classList.remove('animate-month');
        }, 1000);
        mostrarDiasDelMes(currentMonth); // Llamada a la función para mostrar los días del mes
    }

    // Función para obtener la imagen de fondo según el mes
    function getBackgroundForMonth(monthName) {
        monthName = monthName.toLowerCase();
        if (monthName === 'enero' || monthName === 'febrero' || monthName === 'diciembre') {
            return `url('imagenes/verano.jpg')`;
        } else if (monthName === 'marzo' || monthName === 'abril' || monthName === 'mayo') {
            return `url('imagenes/otono.jpg')`;
        } else if (monthName === 'junio' || monthName === 'julio' || monthName === 'agosto') {
            return `url('imagenes/invierno.jpg')`;
        } else if (monthName === 'septiembre' || monthName === 'octubre' || monthName === 'noviembre') {
            return `url('imagenes/primavera.jpg')`;
        } else {
            return `url('imagenes/invierno.jpg')`;
        }
    }

    // Event listeners para los botones de cambio de mes
    prevMonthBtn.addEventListener('click', showPreviousMonth);
    nextMonthBtn.addEventListener('click', showNextMonth);

    // Mostrar el mes actual y establecer el fondo inicial
    currentMonthSpan.textContent = months[currentMonthIndex];
    background.style.backgroundImage = getBackgroundForMonth(months[currentMonthIndex]);
});

const meses = {
    Enero: ',,,,,,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
    Febrero: ',,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28',
    Marzo: ',,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
    Abril: ',,,,,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30',
    Mayo: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
    Junio: ',,,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30',
    Julio: ',,,,,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
    Agosto: ',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
    Septiembre: ',,,,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30',
    Octubre: ',,,,,,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
    Noviembre: ',,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30',
    Diciembre: ',,,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31'
  };

  function mostrarDiasDelMes(mes) {
    const celdas = document.querySelectorAll('.cell');
    const dias = meses[mes].split(',');
  
    // Limpiamos el contenido anterior de las celdas
    celdas.forEach((celda) => {
      celda.textContent = '';
      celda.dataset.day = '';
      celda.classList.remove('current-day');
    });
  
    celdas.forEach((celda, index) => {
      const diaActual = dias[index].trim(); // Eliminamos espacios en blanco
  
      celda.textContent = diaActual || ''; // Mostramos el número o vacío si no hay número
  
      if (diaActual === new Date().getDate().toString()) {
        celda.classList.add('current-day');
      }
    });
  }

  function obtenerEventosDelDia(month, day) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `obtenerEventosDelDia.php?month=${month}&day=${day}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                mostrarEventosEnTimeSlot(xhr.responseText);
            } else {
                console.log('Error al obtener eventos:', xhr.responseText);
            }
        }
    };
    xhr.send();
}

function mostrarEventosEnTimeSlot(eventos) {
    const timeSlot = document.querySelector('.time-slot');
    timeSlot.innerHTML = ''; // Limpiar el contenido existente

    const eventosArray = eventos.split(','); // Otra forma de recibir los datos
    eventosArray.forEach(function (evento) {
        const eventoDiv = document.createElement('div');
        eventoDiv.textContent = evento;
        timeSlot.appendChild(eventoDiv);
    });
}