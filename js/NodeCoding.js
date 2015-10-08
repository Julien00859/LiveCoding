var app = require("express")(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.on("write", function(ypos, xpos, text) {
        socket.broadcast.emit("write", ypos, xpos, text);
    });
    socket.on("erase", function(ypos, xpos, length) {
        socket.broadcast.emit("erase", ypos, xpos, length);
    });
    socket.on("cursor", function(ypos, xpos) {
        socket.broadcast.emit("cursor", ypos, xpos);
    });
    socket.on("setCoder", function(coder, link) {
        socket.broadcast.emit("setCoder", coder, link);
    });
    socket.on("setProject", function(project, link) {
        socket.broadcast.emit("setProject", project, link);
    });
    socket.on("setDesc", function(desc) {
        socket.broadcast.emit("setDesc", desc);
    });
    socket.on("setFile", function(file) {
        socket.broadcast.emit("setFile", file);
    });
});

server.listen(8080);
