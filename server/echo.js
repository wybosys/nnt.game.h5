var io = require('socket.io')(80);
io.on('connection', function(socket) {
    socket.on('echo', function(data) {
        console.log(data);
        socket.send('echo', data);
    });
});
