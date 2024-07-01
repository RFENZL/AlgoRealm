class Personnage {
    constructor(pv, attaque, defense) {
        this.pv = pv;
        this.attaque = attaque;
        this.defense = defense;
    }
}

class CombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CombatScene' });
        this.joueur;
        this.joueurSprite;
        this.joueur2;
        this.joueurSprite2;
        this.initialX2;
        this.initialY;
        this.initialX;
        this.isMoving = false;
        this.healthBar;
        this.healthBar2;
        this.barX;
        this.barY;
        this.barWidth = 200;
        this.barHeight = 20;
        this.isDead = false;
        this.buttons = [];
        this.buttons2 = [];
        this.defenseJ1 = false;
        this.defenseJ2 = false;
        this.resistance = 2;
        this.attaqueJ2 = false;
    }

    preload() {
        this.load.image('background', 'assets/Arène.png');
        this.load.audio('attackSound', 'assets/Musique/Pokemon.mp3');
        this.load.spritesheet('joueurIdle', 'assets/Chevalier/Idle.png', { frameWidth: 120, frameHeight: 80 });
        this.load.spritesheet('joueurWalk', 'assets/Chevalier/Run.png', { frameWidth: 120, frameHeight: 80 });
        this.load.spritesheet('joueurAttack', 'assets/Chevalier/Attack.png', { frameWidth: 120, frameHeight: 80 });
        this.load.spritesheet('joueurDeath', 'assets/Chevalier/DeathNoMovement.png', { frameWidth: 120, frameHeight: 80 });
        this.load.spritesheet('joueurDeathStatic', 'assets/Chevalier/DeathNoMovement.png', { frameWidth: 120, frameHeight: 80 });
        this.load.spritesheet('goblinIdle', 'assets/Goblin/Idle.png', { frameWidth: 44, frameHeight: 38 });
        this.load.spritesheet('goblinAttack', 'assets/Goblin/Attack.png', { frameWidth: 48, frameHeight: 38 });
        this.load.spritesheet('goblinWalk', 'assets/Goblin/Walk.png', { frameWidth: 41, frameHeight: 34 });
        this.load.spritesheet('goblinDeath', 'assets/Goblin/death.png', { frameWidth: 38, frameHeight: 34 });
        this.load.spritesheet('goblinDeathStatic', 'assets/Goblin/death.png', { frameWidth: 38, frameHeight: 34 });
    }

    create() {
        const returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        returnKey.on('down', event => {
            this.scene.switch('GameScene');
        });

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        this.add.image(windowWidth / 2, windowHeight / 2, 'background').setDisplaySize(windowWidth, windowHeight);
        this.joueur = new Personnage(100, 40, 25);
        this.joueurSprite = this.add.sprite(windowWidth / 4, windowHeight / 2, 'joueur');
        this.initialX = this.joueurSprite.x;
        this.initialY = this.joueurSprite.y;
        this.joueurSprite.setScale(4);

        this.joueur2 = new Personnage(100, 30, 15);
        this.joueurSprite2 = this.add.sprite(windowWidth * 2 / 2.9, this.initialY * 1.3, 'joueur');
        this.initialX2 = this.joueurSprite2.x;
        this.joueurSprite2.setScale(3);
        this.joueurSprite2.setOrigin(0, 0.5);

        this.deathText = this.add.text(windowWidth / 2, windowHeight / 2, '', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        this.winText = this.add.text(windowWidth / 2, windowHeight / 2, '', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        this.infoEnnemiAction = this.add.text(windowWidth / 2, windowHeight / 1.1, '', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        this.createAnimations();

        this.joueurSprite.anims.play('idle', true);
        this.joueurSprite2.anims.play('idle2', true);

        this.barX = this.joueurSprite.x - this.barWidth / 2;
        this.barY = this.joueurSprite.y - this.joueurSprite.displayHeight / 2;
        this.healthBar = this.add.graphics();
        this.updateHealthBar(this.healthBar, this.barX, this.barY, this.barWidth, this.barHeight, this.joueur.pv / 100, this.joueur.pv);

        this.barX2 = this.joueurSprite2.x - 20;
        this.barY2 = this.joueurSprite2.y - this.joueurSprite2.displayHeight / 2 - 200;
        this.healthBar2 = this.add.graphics();
        this.updateHealthBar(this.healthBar2, this.barX2, this.barY2, this.barWidth, this.barHeight, this.joueur2.pv / 100, this.joueur2.pv);

        this.createButton(10, windowHeight / 1.3, 80, 40, 'Attack', () => this.handleAttackClick());
        this.createButton(120, windowHeight / 1.3, 80, 40, 'Defense', () => this.handleDefenseClick());
        this.createButton(250, windowHeight / 1.3, 80, 40, 'Run', () => this.handleRunClick());

        // this.createButton(10, windowHeight / 1.2, 80, 40, 'Attack', () => this.handleAttackClick2());
        // this.createButton(120, windowHeight / 1.2, 80, 40, 'Defense', () => this.handleDefenseClick2());
        // this.createButton(250, windowHeight / 1.2, 80, 40, 'Run', () => this.handleRunClick2());
    }

    update() {
    }

    createAnimations() {
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
            repeat: 0,
            onStart: function () {
                var attackSound = this.sound.add('attackSound');
                attackSound.play();
            },
            callbackScope: this
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
            frames: this.anims.generateFrameNumbers('goblinWalk', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'attack2',
            frames: this.anims.generateFrameNumbers('goblinAttack', { start: 0, end: 8 }),
            frameRate: 15,
            repeat: 0
        });
        this.anims.create({
            key: 'death2',
            frames: this.anims.generateFrameNumbers('goblinDeath', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'deathStatic2',
            frames: [{ key: 'goblinDeathStatic', frame: 7 }],
            frameRate: 10,
            repeat: 0
        });
    }

    createButton(x, y, width, height, text, callback) {
        let button = this.add.graphics();
        button.fillStyle(0xffffff, 1);
        button.fillRoundedRect(x, y, width, height, 10);

        let buttonText = this.add.text(x + width / 2, y + height / 2, text, {
            font: '20px Arial',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        button.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
        button.on('pointerdown', callback);

        this.buttons.push(button);
        this.buttons.push(buttonText);
    }

    updateHealthBar(graphics, x, y, width, height, pourcentage, joueurPv) {
        graphics.clear();
        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(x, y, width, height);
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(x, y, width * pourcentage, height);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRect(x, y, width, height);

        let healthText = `${joueurPv} PV`;
        let text = this.add.text(x + width / 2, y + height / 2, healthText, {
            font: '18px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    handleAttackClick() {
        if (this.joueurSprite.anims.getName() === 'attack' || this.isMoving) return;

        this.defenseJ1 = false;
        this.joueurSprite.anims.play('attack', true);
        this.time.delayedCall(1000, () => {
            let damage = this.joueur.attaque;
            if (this.defenseJ2) {
                damage -= this.joueur2.defense;
            }
            if (damage < 0) damage = 0;
            this.joueur2.pv -= damage;

            this.updateHealthBar(this.healthBar2, this.barX2, this.barY2, this.barWidth, this.barHeight, this.joueur2.pv / 100, this.joueur2.pv);
            this.checkDeath();
        });
    }

    handleDefenseClick() {
        this.defenseJ1 = true;
    }

    handleRunClick() {
        // Logique de fuite pour le joueur 1
    }

    handleAttackClick2() {
        if (this.joueurSprite2.anims.getName() === 'attack' || this.isMoving) return;

        this.defenseJ2 = false;
        this.joueurSprite2.anims.play('attack2', true);
        this.time.delayedCall(1000, () => {
            let damage = this.joueur2.attaque;
            if (this.defenseJ1) {
                damage -= this.joueur.defense;
            }
            if (damage < 0) damage = 0;
            this.joueur.pv -= damage;

            this.updateHealthBar(this.healthBar, this.barX, this.barY, this.barWidth, this.barHeight, this.joueur.pv / 100, this.joueur.pv);
            this.checkDeath();
        });
    }

    handleDefenseClick2() {
        this.defenseJ2 = true;
    }

    handleRunClick2() {
        // Logique de fuite pour le joueur 2
    }

    checkDeath() {
        if (this.joueur.pv <= 0 && !this.isDead) {
            this.isDead = true;
            this.joueurSprite.anims.play('death', true);
            this.time.delayedCall(1000, () => {
                this.joueurSprite.anims.play('deathStatic', true);
                this.deathText.setText('Défaite du Chevalier !').setAlpha(1);
            });
        } else if (this.joueur2.pv <= 0 && !this.isDead) {
            this.isDead = true;
            this.joueurSprite2.anims.play('death2', true);
            this.time.delayedCall(1000, () => {
                this.joueurSprite2.anims.play('deathStatic2', true);
                this.winText.setText('Victoire du Chevalier !').setAlpha(1);
            });
        }
    }
}

export default CombatScene;
