var oglasimodul = require('servis')
var express = require('express')
const { request } = require('http')

var server = express()
const port = 3000

server.use (express.urlencoded({extended: false}))
server.use(express.json())

server.get('/',(request, response)=>{
    response.send("Server OGLASI radi");
});

server.get('/svioglasi',(request, response)=>{
    response.send(oglasimodul.lista)
});

server.post('/dodajoglas',(request,response)=>{
    oglasimodul.dodavanje(request.body)
    response.end("OK")
})

server.delete('/obrisioglas/:id',(request, response)=>{
    oglasimodul.brisanje(request.params["id"]);
    response.end("OK");
});

server.get('/getoglasbyid/:id',(request, response)=>{
    response.send(oglasimodul.vratiId(request.params["id"]));
})

server.get('/filtrirajPoKategoriji',(request,response)=>{
    response.send(oglasimodul.filtriranje(request.query["kategorija"]))
})

server.post("/izmeniOglas/:id", (request, response) =>{
    oglasimodul.izmena(request.body)
})

server.listen(port, () => {console.log('server radi')} )