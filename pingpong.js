// Obtener el canvas y el contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Definir las variables del juego
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 5;
let ballSpeedY = 5;
let paddleWidth = 10;
let paddleHeight = 80;
let paddleSpeed = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let leftScore = 0;
let rightScore = 0;

// Dibujar la pelota
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

// Dibujar las raquetas
function drawPaddles() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

// Dibujar la puntuación
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(leftScore, canvas.width / 2 - 50, 30);
  ctx.fillText(rightScore, canvas.width / 2 + 30, 30);
}

// Manejar el movimiento de las raquetas
function handlePaddleMovement() {
  if (keys[87] && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (keys[83] && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }
  if (keys[38] && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  } else if (keys[40] && rightPaddleY + paddleHeight < canvas.height) {
    rightPaddleY += paddleSpeed;
  }
}

// Detectar las colisiones de la pelota con las raquetas y los bordes del canvas
function handleCollisions() {
  // Colisión con las raquetas
  if (ballX - ballRadius <= paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  } else if (ballX + ballRadius >= canvas.width - paddleWidth && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }
  // Colisión con los bordes verticales
  if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  // Colisión con los bordes horizontales
  if (ballX - ballRadius <= 0) {
    rightScore++;
    resetBall();
  } else if (ballX + ballRadius >= canvas.width) {
    leftScore++;
    resetBall();
  }
}

// Resetear la posición de la pelota
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = -ballSpeedY;
}

// Actualizar la posición de la pelota y las raquetas en cada fotograma del juego
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  handlePaddleMovement();
  handleCollisions();
}

// Dibujar todo en el canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddles();
  drawScore();
}

// Escuchar los eventos del teclado
const keys = {};
document.addEventListener("keydown", event => {
  keys[event.keyCode] = true;
});
document.addEventListener("keyup", event => {
  delete keys[event.keyCode];
});

// Iniciar el bucle del juego
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Iniciar el juego
gameLoop();
