 
function createEventButton(eventName) {
    console.log('Creando botón para:', eventName);
    const buttonElement = document.createElement('button');
    buttonElement.textContent = eventName;
    buttonElement.classList.add('event-button');
    
    // Agregar el botón al día de eventos
    dayEventsList.appendChild(buttonElement);

    buttonElement.addEventListener('click', function () {
        buttonElement.classList.toggle('selected');
        const isSelected = buttonElement.classList.contains('selected');

        if (isSelected) {
            const eventName = buttonElement.textContent;
            console.log('Nombre del evento seleccionado:', eventName);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Variables para la primera parte del script
    const addEventButton = document.getElementById('add-event-btn');
    const viewEvents = document.getElementById('view-events');
    const eventOverlay = document.getElementById('eventOverlay');
    const closeOverlay = document.getElementById('closeOverlay');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const deletealleventbtn = document.getElementById('delete-all-event-btn');

    // Variables para la segunda parte del script
    const dayEventsOverlay = document.getElementById('dayEventsOverlay');
    const closeDayEventsOverlay = document.getElementById('closeDayEventsOverlay');
    const deleteEventButtonDay = document.getElementById('delete-event-btn');
   
    // Añade eventos para la primera parte del script
    addEventButton.addEventListener('click', function () {
        showEventOverlay();
    });

    closeOverlay.addEventListener('click', function () {
        hideEventOverlay();
    });

    viewEvents.addEventListener('click', function () {
        showDayEventsOverlay();
    });

    closeDayEventsOverlay.addEventListener('click', function () {
        hideDayEventsOverlay();
    });
    
    saveEventBtn.addEventListener('click', function () {
        const eventName = document.getElementById('eventName').value;
        const selectedCell = document.querySelector('.cell.selected');
    
        if (!selectedCell) {
            console.log('Por favor, seleccione una celda para el evento');
            return;
        }
    
        const day = selectedCell.textContent.trim();
        const month = currentMonth; // Utiliza el mes global que está siendo mostrado
    
        saveEvent(eventName, day, month)
            .then(function (response) {
                console.log('Respuesta del servidor:', response);
                
                // Después de guardar, vuelve a obtener los eventos actualizados
                getDayEvents(month, day)
                    .then(function (events) {
                        updateDayEventsList(events);
                    })
                    .catch(function (error) {
                        console.error('Error al obtener eventos después de guardar:', error);
                    });
    
                hideEventOverlay();
                console.log('Evento guardado:', eventName, 'en el día', day, 'del mes', month);
            })
            .catch(function (error) {
                console.error('Error al guardar el evento:', error);
            });
    });

    deleteEventButtonDay.addEventListener('click', function () {
        console.log('Delete Event button clicked');
        deleteSelectedEvent();
    });

    function showEventOverlay() {
        eventOverlay.style.display = 'block';
    }

    function hideEventOverlay() {
        eventOverlay.style.display = 'none';
    }

    function showDayEventsOverlay() {
        console.log('Showing Day Events Overlay');
    
        const selectedCell = document.querySelector('.cell.selected');
    
        if (!selectedCell) {
            console.log('Por favor, seleccione una celda para ver los eventos');
            return;
        }
    
        const day = selectedCell.textContent.trim();
        const month = currentMonth; // Utiliza el mes global que está siendo mostrado
    
        getDayEvents(month, day)
            .then(function (events) {
                updateDayEventsList(events);
                dayEventsOverlay.style.display = 'block';
                dayEventsOverlay.style.zIndex = '3';
                dayEventsOverlay.style.opacity = '1';  // Añade este estilo
            })
            .catch(function (error) {
                console.error('Error al obtener eventos del día:', error);
            });
    }
    

    function hideDayEventsOverlay() {
        console.log('Hiding Day Events Overlay');
        dayEventsOverlay.style.display = 'none';
    }

    function deleteSelectedEvent() {
        console.log('Delete Event button clicked');
        console.log('Eliminando eventos seleccionados');
        const selectedEventButtons = document.querySelectorAll('.event-button.selected');
    
        if (selectedEventButtons.length > 0) {
            const selectedCell = document.querySelector('.cell.selected');
            const day = selectedCell.textContent.trim();
            const month = currentMonth; // Utiliza el mes global que está siendo mostrado
    
            selectedEventButtons.forEach((selectedEventButton) => {
                const eventName = selectedEventButton.textContent.trim();
    
                // Llama a la función para eliminar el evento seleccionado
                eliminarEventoSeleccionado(month, day, eventName)
                    .then(function () {
                        // Después de eliminar, vuelve a obtener los eventos actualizados
                        getDayEvents(month, day)
                            .then(function (events) {
                                updateDayEventsList(events);
                            })
                            .catch(function (error) {
                                console.error('Error al obtener eventos después de eliminar:', error);
                            });
                    })
                    .catch(function (error) {
                        console.error('Error al eliminar el evento seleccionado:', error);
                    });
    
                // Elimina el botón del evento
                selectedEventButton.remove();
                console.log('Evento eliminado:', eventName, 'del día', day, 'del mes', month);
            });
    
            // Actualiza la lista después de eliminar
            updateDayEvents();
        } else {
            console.log('Por favor, seleccione al menos un evento para eliminar');
        }
    }
    
    
    deletealleventbtn.addEventListener('click', function () {
        console.log('Delete all Event button clicked');
        const selectedCell = document.querySelector('.cell.selected');
    
        if (!selectedCell) {
            console.log('Por favor, seleccione una celda para eliminar el evento');
            return;
        }
    
        const day = selectedCell.textContent.trim();
        const month = currentMonth; // Utiliza el mes global que está siendo mostrado
        console.log('Mes y día:', month, day); // Agrega un log para verificar los valores
    
        eliminarEventosDelDia(month, day);
    });
    

    function saveEvent(eventName, day, month) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'guardarEvento.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        console.log('Respuesta del servidor:', xhr.responseText);
                        resolve(xhr.responseText);  // Resolvemos la promesa con la respuesta del servidor
                    } else {
                        console.log('Error al guardar el evento:', xhr.responseText);
                        reject(xhr.responseText);  // Rechazamos la promesa con el mensaje de error
                    }
                }
            };
    
            xhr.send(`eventName=${eventName}&day=${day}&month=${month}`);
        });
    }
});

