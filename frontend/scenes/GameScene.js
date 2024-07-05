class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.cursors = null;
        this.player = null;
        this.speed = 300;
        this.customKeys = { up: '', down: '', left: '', right: '' };
        this.collisionText = null;
        this.inCollision = false;
        this.treeCollisionZone = null;
        this.gameState = localStorage.getItem('gameState') || true;
        this.customKeys = JSON.parse(localStorage.getItem('customKeys')) || this.customKeys;
    }

    preload() {
        this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px-extruded.png");
        this.load.tilemapTiledJSON("map", "assets/tilemaps/tuxemon-town.json");
        this.load.atlas("atlas", "assets/atlas/atlas.png", "assets/atlas/atlas.json");
        this.load.spritesheet("goblinMoveDown", "assets/Goblin/body/goblinMoveDown.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("goblinMoveUp", "assets/Goblin/body/goblinMoveUp.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("goblinMoveLeft", "assets/Goblin/body/goblinMoveLeft.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("goblinMoveRight", "assets/Goblin/body/goblinMoveRight.png", { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        this.createMap();
        this.createPlayer();
        this.createAnimations();
        this.setupCamera();
        this.createControls();
        this.createCollisionText();
        this.setupDebugging();
        this.createGoblin();
    }

    createMap() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

        const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createLayer("World", tileset, 0, 0);
        const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collides: true });

        this.treeCollisionZone = this.add.zone(818, 346, 64, 92);
        this.physics.world.enable(this.treeCollisionZone);
        this.treeCollisionZone.body.setAllowGravity(false);
        this.treeCollisionZone.body.moves = false;

        aboveLayer.setDepth(10);
        this.worldLayer = worldLayer;
    }

    createPlayer() {
        const map = this.make.tilemap({ key: "map" });
        let spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        // Récupérer la position du joueur stockée
        const storedPlayerPosition = JSON.parse(localStorage.getItem('playerPosition'));
        if (storedPlayerPosition) {
            spawnPoint = storedPlayerPosition;
        }

        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
            .setSize(30, 40)
            .setOffset(0, 24);

        this.physics.add.collider(this.player, this.worldLayer);
        this.physics.add.overlap(this.player, this.treeCollisionZone, this.onTreeCollision, null, this);

        // Réinitialiser le spawnPoint à la valeur par défaut pour les futures apparitions
        localStorage.removeItem('playerPosition');
    }

    createGoblin() {
        this.goblin = this.physics.add.sprite(1190, 990, "atlas", "misa-front")
            .setSize(30, 40)
            .setOffset(0, 24);

        this.physics.add.collider(this.goblin, this.worldLayer);
        this.physics.add.overlap(this.goblin, this.player, this.onGoblinCollision, null, this);

        this.goblin2 = this.physics.add.sprite(625, 590, "atlas", "misa-front")
            .setSize(30, 40)
            .setOffset(0, 24);
        this.physics.add.collider(this.goblin2, this.worldLayer);
        this.physics.add.overlap(this.goblin2, this.player, this.onGoblinCollision, null, this);
    }

    onGoblinCollision(player, goblin) {
        console.log('Collision with goblin detected!');
        player.body.setVelocity(0);
        player.anims.stop();

        this.scene.launch('CombatScene');
        this.scene.pause();
    }

    createAnimations() {
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
        anims.create({
            key: "goblin-up-walk",
            frames: anims.generateFrameNumbers("goblinMoveUp", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "goblin-down-walk",
            frames: anims.generateFrameNumbers("goblinMoveDown", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "goblin-left-walk",
            frames: anims.generateFrameNumbers("goblinMoveLeft", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "goblin-right-walk",
            frames: anims.generateFrameNumbers("goblinMoveRight", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }

    setupCamera() {
        const camera = this.cameras.main;
        camera.startFollow(this.player);
        const map = this.make.tilemap({ key: "map" });
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-E', this.handleEKeyDown, this);
    }

    handleEKeyDown() {
        if (this.inCollision || this.debugMode) {
            let enigmeWindow = window.open('enigme.html', 'Enigme', 'height=800,width=1200,status=yes,toolbar=no,menubar=no,location=no');
            this.gameState = false;
            localStorage.setItem('gameState', 'false');
            localStorage.setItem('enigmeSolved', 'false');
            this.scene.pause();

            enigmeWindow.addEventListener('unload', () => {
                this.gameState = true;
                if (localStorage.getItem('enigmeSolved') === 'true') {
                    this.scene.resume();
                    this.player.setPosition(1000, 300);
                    this.checkCollisionAfterTeleport();
                }
            });
        }
    }

    createCollisionText() {
        // Initialiser collisionText sans texte
        this.collisionText = this.add.text(16, 16, '', {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#ffffff",
            shadow: { offsetX: 2, offsetY: 2, color: "#333333", blur: 5, stroke: true, fill: true }
        }).setScrollFactor(0).setDepth(30).setVisible(false); // Définir visible à false initialement
    }

    setupDebugging() {
        const debugKey = this.customKeys.debug ? this.input.keyboard.addKey(this.customKeys.debug) : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const combatKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        let debugMode = false;
        let debugGraphics = null;

        debugKey.on('down', event => {
            debugMode = !debugMode;

            if (debugMode) {
                this.physics.world.createDebugGraphic();
                debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(20);
                this.worldLayer.renderDebug(debugGraphics, {
                    tileColor: null,
                    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                    faceColor: new Phaser.Display.Color(40, 39, 37, 255)
                });
            } else {
                this.physics.world.debugGraphic.clear();
                if (debugGraphics) {
                    debugGraphics.clear();
                    debugGraphics.destroy();
                    debugGraphics = null;
                }
            }
        });

        combatKey.on('down', event => {
            if(debugMode) {
                // Stocker la position du joueur avant de lancer la scène de combat
                localStorage.setItem('playerPosition', JSON.stringify({x: this.player.x, y: this.player.y}));
                this.scene.launch('CombatScene');
            }
        });
    }

    onTreeCollision(player, tree) {
        this.collisionText.setText('Appuyer sur E pour lancer l\'enigme');
        this.collisionText.setVisible(this.collisionText.text !== '');
        this.inCollision = true;
    }

    update(time, delta) {
        const prevVelocity = this.player.body.velocity.clone();
        this.player.body.setVelocity(0);

        const { left, right, up, down } = this.customKeys;
        const leftKey = left ? this.input.keyboard.addKey(left) : this.cursors.left;
        const rightKey = right ? this.input.keyboard.addKey(right) : this.cursors.right;
        const upKey = up ? this.input.keyboard.addKey(up) : this.cursors.up;
        const downKey = down ? this.input.keyboard.addKey(down) : this.cursors.down;
        const goblinSpeed = 100;
        const goblinStartY = 590;
        const goblinEndY = 990;
        const goblin2StartX = 625;
        const goblin2EndX = 125;

        if (leftKey.isDown) {
            this.player.body.setVelocityX(-this.speed);
            this.player.anims.play("misa-left-walk", true);
        } else if (rightKey.isDown) {
            this.player.body.setVelocityX(this.speed);
            this.player.anims.play("misa-right-walk", true);
        }

        if (upKey.isDown) {
            this.player.body.setVelocityY(-this.speed);
            this.player.anims.play("misa-back-walk", true);
        } else if (downKey.isDown) {
            this.player.body.setVelocityY(this.speed);
            this.player.anims.play("misa-front-walk", true);
        }

        this.player.body.velocity.normalize().scale(this.speed);

        if (!leftKey.isDown && !rightKey.isDown && !upKey.isDown && !downKey.isDown) {
            this.player.anims.stop();
        }

        if (!this.inCollision && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treeCollisionZone.getBounds())) {
            this.collisionText.setText('Appuyer sur E pour lancer l\'enigme');
            this.inCollision = true;
        } else if (this.inCollision && !Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treeCollisionZone.getBounds())) {
            this.collisionText.setText('');
            this.inCollision = false;
        }

        if (this.goblin.y <= goblinStartY) {
            this.goblin.body.setVelocityY(goblinSpeed);
            this.goblin.anims.play("goblin-down-walk", true);
        } else if (this.goblin.y >= goblinEndY) {
            this.goblin.body.setVelocityY(-goblinSpeed);
            this.goblin.anims.play("goblin-up-walk", true);
        }

        this.goblin.body.velocity.normalize().scale(goblinSpeed);

        if (this.goblin2.x >= goblin2StartX) {
            this.goblin2.body.setVelocityX(-goblinSpeed);
            this.goblin2.anims.play("goblin-left-walk", true);
        } else if (this.goblin2.x <= goblin2EndX) {
            this.goblin2.body.setVelocityX(goblinSpeed);
            this.goblin2.anims.play("goblin-right-walk", true);
        }
    }

    checkCollisionAfterTeleport() {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treeCollisionZone.getBounds())) {
            this.collisionText.setText('Appuyer sur E pour lancer l\'enigme');
            this.inCollision = true;
        } else {
            this.collisionText.setText('Enigme Solved');
            this.inCollision = false;
        }
    }
}

export default GameScene;
