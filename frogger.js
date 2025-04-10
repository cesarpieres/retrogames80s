// frogger.js - Arcade Touch Edition by César Pieres

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 300;
document.getElementById("game").appendChild(canvas);

const tileSize = 32;
let lives = 5;
let level = 1;
let gameRunning = false;

const frog = {
  x: 6 * tileSize,
  y: 15 * tileSize,
  width: tileSize,
  height: tileSize,
  reset() {
    this.x = 6 * tileSize;
    this.y = 15 * tileSize;
  }
};

const cars = [];
const logs = [];

function createObstacles() {
  cars.length = 0;
  logs.length = 0;
  for (let i = 0; i < 3; i++) {
    cars.push({ x: i * 160, y: 12 * tileSize, speed: 2 + level * 0.5 });
    cars.push({ x: i * 180, y: 11 * tileSize, speed: -2.5 - level * 0.4 });
    logs.push({ x: i * 180, y: 6 * tileSize, speed: -1.5 - level * 0.3 });
  }
}

function drawFrog() {
  ctx.fillStyle = "lime";
  ctx.fillRect(frog.x, frog.y, frog.width, frog.height);
}

function drawCars() {
  ctx.fillStyle = "red";
  for (let car of cars) {
    ctx.fillRect(car.x, car.y, tileSize * 2, tileSize);
  }
}

function drawLogs() {
  ctx.fillStyle = "saddlebrown";
  for (let log of logs) {
    ctx.fillRect(log.x, log.y, tileSize * 2, tileSize);
  }
}

function drawHUD() {
  ctx.fillStyle = "lime";
  ctx.font = "16px monospace";
  ctx.fillText("Vidas: " + lives, 10, 20);
  ctx.fillText("Nivel: " + level, canvas.width - 100, 20);
}

function update() {
  if (!gameRunning) return;

  for (let car of cars) {
    car.x += car.speed;
    if (car.speed > 0 && car.x > canvas.width) car.x = -tileSize * 2;
    if (car.speed < 0 && car.x < -tileSize * 2) car.x = canvas.width;
    if (collision(frog, { x: car.x, y: car.y, width: tileSize * 2, height: tileSize })) {
      loseLife();
    }
  }

  for (let log of logs) {
    log.x += log.speed;
    if (log.x < -tileSize * 2) log.x = canvas.width;
  }

  if (frog.y === 6 * tileSize) {
    const onLog = logs.some(log =>
      collision(frog, { x: log.x, y: log.y, width: tileSize * 2, height: tileSize })
    );
    if (!onLog) loseLife();
  }

  // Subiste todo y pasás de nivel
  if (frog.y < 5 * tileSize) {
    level++;
    saveGame();
    frog.reset();
    createObstacles();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFrog();
  drawCars();
  drawLogs();
  drawHUD();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function collision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function loseLife() {
  lives--;
  saveGame();
  if (lives <= 0) {
    gameRunning = false;
    alert("¡Game Over! 🎮");
    document.getElementById("resetButton").style.display = "inline-block";
  } else {
    frog.reset();
  }
}

function saveGame() {
  localStorage.setItem("nivel", level);
  localStorage.setItem("vidas", lives);
}

function loadGame() {
  level = parseInt(localStorage.getItem("nivel")) || 1;
  lives = parseInt(localStorage.getItem("vidas")) || 5;
  document.getElementById("vidas").innerText = "Vidas: " + lives;
  document.getElementById("nivel").innerText = "Nivel: " + level;
}

document.getElementById("insertButton").onclick = () => {
  loadGame();
  frog.reset();
  createObstacles();
  gameRunning = true;
  document.getElementById("vidas").innerText = "Vidas: " + lives;
  document.getElementById("nivel").innerText = "Nivel: " + level;
  document.getElementById("resetButton").style.display = "none";
};

document.getElementById("resetButton").onclick = () => {
  level = 1;
  lives = 5;
  saveGame();
  frog.reset();
  createObstacles();
  gameRunning = true;
  document.getElementById("resetButton").style.display = "none";
};

// Teclas
document.addEventListener("keydown", function (e) {
  if (!gameRunning) return;
  if (e.key === "ArrowUp") frog.y -= tileSize;
  if (e.key === "ArrowDown") frog.y += tileSize;
  if (e.key === "ArrowLeft") frog.x -= tileSize;
  if (e.key === "ArrowRight") frog.x += tileSize;
});

// Botones touch
document.querySelectorAll(".touch-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    if (!gameRunning) return;
    if (dir === "up") frog.y -= tileSize;
    if (dir === "down") frog.y += tileSize;
    if (dir === "left") frog.x -= tileSize;
    if (dir === "right") frog.x += tileSize;
  });
});

// Loading screen
setTimeout(() => {
  document.getElementById("loading").style.display = "none";
}, 4000);

// Orientación
function checkOrientation() {
  const rotateMsg = document.getElementById("rotate-message");
  if (window.innerHeight > window.innerWidth) {
    rotateMsg.style.display = "block";
  } else {
    rotateMsg.style.display = "none";
  }
}
window.addEventListener("resize", checkOrientation);
checkOrientation();

loop();
