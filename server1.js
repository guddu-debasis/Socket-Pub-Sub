import express from "express";
import { createServer } from "node:http"; 
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { connect } from "nats";
import { createAdapter } from "@mickl/socket.io-nats-adapter";

const app = express();
const server = createServer(app);

const nc = await connect({ servers: "nats://localhost:4222" });
const io = new Server(server, { adapter: createAdapter(nc) });

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log(`user:${socket.id} is connected and online`);

  socket.on('chat message', (msg) => {
    console.log(`user:${socket.id} sent message: ${msg}`);
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log(`user:${socket.id} disconnected`);
  });
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
