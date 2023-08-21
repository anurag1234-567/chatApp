const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: "*"
    }
});

let users = [];

io.on('connection', (socket)=>{
   console.log(`user connected ${socket.id}`);

   socket.on('user-connect', (username)=>{
    users = [...users, { username, socketId: socket.id }];
    io.emit('active-users', users);
   })
   
   socket.on('disconnect', ()=>{
    users = users.filter( (user) => user.socketId !== socket.id);
    io.emit('active-users', users);
    console.log(`user disconnected ${socket.id}`);
   })

   socket.on('message', (data)=>{
     socket.broadcast.emit('message', data);
   })

})

app.get('/', (req,res)=>{
    res.send('hello user');
})

server.listen(4000, ()=>{
    console.log('This is main server is running');
})