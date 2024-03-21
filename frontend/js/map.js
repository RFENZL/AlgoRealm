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

function movePlayer(event) {
    const speed = 5;
    let newX = player.x;
    let newY = player.y;

    switch (event.key) {
        case "ArrowUp": newY -= speed; break;
        case "ArrowDown": newY += speed; break;
        case "ArrowLeft": newX -= speed; break;
        case "ArrowRight": newX += speed; break;
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
