# Proyecto NodeJS + Redis cache
## Install and Run Redis Server
brew install redis
redis-server

 

10% de posibilidades de fallar:
http://localhost:3000/api/search?query=auckland

 



Se almacena el error en redis en api.erros

const datetime = Date.now();
    if (Math.random(0, 1) < 0.1){
        client.set(`api.errors:${datetime}`,'How unfortunate! The API Request Failed');
        return res.json('How unfortunate! The API Request Failed'); 
    } 
    



DarkSky, se debe crear un APIKEY en darksky.net

 

Generate Gitignore
https://www.gitignore.io/api/node,redis