function eliminarEventosDelDia(month, day) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'eliminarEventos.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Eventos eliminados:', xhr.responseText);
                // Aquí puedes agregar cualquier lógica adicional después de eliminar los eventos
            } else {
                console.log('Error al eliminar eventos:', xhr.responseText);
            }
        }
    };
    console.log('Enviando datos:', `month=${month}&day=${day}`); // Verifica los datos que se envían

    xhr.send(`month=${month}&day=${day}`);
}

function eliminarEventoSeleccionado(month, day, eventName) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'eliminarSeleccionado.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Evento seleccionado eliminado:', xhr.responseText);
                // Actualiza la lista después de eliminar el evento seleccionado
                getDayEvents(month, day).then(function (events) {
                    updateDayEventsList(events);
                });
            } else {
                console.log('Error al eliminar el evento seleccionado:', xhr.responseText);
            }
        }
    };

    xhr.send(`month=${month}&day=${day}&eventName=${eventName}`);
}
function getDayEvents(month, day) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `obtenerEventosDelDia.php?month=${month}&day=${day}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const eventos = JSON.parse(xhr.responseText);
                    resolve(eventos);
                } else {
                    reject('Error al obtener eventos:', xhr.responseText);
                }
            }
        };
        xhr.send();
    });
}

function updateDayEventsList(events) {
    // Limpiar el contenido existente
    dayEventsList.innerHTML = '';

    // Verificar si events es un array y tiene elementos
    if (Array.isArray(events) && events.length > 0) {
        // Crear botones para cada evento
        events.forEach(function (event) {
            // Verificar si event tiene la propiedad nombre_evento
            if (event.nombre_evento) {
                createEventButton(event.nombre_evento.trim());
            } else {
                console.error('El evento no tiene la propiedad nombre_evento:', event);
            }
        });
    } else {
        console.log('No hay eventos para mostrar');
    }
}


