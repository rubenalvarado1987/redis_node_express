const { io } = require('../server');
const redis = require('redis');
const clientDb = redis.createClient();
const axios = require('axios');


io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido al socket del tiempo'
    });



    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    //Build darkSky + Secret Key
    const searchUrl = 'https://api.darksky.net/forecast/7c3b7bd05324e39b0e595c26d50d99f5/';


    // Escuchar el cliente

    client.on('getTime', (data, callback) => {

        //Cada request al socket tiene un 10% de chances de fallar 
        //Se debe guardar el registro.
        const datetime = Date.now();
        if (Math.random(0, 1) < 0.1) {
            const msgErr = 'error provocated';
            clientDb.set(`api.errors:${datetime}`, msgErr);
            client.emit('getTime', { err: msgErr });
        }
        else {

            clientDb.get(`${data.utc}`, (err, result) => {
                // If that key exist in Redis store
                if (result) {
                    //console.log('resultdb: ',result);
                    axios.get(searchUrl + result)
                        .then(response => {
                            var responseJson = response.data;
                            client.emit('getTime', { data: responseJson, ciudad: data.utc });
                        })
                        .catch(err => {
                            //console.log('err:',err);
                        });

                    setInterval(() => { // ejecutamos un emit cada 10 segundos del mismo axios
                        axios.get(searchUrl + result)
                            .then(response => {
                                var responseJson = response.data;
                                client.emit('getTime', { data: responseJson, ciudad: data.utc });
                            })
                            .catch(err => {
                                //console.log('err:',err);
                            });
                    }, 10000);
                }
            });
        }

    });

});