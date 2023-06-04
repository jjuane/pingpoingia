const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Crea una sala de juego
const room = "pingpong";

// Maneja la conexión del jugador
io.on("connection", socket => {
  console.log("Un jugador se ha conectado");

  // Une al jugador a la sala de juego
  socket.join(room);

  // Crea un objeto de jugador para el nuevo jugador
  const player = {
    id: socket.id,
    name: "",
    leftPaddleY: canvas.height / 2 - paddleHeight / 2,
    score: 0
  };

  // Maneja el evento de nombre del jugador
  socket.on("name", name => {
    player.name = name;
    console.log(`El jugador ${name} se ha unido a la sala`);
    // Transmite la información del jugador a los demás jugadores en la sala
    socket.to(room).emit("playerJoin", player);
  });

  // Maneja el evento de desconexión del jugador
  socket.on("disconnect", () => {
    console.log(`El jugador ${player.name} se ha desconectado`);
    // Transmite la información del jugador a los demás jugadores en la sala
    socket.to(room).emit("playerLeave", player);
  });

  // Maneja el evento de movimiento de la raqueta del jugador
  socket.on("paddleMove", leftPaddleY => {
    player.leftPaddleY = leftPaddleY;
    // Transmite la información del jugador a los demás jugadores en la sala
    socket.to(room).emit("playerUpdate", player);
  });

  // Maneja el evento de puntuación del jugador
  socket.on("score", score => {
    player.score = score;
    // Transmite la información del jugador a los demás jugadores en la sala
    socket.to(room).emit("playerUpdate", player);
  });
});

// Inicia el servidor
http.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
