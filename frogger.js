let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let level = 1;
let lives = 5;
let frog = { x: 6, y: 15 };
let cars = [];
let interval;
let gridSize = 16;
let cellSize;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
    cellSize = Math.floor(canvas.width / gridSize);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawFrog() {
    ctx.fillStyle = "lime";
    ctx.fillRect(frog.x * cellSize, frog.y * cellSize, cellSize, cellSize);
}

function drawCars() {
    ctx.fillStyle = "brown";
    cars.forEach(c => {
        ctx.fillRect(c.x * cellSize, c.y * cellSize, cellSize, cellSize);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrog();
    drawCars();
}

function updateCars() {
    cars.forEach(c => {
        c.x += c.dir;
        if (c.x >= gridSize || c.x < 0) {
            c.x = c.dir > 0 ? 0 : gridSize - 1;
        }
    });
}

function gameLoop() {
    updateCars();
    checkCollision();
    draw();
}

function startLevel() {
    frog = { x: 6, y: gridSize - 1 };
    cars = [];

    for (let i = 0; i < level + 2; i++) {
        cars.push({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * (gridSize - 2)) + 1,
            dir: Math.random() < 0.5 ? 1 : -1
        });
    }

    if (interval) clearInterval(interval);
    interval = setInterval(gameLoop, Math.max(200 - level * 10, 50));
    updateInfo();
}

function moveFrog(dx, dy) {
    frog.x = Math.max(0, Math.min(gridSize - 1, frog.x + dx));
    frog.y = Math.max(0, Math.min(gridSize - 1, frog.y + dy));
    if (frog.y === 0) {
        level++;
        startLevel();
    }
    draw();
}

function checkCollision() {
    for (let c of cars) {
        if (c.x === frog.x && c.y === frog.y) {
            lives--;
            if (lives <= 0) {
                clearInterval(interval);
                alert("¡GAME OVER!\nNivel alcanzado: " + level);
                lives = 5;
                level = 1;
            }
            startLevel();
            break;
        }
    }
}

function updateInfo() {
    document.getElementById("vidas").textContent = `Vidas: ${lives}`;
    document.getElementById("nivel").textContent = `Nivel: ${level}`;
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") moveFrog(0, -1);
    if (e.key === "ArrowDown") moveFrog(0, 1);
    if (e.key === "ArrowLeft") moveFrog(-1, 0);
    if (e.key === "ArrowRight") moveFrog(1, 0);
});

document.getElementById("btnInsertCoin").addEventListener("click", () => {
    level = 1;
    lives = 5;
    startLevel();
});

document.getElementById("btnRestart").addEventListener("click", () => {
    level = 1;
    lives = 5;
    startLevel();
});

["btnUp", "btnDown", "btnLeft", "btnRight"].forEach(id => {
    document.getElementById(id).addEventListener("click", () => {
        const dirs = {
            btnUp: [0, -1],
            btnDown: [0, 1],
            btnLeft: [-1, 0],
            btnRight: [1, 0]
        };
        moveFrog(...dirs[id]);
    });
});
