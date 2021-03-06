// Importación de modulos
const express = require('express');
const responseTime = require('response-time');
const axios = require('axios');
const redis = require('redis');
const app = express();
const path = require('path');

// Cors
app.use(function (req, res, next) {

    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', true);
    res.header('Access-Control-Allow-Credentials', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});


// Modulos para el socket
const socketIO = require('socket.io');
const http = require('http');
const server = http.createServer(app);

// Creación y conexion a Redis en local instance.
const client = redis.createClient();

// Impresión de errores de conexion
client.on('error', (err) => {
    console.log("Error en la conexion a la DB" + err);
});

// Middleware que registra el tiempo de respuesta
app.use(responseTime());


// Se almacena en cliente el gd de las cuidades
client.set('santiago', '-33.4377968,-70.6504451');
client.set('zurich', '47.3723941,8.5423328');
client.set('auckland', '-36.852095,174.7631803');
client.set('sidney', '-33.8548157,151.2164539');
client.set('londres', '51.5073219,-0.1276474');
client.set('georgia', '32.3293809,-83.1137366');



const publicPath = path.resolve(__dirname, './public');
var port = process.env.PORT || 3000;

//WebApp local para pruebas
app.use(express.static(publicPath));


// api/search nombre de cuidad ej: http://localhost:3000/api/search?query=auckland
app.get('/api/search', (req, res) => {

    //Cada request a la API tiene un 10% de chances de fallar 
    //Se debe guardar el registro.
    const datetime = Date.now();
    if (Math.random(0, 1) < 0.1){
        client.set(`api.errors:${datetime}`,'How unfortunate! The API Request Failed');
        return res.json('How unfortunate! The API Request Failed'); 
    } 
    
    const query = (req.query.query).trim();
    console.log(query);

    // Build de Dark Sky API con APIKEY
    const searchUrl = 'https://api.darksky.net/forecast/f95878fd11fe427ed2a1505ae186d3ca/';


    return client.get(`${query}`, (err, result) => {
        // If that key exist in Redis store
        if (result) {
            console.log('searchUrl:', searchUrl + result);
            return axios.get(searchUrl + result)
                .then(response => {

                    //console.log('response the darksky: ',response);

                    const responseJSON = response.data;
                    return res.status(200).json({ source: 'Darksky API', ...responseJSON, });
                })
                .catch(err => {
                    return res.json(err);
                });
        }
    });
});

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});