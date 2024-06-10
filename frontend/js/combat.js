class Personnage {
    constructor(pv, attaque, defense) {
        this.pv = pv;
        this.attaque = attaque;
        this.defense = defense;
    }
}

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let joueur;
let joueurSprite;
let joueur2;
let joueurSprite2;
let initialX2;
let initialY;
let initialX;
let isMoving = false;
let healthBar;
let barX;
let barY;
let barWidth;
let barHeight;
let isDead = false;
let buttons = [];
let buttons2 = [];

function preload() {
    this.load.image('background', 'assets/Arène.png');
    this.load.spritesheet('joueurIdle', 'assets/Chevalier/Idle.png', { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('joueurWalk', 'assets/Chevalier/Run.png', { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('joueurAttack', 'assets/Chevalier/Attack.png', { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('joueurDeath', 'assets/Chevalier/DeathNoMovement.png', { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('joueurDeathStatic', 'assets/Chevalier/DeathNoMovement.png', { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('goblinIdle', 'assets/Goblin/Idle.png', { frameWidth: 44, frameHeight: 38 });
    this.load.spritesheet('goblinAttack', 'assets/Goblin/Attack.png', { frameWidth: 48, frameHeight: 38 });
    this.load.spritesheet('goblinWalk', 'assets/Goblin/Walk.png', { frameWidth: 41, frameHeight: 34 });
}

function create() {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    this.add.image(windowWidth / 2, windowHeight / 2, 'background').setDisplaySize(windowWidth, windowHeight);
    joueur = new Personnage(100, 10, 5);
    joueurSprite = this.add.sprite(windowWidth / 4, windowHeight / 2, 'joueur');
    initialX = joueurSprite.x;
    initialY = joueurSprite.y;
    joueurSprite.setScale(4);

    joueur2 = new Personnage(100, 10, 5);
    joueurSprite2 = this.add.sprite(windowWidth * 2 / 2.9, initialY*1.3, 'joueur');
    initialX2 = joueurSprite2.x;
    joueurSprite2.setScale(3);
    joueurSprite2.setOrigin(0, 0.5);

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('joueurIdle', { start: 0, end: 32 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('joueurWalk', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('joueurAttack', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('joueurDeath', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'deathStatic',
        frames: [{ key: 'joueurDeathStatic', frame: 9 }],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle2',
        frames: this.anims.generateFrameNumbers('goblinIdle', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk2',
        frames: this.anims.generateFrameNumbers('joueurWalk', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'attack2',
        frames: this.anims.generateFrameNumbers('joueurAttack', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'death2',
        frames: this.anims.generateFrameNumbers('joueurDeath', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: 0
    });

    joueurSprite.anims.play('idle', true);
    joueurSprite2.anims.play('idle2', true);

    barWidth = 200;
    barHeight = 20;
    barX = joueurSprite.x - barWidth / 2;
    barY = joueurSprite.y - joueurSprite.displayHeight / 2 ;

    let healthPercentage = joueur.pv / 100;
    healthBar = this.add.graphics();
    updateHealthBar(healthBar, barX, barY, barWidth, barHeight, healthPercentage, joueur.pv);
    barX2 = joueurSprite2.x -20;
    barY2 = joueurSprite2.y - joueurSprite2.displayHeight / 2 -200;


    let healthPercentage2 = joueur2.pv / 100;
    healthBar2 = this.add.graphics();
    updateHealthBar(healthBar2, barX2, barY2, barWidth, barHeight, healthPercentage2, joueur2.pv);
    

    let buttonY = windowHeight / 2 + joueurSprite.displayHeight / 2 + 20;
    let buttonSpacing = 150;
    let buttonWidth = 150;
    let buttonHeight = 50;

    let button1 = createButton(this, windowWidth / 4 - buttonSpacing, buttonY, buttonWidth, buttonHeight, 'Attaque');
    let button2 = createButton(this, windowWidth / 4, buttonY, buttonWidth, buttonHeight, 'Défense');
    let button3 = createButton(this, windowWidth / 4 + buttonSpacing, buttonY, buttonWidth, buttonHeight, 'Fuite');

    buttons.push(button1, button2, button3);

    addInteractive(button1, () => {
        if (!isMoving) {
            console.log('Attaque cliquée');
            run();
        }
    });

    addInteractive(button2, () => {
        console.log('Défense cliquée');
    });

    addInteractive(button3, () => {
        console.log('Fuite cliquée');
    });

    let button1_2 = createButton(this, windowWidth * 3 / 4 - buttonSpacing, buttonY, buttonWidth, buttonHeight, 'Attaque');
    let button2_2 = createButton(this, windowWidth * 3 / 4, buttonY, buttonWidth, buttonHeight, 'Défense');
    let button3_2 = createButton(this, windowWidth * 3 / 4 + buttonSpacing, buttonY, buttonWidth, buttonHeight, 'Fuite');

    buttons2.push(button1_2, button2_2, button3_2);

    addInteractive(button1_2, () => {
        if (!isMoving) {
            console.log('Attaque cliquée (joueur 2)');
            run2();
        }
    });

    addInteractive(button2_2, () => {
        console.log('Défense cliquée (joueur 2)');
    });

    addInteractive(button3_2, () => {
        console.log('Fuite cliquée (joueur 2)');
    });
}


function update() {
    if (isMoving && joueurSprite.x === initialX) {
        isMoving = false;
    }
}

function createButton(scene, x, y, width, height, text) {
    let button = scene.add.graphics();
    button.fillStyle(0xffffff, 1);
    button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 10);

    let buttonText = scene.add.text(x, y, text, { font: "24px Arial", fill: "#000" }).setOrigin(0.5);
    return { button, buttonText, width, height, x, y };
}

function addInteractive(buttonObj, callback) {
    let { button, buttonText, width, height, x, y } = buttonObj;

    button.setInteractive(new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height), Phaser.Geom.Rectangle.Contains);

    button.on('pointerover', () => {
        button.clear();
        button.fillStyle(0xff0000, 1);
        button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 10);
    });

    button.on('pointerout', () => {
        button.clear();
        button.fillStyle(0xffffff, 1);
        button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 10);
    });

    button.on('pointerdown', callback);
}

function disableButtons() {
    buttons.forEach(buttonObj => {
        let { button, buttonText, width, height, x, y } = buttonObj;
        button.disableInteractive();
        button.clear();
        button.fillStyle(0x888888, 1);
        button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 10);
    });
}

function disableButtons2() {
    buttons2.forEach(buttonObj => {
        let { button, buttonText, width, height, x, y } = buttonObj;
        button.disableInteractive();
        button.clear();
        button.fillStyle(0x888888, 1);
        button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 10);
    });
}

function enableButtons() {
    buttons.forEach(buttonObj => {
        let { button, buttonText, width, height, x, y } = buttonObj;
        button.setInteractive(new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        button.clear();
        button.fillStyle(0xffffff, 1);
        button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 10);
    });
}

function enableButtons2() {
    buttons2.forEach(buttonObj => {
        let { button, buttonText, width, height, x, y } = buttonObj;
        button.setInteractive(new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        button.clear();
        button.fillStyle(0xffffff, 1);
        button.fillRoundedRect(x - width / 2, y - height / 2, width, height, 10);
    });
}

function run() {
    isMoving = true;
    disableButtons();
    let windowWidth = window.innerWidth;
    let moveDistance = windowWidth * 0.4;
    let newX = joueurSprite.x + moveDistance;

    game.scene.scenes[0].tweens.timeline({
        targets: joueurSprite,
        ease: 'Power2',
        duration: 1000,
        tweens: [
            {
                x: newX,
                duration: 1000,
                onStart: () => {
                    joueurSprite.anims.play('walk', true);
                    joueurSprite.setFlipX(false);
                },
                onComplete: () => {
                    joueurSprite.anims.play('idle', true);
                    attack();
                }
            },
            {
                x: initialX,
                duration: 1000,
                delay: 500,
                onStart: () => {
                    joueurSprite.anims.play('walk', true);
                    joueurSprite.setFlipX(true);
                },
                onComplete: () => {
                    joueurSprite.anims.play('idle', true);
                    joueurSprite.setFlipX(false);
                    isMoving = false;
                    enableButtons();
                    if (joueur.pv <= 0 && joueurSprite.x === initialX && !isDead) {
                        joueurDeath();
                    }
                }
            }
        ]
    });
}

function run2() {
    isMoving = true;
    disableButtons2();
    let windowWidth = window.innerWidth;
    let moveDistance = windowWidth * 0.4;
    let newX = joueurSprite2.x - moveDistance;

    game.scene.scenes[0].tweens.timeline({
        targets: joueurSprite2,
        ease: 'Power2',
        duration: 1000,
        tweens: [
            {
                x: newX,
                duration: 1000,
                onStart: () => {
                    joueurSprite2.anims.play('walk2', true);
                    joueurSprite2.setFlipX(true);
                },
                onComplete: () => {
                    joueurSprite2.anims.play('idle2', true);                   
                    attack2();
                }
            },
            {
                x: initialX2,
                duration: 1000,
                delay: 500,
                onStart: () => {
                    joueurSprite2.anims.play('walk2', true);
                    joueurSprite2.setFlipX(false);
                },
                onComplete: () => {
                    joueurSprite2.anims.play('idle2', true);
                    isMoving = false;
                    enableButtons2();
                    if (joueur2.pv <= 0 && joueurSprite2.x === initialX2 && !isDead) {
                        joueurDeath();
                    }
                }
            }
        ]
    });
}

function attack() {
    joueurSprite.anims.play('attack', true);

    joueurSprite.on('animationcomplete', function (animation) {
        if (animation.key === 'attack') {
            joueurSprite.anims.play('idle', true);
        }
    });
    decreaseHealth2(10);
}

function attack2() {
    joueurSprite2.anims.play('attack2', true);

    joueurSprite2.on('animationcomplete', function (animation) {
        if (animation.key === 'attack2') {
            joueurSprite2.anims.play('idle2', true);
        }
    });
    decreaseHealth(10);
}

function updateHealthBar(graphics, x, y, width, height, percentage, currentHealth) {
    graphics.clear();
    graphics.fillStyle(0x808080, 1);
    graphics.fillRoundedRect(x, y, width, height, 5);
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRoundedRect(x, y, width * percentage, height, 5);

    if (graphics.healthTextObject) {
        graphics.healthTextObject.destroy(); // Détruire le texte précédent
    }

    let healthText = currentHealth.toString() + " PV";
    let healthTextObject = game.scene.scenes[0].add.text(x + width / 2, y + height / 2, healthText, { font: "16px Arial", fill: "#ffffff" }).setOrigin(0.5);
    graphics.healthTextObject = healthTextObject;
}


function decreaseHealth(amount) {
    joueur.pv -= amount;
    if (joueur.pv <= 0) {
        joueur.pv = 0;
        joueurDeath();
    }
    let healthPercentage = joueur.pv / 100;
    updateHealthBar(healthBar, barX, barY, barWidth, barHeight, healthPercentage, joueur.pv);
}

function decreaseHealth2(amount) {
    joueur2.pv -= amount;
    if (joueur2.pv <= 0) {
        joueur2.pv = 0;
        joueur2Death();
    }
    let healthPercentage2 = joueur2.pv / 100;
    updateHealthBar(healthBar2, barX2, barY2, barWidth, barHeight, healthPercentage2, joueur2.pv);
}

function joueurDeath() {
    joueurSprite.anims.play('death', true);
    isDead = true;
    joueurSprite.on('animationcomplete', function (animation) {
        if (animation.key === 'death') {
            joueurSprite.anims.play('deathStatic', true);
        }
    });
    disableButtons();
}

function joueur2Death() {
    joueurSprite2.anims.play('death2', true);
    isDead = true;
    joueurSprite2.on('animationcomplete', function (animation) {
        if (animation.key === 'death2') {
            joueurSprite2.anims.play('deathStatic', true);
        }
    });
    disableButtons2();
}

