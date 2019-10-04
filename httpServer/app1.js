//busca tudo do express
const express = require("express")
//para não sobre escrever a variavel app, melhor definila com uma const
//cria uma copia do express
const app = express();

app.get("/", function(req, res){
    res.sendFile(__dirname + "/html/index.html")
})

app.get("/sobre", function(req, res){
    res.sendfile(__dirname + '/html/sobre.html')
})

app.get("/blog", function(req, res){
    res.send("Bem vindo a rota Blog")
})

//Rota com passagem de paramentros
app.get("/blog/:cargo/:nome", function(req, res){
    res.send(req.params.nome)
})

//sempre a ultima linha
app.listen(8088, function(){
    console.log("Servidor rodando na url http://localhost:8088");
});