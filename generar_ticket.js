document.addEventListener('DOMContentLoaded', () => {
    let cola = JSON.parse(localStorage.getItem('cola')) || [];
    let cajas = JSON.parse(localStorage.getItem('cajas')) || [null, null, null, null, null, null];
    let historial = JSON.parse(localStorage.getItem('historial')) || [];

    function reproducirVoz(texto) {
        const utterance = new SpeechSynthesisUtterance(texto);
        window.speechSynthesis.speak(utterance);
    }
    function mostrarAnuncio(mensaje) {
        document.getElementById('anuncio').innerText = mensaje;
    }

    function actualizarCola() {
        const colaDiv = document.getElementById('cola');
        colaDiv.innerHTML = '';
        cola.forEach(cliente => {
            const clienteDiv = document.createElement('div');
            clienteDiv.className = 'cliente';
            clienteDiv.style.backgroundColor = cliente.color;
            clienteDiv.innerText = 'C' + cliente.id;
            colaDiv.appendChild(clienteDiv);
        });
    }

    function actualizarEstadoCajas() {
        for (let i = 0; i < cajas.length; i++) {
            const cajaDiv = document.getElementById('estadoCaja' + (i + 1));
            if (cajas[i]) {
                cajaDiv.classList.remove('desocupada');
                cajaDiv.classList.add('ocupada');
                cajaDiv.innerText = `Caja ${i + 1}: Ocupada con ticket ${cajas[i].id}`;
            } else {
                cajaDiv.classList.remove('ocupada');
                cajaDiv.classList.add('desocupada');
                cajaDiv.innerText = `Caja ${i + 1}: Desocupada`;
            }
        }
    }

    function generarCliente() {
        const numeroCliente = obtenerNumeroCliente();
        const cliente = { id: numeroCliente, color: '#FF0000' };
        cola.push(cliente);
        localStorage.setItem('cola', JSON.stringify(cola));
        actualizarCola();
        actualizarNumeroCliente(numeroCliente + 1);
    }

    function entregarTicket() {
        if (cola.length === 0) {
            alert('No hay clientes en espera.');
            return;
        }

        const cliente = cola.shift();
        localStorage.setItem('ticketActual', cliente.id);
        document.getElementById('ticketDisplay').innerText = `Ticket: ${cliente.id}`;
        
        const mensajeTicket = `Ticket número ${cliente.id} entregado.`;
        reproducirVoz(mensajeTicket);
        mostrarAnuncio(mensajeTicket);

        historial.push(cliente.id);
        localStorage.setItem('historial', JSON.stringify(historial));
        actualizarHistorial();

        actualizarCola();
        actualizarEstadoCajas();
    }

    function reiniciarCola() {
        localStorage.removeItem('cola');
        localStorage.removeItem('ticketActual');
        localStorage.removeItem('historial');
        actualizarNumeroCliente(1);
        document.getElementById('ticketDisplay').innerText = 'Ticket: 0';
        
        const mensajeReinicio = 'La cola ha sido reiniciada.';
        mostrarAnuncio(mensajeReinicio);

        actualizarCola();
        actualizarEstadoCajas();
        actualizarHistorial();
    }

    function actualizarNumeroCliente(nuevoNumero) {
        localStorage.setItem('numeroCliente', nuevoNumero);
    }

    function obtenerNumeroCliente() {
        let numeroCliente = parseInt(localStorage.getItem('numeroCliente')) || 1;
        if (cola.length > 0) {
            numeroCliente = Math.max(numeroCliente, cola[cola.length - 1].id + 1);
        }
        return numeroCliente;
    }

    function getRandomColor() {
        const letters = '';
        let color = '#FF0000';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function actualizarHistorial() {
        const historialDiv = document.getElementById('historial');
        historialDiv.innerHTML = '';
        historial.forEach(id => {
            const historialItem = document.createElement('div');
            historialItem.className = 'historial-item';
            historialItem.innerText = `Ticket ${id}`;
            historialDiv.appendChild(historialItem);
        });
    }

    document.getElementById('generarClienteBtn').addEventListener('click', generarCliente);
    document.getElementById('entregarTicketBtn').addEventListener('click', entregarTicket);
    document.getElementById('reiniciarBtn').addEventListener('click', reiniciarCola);

    actualizarCola();
    actualizarEstadoCajas();
    actualizarHistorial(); 
});
