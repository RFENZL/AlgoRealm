const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
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

let player;
let patternIndex = 0;
let pattern = [
    { x: 300, y: 100, moveAnimation: 'GoblinMoveRight', idleAnimation: 'GoblinIdleRight' },
    { x: 300, y: 175, moveAnimation: 'GoblinMoveDown', idleAnimation: 'GoblinIdleDown' },
    { x: 200, y: 175, moveAnimation: 'GoblinMoveLeft', idleAnimation: 'GoblinIdleLeft' },
    { x: 200, y: 100, moveAnimation: 'GoblinMoveUp', idleAnimation: 'GoblinIdleUp' }
];

function preload() {
    this.load.spritesheet('GoblinIdleDown', 'assets/Goblin/body/GoblinIdleDown.png', { frameWidth: 64, frameHeight: 65 });
    this.load.spritesheet('GoblinIdleRight', 'assets/Goblin/body/GoblinIdleRight.png', { frameWidth: 64, frameHeight: 65 });
    this.load.spritesheet('GoblinIdleLeft', 'assets/Goblin/body/GoblinIdleLeft.png', { frameWidth: 64, frameHeight: 65 });
    this.load.spritesheet('GoblinIdleUp', 'assets/Goblin/body/GoblinIdleUp.png', { frameWidth: 64, frameHeight: 65 });
    this.load.spritesheet('GoblinMoveDown', 'assets/Goblin/body/GoblinMoveDown.png', { frameWidth: 64, frameHeight: 65 });
    this.load.spritesheet('GoblinMoveRight', 'assets/Goblin/body/GoblinMoveRight.png', { frameWidth: 64, frameHeight: 65 });
    this.load.spritesheet('GoblinMoveLeft', 'assets/Goblin/body/GoblinMoveLeft.png', { frameWidth: 64, frameHeight: 65 });
    this.load.spritesheet('GoblinMoveUp', 'assets/Goblin/body/GoblinMoveUp.png', { frameWidth: 64, frameHeight: 65 });
}

function create() {
    sensitiveZone = this.physics.add.sprite(400, 300, 'sensitiveZone');
    player = this.physics.add.sprite(200, 100, 'GoblinIdleDown');
    player.setCollideWorldBounds(true);
    this.physics.add.overlap(player, sensitiveZone, onEnterSensitiveZone, null, this);
    this.anims.create({
        key: 'GoblinMoveLeft',
        frames: this.anims.generateFrameNumbers('GoblinMoveLeft', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'GoblinMoveUp',
        frames: this.anims.generateFrameNumbers('GoblinMoveUp', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'GoblinMoveRight',
        frames: this.anims.generateFrameNumbers('GoblinMoveRight', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'GoblinMoveDown',
        frames: this.anims.generateFrameNumbers('GoblinMoveDown', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'GoblinIdleLeft',
        frames: this.anims.generateFrameNumbers('GoblinIdleLeft', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'GoblinIdleUp',
        frames: this.anims.generateFrameNumbers('GoblinIdleUp', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'GoblinIdleRight',
        frames: this.anims.generateFrameNumbers('GoblinIdleRight', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'GoblinIdleDown',
        frames: this.anims.generateFrameNumbers('GoblinIdleDown', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1
    });

    moveToNextPoint.call(this);
}

function update() {
    // Nothing needed here for this example.
}

function moveToNextPoint() {
    if (patternIndex >= pattern.length) {
        patternIndex = 0;
    }

    let point = pattern[patternIndex];
    this.tweens.add({
        targets: player,
        x: point.x,
        y: point.y,
        duration: 1250,
        ease: 'Linear',
        onStart: () => {
            player.anims.play(point.moveAnimation, true);
        },
        onComplete: () => {
            player.anims.play(point.idleAnimation, true);
            patternIndex++;
            this.time.delayedCall(5000, moveToNextPoint, [], this);
        },
        onCompleteScope: this
    });
}
function onEnterSensitiveZone(player, zone) {

    this.scene.pause();
    afficherPopup();
}
function afficherPopup() {
    let popupText = this.add.text(400, 300, 'Popup Message', { fontSize: '32px', fill: '#ffffff' });
    popupText.setOrigin(0.5);
    let continueButton = this.add.text(400, 400, 'Continuer', { fontSize: '24px', fill: '#ffffff' });
    continueButton.setOrigin(0.5);
    continueButton.setInteractive();
    continueButton.on('pointerdown', () => {
        fermerPopup();
        this.scene.resume();
    });
}

function fermerPopup() {
    popupText.destroy();
    continueButton.destroy();
}
