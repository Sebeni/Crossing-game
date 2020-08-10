let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let screenWidth = canvas.getAttribute("width");
let screenHeight = canvas.getAttribute("height");
var isGameOver = false;

class GameCharacter {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.maxSpeed = 3;
    }

    moveHorizontally() {
        if (this.speed < 0 && this.x <= 0) {
            this.speed = 0;
        }
        this.x += this.speed;
    }

    moveVertically() {
        if (this.y > (screenHeight - this.height) || this.y < (0)) {
            this.revertSpeed();
        }
        this.y += this.speed;
    }

    revertSpeed() {
        this.speed = -this.speed;
    }
}

let gameCharWidth = 40;
let gameCharHeight = 40;
let player = new GameCharacter(0, (screenHeight / 2), gameCharWidth, gameCharHeight, "rgb(0, 0, 255)", 0);
let enemy1 = new GameCharacter(580, 100, gameCharWidth, gameCharHeight, "black", 2);
let enemy2 = new GameCharacter(800, 150, gameCharWidth, gameCharHeight, "black", 3);
let enemy3 = new GameCharacter(330, 400, gameCharWidth, gameCharHeight, "black", 1);
let goal = new GameCharacter(screenWidth - gameCharWidth * 1.3, (screenHeight / 2), gameCharWidth, gameCharHeight, "green", 0);

var enemies = [enemy1, enemy2, enemy3];
var sprites = {};

function loadSprites() {
    sprites.player = new Image();
    sprites.player.src = "images/hero.png";

    sprites.background = new Image();
    sprites.background.src = "images/floor.png";

    sprites.enemy = new Image();
    sprites.enemy.src = "images/enemy.png";

    sprites.goal = new Image();
    sprites.goal.src = "images/chest.png";

}

document.onkeydown = function (event) {
    let keyPressed = event.key;
    switch (keyPressed) {
        case "ArrowLeft":
            player.speed = -player.maxSpeed;
            break;
        case "ArrowRight":
            player.speed = player.maxSpeed;
            break;
    }
}

document.onkeyup = function (event) {
    let keyPressed = event.key;
    if (keyPressed == "ArrowLeft" || keyPressed == "ArrowRight") {
        player.speed = 0;
    }
}

function checkCollisions(firstGameChar, secondGameChar) {
    var xOverlap = Math.abs(firstGameChar.x - secondGameChar.x) <= 0.95 * Math.max(firstGameChar.width, secondGameChar.width);
    var yOverlap = Math.abs(firstGameChar.y - secondGameChar.y) <= 0.95 * Math.max(firstGameChar.height, secondGameChar.height);
    return xOverlap && yOverlap;
}

function drawAll() {
    ctx.drawImage(sprites.background, 0, 0);
    ctx.drawImage(sprites.player, player.x, player.y);
    ctx.drawImage(sprites.goal, goal.x, goal.y);
    enemies.forEach((enemy) => {
        ctx.drawImage(sprites.enemy, enemy.x, enemy.y);
    });
}



function update() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    player.moveHorizontally();

    enemies.forEach((enemy) => {
        if (checkCollisions(player, enemy)) {
            endGameLogic("Game over");
        }
        enemy.moveVertically();
    });

    if (checkCollisions(player, goal)) {
        endGameLogic("You win");
    }
}

function endGameLogic(text) {
    isGameOver = true;
    alert(text);
    location.reload();
}

function step() {
    update();
    drawAll();
    if (!isGameOver) {
        window.requestAnimationFrame(step);
    }
}

loadSprites();
step();