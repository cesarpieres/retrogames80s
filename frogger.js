// Obtener el canvas y el contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cargar imágenes
const sapoVioletaImg = new Image();
sapoVioletaImg.src = 'img/sapovioleta.jpg';
const sapoNegroImg = new Image();
sapoNegroImg.src = 'img/saponegro.jpg';
const sapoVidasImg = new Image();
sapoVidasImg.src = 'img/sapovidas.jpg';
const autoIzquierdaImg = new Image();
autoIzquierdaImg.src = 'img/f1autoizquierda.jpg';
const cosechadoraImg = new Image();
cosechadoraImg.src = 'img/cosechadora.jpg';
const beetleImg = new Image();
beetleImg.src = 'img/pinkbeetle.jpg';
const autoDerechaImg = new Image();
autoDerechaImg.src = 'img/f1autoderecha.jpg';
const camionImg = new Image();
camionImg.src = 'img/camion.jpg';
const tortugasImg = new Image();
tortugasImg.src = 'img/3tortugas.jpg';
const troncoCortoImg = new Image();
troncoCortoImg.src = 'img/troncocorto.jpg';
const troncoEnormeImg = new Image();
troncoEnormeImg.src = 'img/troncoenorme.jpg';
const dosTortugasImg = new Image();
dosTortugasImg.src = 'img/2tortugas.jpg';
const troncoGrandeImg = new Image();
troncoGrandeImg.src = 'img/troncogrande.jpg';
const objetivoImg = new Image();
objetivoImg.src = 'img/objetivollegada.jpg';

// Variables del juego
let player;
let lives = 5;
let level = 1;
let gameSpeed = 2; // Ajustar para la dificultad
let obstacles = [];
let logsAndTurtles = [];
let targets = [];
let isPaused = false;

// Elementos de control
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const pauseBtn = document.getElementById('pauseBtn');
const livesCountDisplay = document.getElementById('livesCount');

// Clase para el jugador
class Player {
    constructor(x, y, width, height, colorVioleta, colorNegro) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colorVioleta = colorVioleta;
        this.colorNegro = colorNegro;
        this.currentSprite = this.colorVioleta;
        this.onLogOrTurtle = false;
        this.platformSpeedX = 0;
    }

    draw() {
        ctx.drawImage(this.currentSprite, this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.onLogOrTurtle) {
            this.x += this.platformSpeedX * gameSpeed;
        }

        // Cambiar a sapo negro al estar en el fondo negro
        if (this.y < canvas.height / 2) { // Ajustar el límite según la disposición del juego
            this.currentSprite = this.colorNegro;
        } else {
            this.currentSprite = this.colorVioleta;
            this.onLogOrTurtle = false;
            this.platformSpeedX = 0;
        }

        // Limitar los movimientos del jugador dentro del canvas
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
    }

    moveUp() {
        this.y -= 50; // Ajustar la distancia del salto
        this.onLogOrTurtle = false;
        this.platformSpeedX = 0;
    }

    moveDown() {
        this.y += 50;
    }

    moveLeft() {
        this.x -= 50;
    }

    moveRight() {
        this.x += 50;
    }

    resetPosition() {
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 50; // Posición inicial
        this.currentSprite = this.colorVioleta;
        this.onLogOrTurtle = false;
        this.platformSpeedX = 0;
    }
}

// Clase para los obstáculos
class Obstacle {
    constructor(x, y, width, height, image, speedX) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.speedX = speedX;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.speedX * gameSpeed;
        // Reiniciar la posición cuando sale de la pantalla
        if (this.speedX > 0 && this.x > canvas.width) {
            this.x = -this.width;
        } else if (this.speedX < 0 && this.x < -this.width) {
            this.x = canvas.width;
        }
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

// Clase para los troncos y tortugas
class LogOrTurtle {
    constructor(x, y, width, height, image, speedX) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.speedX = speedX;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.speedX * gameSpeed;
        // Reiniciar la posición cuando sale de la pantalla
        if (this.speedX > 0 && this.x > canvas.width) {
            this.x = -this.width;
        } else if (this.speedX < 0 && this.x < -this.width) {
            this.x = canvas.width;
        }
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

// Clase para los objetivos
class Target {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.reached = false;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y &&
            !this.reached
        );
    }
}

