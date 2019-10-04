var http =  require('http')

http.createServer(function(req, res){
   res.end("Hello User How are your day?")
}).listen(8088);

console.log("Server de Pé. Rodando");