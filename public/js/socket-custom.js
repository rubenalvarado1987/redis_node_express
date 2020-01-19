var socket = io();

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'ruben',
    mensaje: 'Hola...'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información de mensajeria
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor desde cliente:', mensaje);

});

// Escuchar información del tiempo
socket.on('getTime', function(data) {

    console.log('DarkSky:', data);

});