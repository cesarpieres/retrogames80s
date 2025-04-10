// frogger.js - PIERES POWERED

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 48; // 14x16 tiles grid (672x768)
const gridWidth = 14;
const gridHeight = 16;

let frog = { x: 6, y: 15, lives: 5 };
let level = 1;
let gameRunning = false;

let cars = [];
let logs = [];
let crocs = [];

function startGame() {
  frog = { x: 6, y: 15, lives: 5 };
  level = 1;
  gameRunning = true;
  spawnObstacles();
  updateHUD();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  startGame();
}

function updateHUD() {
  document.getElementById("vidas").innerText = "Vidas: " + frog.lives;
  document.getElementById("nivel").innerText = "Nivel: " + level;
}

function drawFrog() {
  ctx.fillStyle = "lime";
  ctx.fillRect(frog.x * tileSize, frog.y * tileSize, tileSize, tileSize);
}

function drawCars() {
  ctx.fillStyle = "red";
  for (let car of cars) {
    ctx.fillRect(car.x * tileSize, car.y * tileSize, tileSize, tileSize);
  }
}

function drawLogs() {
  ctx.fillStyle = "saddlebrown";
  for (let log of logs) {
    ctx.fillRect(log.x * tileSize, log.y * tileSize, tileSize * 2, tileSize);
  }
}

function drawCrocs() {
  for (let i = 0; i < crocs.length; i++) {
    ctx.fillStyle = i % 2 === 0 ? "yellow" : "violet";
    let croc = crocs[i];
    ctx.fillRect(croc.x * tileSize, croc.y * tileSize, tileSize, tileSize);
  }
}
}

function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  moveObstacles();
  checkCollisions();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLogs();
  drawCars();
  drawCrocs();
  drawFrog();
}

function moveObstacles() {
  for (let car of cars) {
    car.x += car.speed;
    if (car.x < -1) car.x = gridWidth;
    if (car.x > gridWidth) car.x = -1;
  }

  for (let log of logs) {
    log.x += log.speed;
    if (log.x < -2) log.x = gridWidth;
    if (log.x > gridWidth) log.x = -2;
  }

  for (let croc of crocs) {
    croc.x += croc.speed;
    if (croc.x < -1) croc.x = gridWidth;
    if (croc.x > gridWidth) croc.x = -1;
  }
}

function checkCollisions() {
  for (let car of cars) {
    if (car.y === frog.y && Math.abs(car.x - frog.x) < 1) {
      loseLife();
      return;
    }
  }

  for (let croc of crocs) {
    if (croc.y === frog.y && Math.abs(croc.x - frog.x) < 1) {
      loseLife();
      return;
    }
  }

  if (frog.y >= 5 && frog.y <= 7) {
    let onLog = logs.some(log => log.y === frog.y && frog.x >= log.x && frog.x < log.x + 2);
    if (!onLog) {
      loseLife();
      return;
    }
  }

  if (frog.y < 5) {
    level++;
    frog.y = 15;
    spawnObstacles();
    updateHUD();
  }
}

function loseLife() {
  frog.lives--;
  frog.x = 6;
  frog.y = 15;
  updateHUD();
  if (frog.lives <= 0) {
    gameRunning = false;
    alert("GAME OVER - Nivel alcanzado: " + level);
  }
}

function spawnObstacles() {
  cars = [];
  logs = [];
  crocs = [];
  for (let i = 0; i < 5; i++) {
    cars.push({ x: Math.floor(Math.random() * gridWidth), y: 13 - i, speed: i % 2 === 0 ? -0.1 - level * 0.01 : 0.1 + level * 0.01 });
  }
  for (let i = 0; i < 4; i++) {
    logs.push({ x: Math.floor(Math.random() * gridWidth), y: 6 - i, speed: i % 2 === 0 ? 0.05 + level * 0.005 : -0.05 - level * 0.005 });
  }
  if (level >= 2) {
    for (let i = 0; i < level; i++) {
      crocs.push({ x: Math.floor(Math.random() * gridWidth), y: 3 + (i % 2), speed: (i % 2 === 0 ? 0.05 : -0.05) * level });
    }
  }
}

document.addEventListener("keydown", e => {
  if (!gameRunning) return;
  if (e.key === "ArrowUp") frog.y--;
  if (e.key === "ArrowDown") frog.y++;
  if (e.key === "ArrowLeft") frog.x--;
  if (e.key === "ArrowRight") frog.x++;
  frog.x = Math.max(0, Math.min(gridWidth - 1, frog.x));
  frog.y = Math.max(0, Math.min(gridHeight - 1, frog.y));
});