// Inicializar el juego
function init() {
    player = new Player(
        canvas.width / 2 - 25,
        canvas.height - 75,
        50,
        50,
        sapoVioletaImg,
        sapoNegroImg
    );
    livesCountDisplay.textContent = lives;
    createLevel(level);
}

// Crear los elementos del nivel
function createLevel(level) {
    obstacles = [];
    logsAndTurtles = [];
    targets = [];

    const laneHeight = 50;
    const gap = 150;

    // Nivel 1: Obstáculos
    obstacles.push(new Obstacle(100, canvas.height - laneHeight * 2 - 20, 80, 40, autoIzquierdaImg, -2));
    obstacles.push(new Obstacle(300, canvas.height - laneHeight * 2 - 20, 80, 40, autoIzquierdaImg, -2));
    obstacles.push(new Obstacle(550, canvas.height - laneHeight * 2 - 20, 80, 40, autoIzquierdaImg, -2));

    obstacles.push(new Obstacle(50, canvas.height - laneHeight * 3 - 20, 100, 40, cosechadoraImg, 1.5));
    obstacles.push(new Obstacle(400, canvas.height - laneHeight * 3 - 20, 100, 40, cosechadoraImg, 1.5));

    obstacles.push(new Obstacle(200, canvas.height - laneHeight * 4 - 20, 60, 40, beetleImg, -2.5));
    obstacles.push(new Obstacle(600, canvas.height - laneHeight * 4 - 20, 60, 40, beetleImg, -2.5));

    obstacles.push(new Obstacle(0, canvas.height - laneHeight * 5 - 20, 90, 40, autoDerechaImg, 1.8));
    obstacles.push(new Obstacle(450, canvas.height - laneHeight * 5 - 20, 90, 40, autoDerechaImg, 1.8));

    obstacles.push(new Obstacle(300, canvas.height - laneHeight * 6 - 20, 120, 40, camionImg, -1.2));

    // Nivel de río (ajustar las coordenadas Y)
    const riverStart = canvas.height / 2 - laneHeight * 3;
    logsAndTurtles.push(new LogOrTurtle(50, riverStart + laneHeight * 0, 150, 40, tortugasImg, -1));
    logsAndTurtles.push(new LogOrTurtle(400, riverStart + laneHeight * 0, 150, 40, tortugasImg, -1));

    logsAndTurtles.push(new LogOrTurtle(200, riverStart + laneHeight * 1, 80, 30, troncoCortoImg, -1.5));
    logsAndTurtles.push(new LogOrTurtle(600, riverStart + laneHeight * 1, 80, 30, troncoCortoImg, -1.5));

    logsAndTurtles.push(new LogOrTurtle(0, riverStart + laneHeight * 2, 200, 45, troncoEnormeImg, 0.8));
    logsAndTurtles.push(new LogOrTurtle(500, riverStart + laneHeight * 2, 200, 45, troncoEnormeImg, 0.8));

    logsAndTurtles.push(new LogOrTurtle(150, riverStart + laneHeight * 3, 100, 35, dosTortugasImg, -1.2));
    logsAndTurtles.push(new LogOrTurtle(550, riverStart + laneHeight * 3, 100, 35, dosTortugasImg, -1.2));

    logsAndTurtles.push(new LogOrTurtle(300, riverStart + laneHeight * 4, 180, 40, troncoGrandeImg, 1.1));

    // Objetivos
    const targetSpacing = canvas.width / 5;
    for (let i = 0; i < 5; i++) {
        targets.push(new Target(i * targetSpacing + targetSpacing / 4, 30, 5
