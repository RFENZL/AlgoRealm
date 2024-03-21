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

