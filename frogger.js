function handleLogCarry() {
  if (frog.y >= 5 && frog.y <= 7) {
    for (let log of logs) {
      if (log.y === frog.y && frog.x >= log.x && frog.x < log.x + 2) {
        frog.x += log.speed;
        // Corrige si el sapo se va fuera del canvas
        frog.x = Math.max(0, Math.min(gridWidth - 1, frog.x));
        break;
      }
    }
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

  // Verificamos si está sobre un tronco SOLO en las líneas de agua
  if (frog.y >= 5 && frog.y <= 7) {
    let onLog = logs.some(log => log.y === frog.y && frog.x >= log.x && frog.x < log.x + 2);
    if (!onLog) {
      loseLife();
      return;
    }
  }
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
