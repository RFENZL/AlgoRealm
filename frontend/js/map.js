const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Définir le joueur
const player = {
    x: 100, // Position X de départ
    y: 100, // Position Y de départ
    width: 50, // Largeur
    height: 50, // Hauteur
    color: 'blue' // Couleur
};

// Fonction pour dessiner le joueur
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Initialiser le jeu
function init() {
    drawPlayer();
}

init();
var playerPiece;
var doorPiece;
var speed = 3;

// Initialiser le jeu
function init() {
    myGameArea.start();
    positionPieces();
}

function positionPieces() {
    playerPiece = new component(30, 30, "red", 10, 300);
    doorPiece = new component(30, 60, "green", 1200, 285);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1280;
        this.canvas.height = 630;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
}

function updateGameArea() {
    myGameArea.clear();
    playerPiece.speedX = 0;
    playerPiece.speedY = 0;    
    if (myGameArea.keys && myGameArea.keys[37]) {playerPiece.speedX = -speed; }
    if (myGameArea.keys && myGameArea.keys[39]) {playerPiece.speedX = speed; }
    if (myGameArea.keys && myGameArea.keys[38]) {playerPiece.speedY = -speed; }
    if (myGameArea.keys && myGameArea.keys[40]) {playerPiece.speedY = speed; }
    playerPiece.newPos();    
    playerPiece.update();
    doorPiece.update();
    checkCollision();
    leavingTheMap();
}

function checkCollision() {
    var crash = true;
    var offset = speed + 1;
    if ((playerPiece.y + (playerPiece.height) < doorPiece.y  + offset) ||
    (playerPiece.y > doorPiece.y + (doorPiece.height) - offset) ||
    (playerPiece.x + (playerPiece.width) < doorPiece.x  + offset) ||
    (playerPiece.x > doorPiece.x + (doorPiece.width - offset))) {
        crash = false;
    }
    if (crash) {
        alert("Bravo! Vous avez atteint la porte!");
        myGameArea.keys = {};
        console.log(playerPiece);
        positionPieces();
    }
}

function leavingTheMap() {
    if (playerPiece.x < 0) {
        playerPiece.x += speed;
    }
    if (playerPiece.y < 0) {
        playerPiece.y += speed;
    }
    if (playerPiece.x > myGameArea.canvas.width - playerPiece.width) {
        playerPiece.x = myGameArea.canvas.width - playerPiece.width - speed;
    }
    if (playerPiece.y > myGameArea.canvas.height - playerPiece.height) {
        playerPiece.y = myGameArea.canvas.height - playerPiece.height - speed;
    }
}


function movePlayer(event) {
    const speed = 50;
    let newX = player.x;
    let newY = player.y;

    // Récupérer les touches personnalisées du localStorage
    const customKeys = JSON.parse(localStorage.getItem('customKeys'));

    switch (event.key.toUpperCase()) {
        case customKeys.up: newY -= speed; break;
        case customKeys.down: newY += speed; break;
        case customKeys.left: newX -= speed; break;
        case customKeys.right: newX += speed; break;
    }

    if (newX >= 0 && newX + player.width <= canvas.width) {
        player.x = newX;
    }
    if (newY >= 0 && newY + player.height <= canvas.height) {
        player.y = newY;
    }

    updateGame();
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canevas
    drawPlayer(); // Redessine le joueur à la nouvelle position
}

document.addEventListener('keydown', movePlayer);

// Supposons qu'il y a une porte à ces coordonnées
const door = {
    x: 400,
    y: 300,
    width: 50,
    height: 100,
    color: 'brown'
};

function drawDoor() {
    ctx.fillStyle = door.color;
    ctx.fillRect(door.x, door.y, door.width, door.height);
}

function checkCollision() {
    if (player.x < door.x + door.width &&
        player.x + player.width > door.x &&
        player.y < door.y + door.height &&
        player.y + player.height > door.y) {
        // Collision détectée, afficher l'énigme
        alert("Vous avez trouvé une porte verrouillée. Résolvez l'énigme pour continuer.");
    }
}

// Ajouter drawDoor() et checkCollision() à la fonction updateGame()
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawDoor();
    checkCollision();
}
