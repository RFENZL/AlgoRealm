const canvas = document.getElementById('topDownMapCanvas');
const context = canvas.getContext('2d');

const tileSize = 64;
const rows = 30;
const cols = 26;

canvas.width = 1664;
canvas.height = 768;

const backgroundImageUrl = 'assets/grass.png';
const backgroundImageUrl2 = 'assets/roche.png';

const backgroundImage = new Image();
backgroundImage.src = backgroundImageUrl;

const backgroundImage2 = new Image();
backgroundImage2.src = backgroundImageUrl2;

function drawTopDownTile(x, y, displayBackgroundImage2) {
    const topDownX = x * tileSize;
    const topDownY = y * tileSize;

    context.drawImage(backgroundImage, topDownX, topDownY, tileSize, tileSize);

    if (displayBackgroundImage2) {
        context.drawImage(backgroundImage2, topDownX, topDownY, tileSize, tileSize);
    }

    context.strokeStyle = '#000';
    context.lineWidth = 1;
    context.strokeRect(topDownX, topDownY, tileSize, tileSize);
}

function isValidPosition(row, col, map) {
    const positionsToCheck = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ];

    for (const offset of positionsToCheck) {
        const newRow = row + offset.y;
        const newCol = col + offset.x;

        if (
            newRow >= 0 && newRow < rows &&
            newCol >= 0 && newCol < cols &&
            map[newRow][newCol]
        ) {
            return false;
        }
    }

    return true;
}

function drawRandomTopDownTileMap() {
    let map = Array.from({ length: rows }, () => Array(cols).fill(false));
    let backgroundImage2Count = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const displayBackgroundImage2 = Math.random() < 0.2 && backgroundImage2Count < 2;

            if (displayBackgroundImage2 && isValidPosition(row, col, map)) {
                backgroundImage2Count++;
                map[row][col] = true;
            } else {
                backgroundImage2Count = 0;
                map[row][col] = false;
            }

            drawTopDownTile(col, row, displayBackgroundImage2);
        }
    }
}

Promise.all([backgroundImage, backgroundImage2].map(img => new Promise(resolve => img.onload = resolve)))
    .then(() => {
        drawRandomTopDownTileMap();
    });