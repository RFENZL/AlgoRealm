const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let cursors;
let player;
const speed = 300;
let customKeys = { up: '', down: '', left: '', right: '' };

// Charge les touches personnalisées depuis localStorage
customKeys = JSON.parse(localStorage.getItem('customKeys')) || customKeys;

function preload() {
    this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/tuxemon-town.json");
    this.load.atlas("atlas", "assets/atlas/atlas.png", "assets/atlas/atlas.json");
}

function create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);

    // Configurer les tuiles spécifiées comme collisibles
    worldLayer.setCollisionByProperty({ collides: true });

    // Spécifiez la zone de collision pour l'arbre spécifique
    const treeCollisionZone = this.add.zone(818, 346, 64, 92); // (x: (786+850)/2, y: (300+392)/2, width: 850-786, height: 392-300)
    this.physics.world.enable(treeCollisionZone);
    treeCollisionZone.body.setAllowGravity(false);
    treeCollisionZone.body.moves = false;

    aboveLayer.setDepth(10);

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 24);

    this.physics.add.collider(player, worldLayer);

    // Détecter la collision avec la zone de collision de l'arbre
    this.physics.add.overlap(player, treeCollisionZone, onTreeCollision, null, this);

    const anims = this.anims;
    anims.create({
        key: "misa-left-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-right-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-front-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });
    anims.create({
        key: "misa-back-walk",
        frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1
    });

    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    cursors = this.input.keyboard.createCursorKeys();

    this.add.text(16, 16, 'Arrow keys to move\nPress "N" to show hitboxes', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
    }).setScrollFactor(0).setDepth(30);

    const debugKey = customKeys.debug ? this.input.keyboard.addKey(customKeys.debug) : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let debugMode = false;
    let debugGraphics = null;

    debugKey.on('down', event => {
        debugMode = !debugMode;

        if (debugMode) {
            // Active le mode debug
            this.physics.world.createDebugGraphic();
            debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(20);
            worldLayer.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            });
        } else {
            // Désactive le mode debug
            this.physics.world.debugGraphic.clear();
            if (debugGraphics) {
                debugGraphics.clear();
                debugGraphics.destroy();
                debugGraphics = null;
            }
        }
    });
}

function onTreeCollision(player, tree) {
    console.log('Collision with specific tree detected!');
    // Ajoutez votre logique spécifique ici
}

function update(time, delta) {
    const prevVelocity = player.body.velocity.clone();

    player.body.setVelocity(0);

    // Ajoute la logique pour les touches personnalisées
    const leftKey = customKeys.left ? this.input.keyboard.addKey(customKeys.left) : cursors.left;
    const rightKey = customKeys.right ? this.input.keyboard.addKey(customKeys.right) : cursors.right;
    const upKey = customKeys.up ? this.input.keyboard.addKey(customKeys.up) : cursors.up;
    const downKey = customKeys.down ? this.input.keyboard.addKey(customKeys.down) : cursors.down;

    if (leftKey.isDown) {
        player.body.setVelocityX(-speed);
        player.anims.play("misa-left-walk", true);
    } else if (rightKey.isDown) {
        player.body.setVelocityX(speed);
        player.anims.play("misa-right-walk", true);
    }

    if (upKey.isDown) {
        player.body.setVelocityY(-speed);
        player.anims.play("misa-back-walk", true);
    } else if (downKey.isDown) {
        player.body.setVelocityY(speed);
        player.anims.play("misa-front-walk", true);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // If no movement keys are being pressed, stop the animation
    if (!leftKey.isDown && !rightKey.isDown && !upKey.isDown && !downKey.isDown) {
        player.anims.stop();

        // Set player to idle frame
        // if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left-walk");
        // else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right-walk");
        // else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back-walk");
        // else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front-walk");
    }
}
