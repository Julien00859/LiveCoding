var http = require("http").createServer();
var io = require("socket.io")(http);
var fs = require("fs"); // File System

http.on("request", function(req, res) {
  // Si on peut servir le fichier
  if (["/client.html", "/host.html", "/js/client.js", "/js/host.js", "/js/utils.js", "/socket.io/socket.io.js", "/css/style.css"].indexOf(req.url) !== -1) {
    res.statusCode = 200;

    // On selectionne le header à mettre
    switch (req.url) {
      case "/client.html":
      case "/host.html":
        res.setHeader("Content-Type", "text/html");
        break;
      case "/js/clients.js":
      case "/js/host.js":
      case "/js/utils.js":
        res.setHeader("Content-Type", "text/javascript");
        break;
      case "/css/style.css":
        res.setHeader("Content-Type", "text/css");
        break;
    }
    // Puis on envoie le fichier
    fs.readFile(__dirname + req.url, function(err, data){
      if (!err) res.end(data);
    })
  } else {

    // Une erreur 404
    console.log("404: " + req.url);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/raw");
    res.end();
  }
}).listen(59600, function() {
  console.log("listening on *:59600");
});

io.on('connection', function(socket){
  console.log('a user connected');
});
