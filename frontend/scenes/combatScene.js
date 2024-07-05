class Personnage {
    constructor(pv, attaque, defense) {
        this.pv = pv;
        this.attaque = attaque;
        this.defense = defense;
    }
}

function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}

loadFont('MCFont', './assets_old/fonts/Minecraftia.ttf')

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
        this.turn = 'joueur'; // track whose turn it is
        this.defenseJ1 = false;
        this.defenseJ2 = false;
        this.resistance = 2;
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

        let windowWidth = 800;
        let windowHeight = 600;
        let margin = 20;

        this.add.image(windowWidth / 2, windowHeight / 2, 'background').setDisplaySize(windowWidth, windowHeight);
        this.joueur = new Personnage(100, 40, 15);
        this.joueurSprite = this.add.sprite(windowWidth / 4, windowHeight / 2, 'joueur');
        this.initialX = this.joueurSprite.x;
        this.initialY = this.joueurSprite.y;
        this.joueurSprite.setScale(4);

        this.joueur2 = new Personnage(100, 40, 15);
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



        this.barX = margin; // Marge à gauche
        this.barY = margin; // Marge en haut
        this.healthBar = this.add.graphics();
        this.updateHealthBar(this.healthBar, this.barX, this.barY, this.barWidth, this.barHeight, this.joueur.pv / 100, this.joueur.pv);

        this.barX2 = windowWidth - this.barWidth - margin;
        this.barY2 = margin; // Marge en haut
        this.healthBar2 = this.add.graphics();
        this.updateHealthBar(this.healthBar2, this.barX2, this.barY2, this.barWidth, this.barHeight, this.joueur2.pv / 100, this.joueur2.pv);
        // Ajout des écouteurs pour les touches 'A' et 'D'
        this.input.keyboard.on('keydown-A', () => this.handleAttackClick());
        this.input.keyboard.on('keydown-D', () => this.handleDefenseClick());

        // Ajouter les boutons sous le joueur
        this.createButton(100, windowHeight / 1.2, 150, 50, 'Attack [A]', () => this.handleAttackClick());
        this.createButton(300, windowHeight / 1.2, 150, 50, 'Defense [D]', () => this.handleDefenseClick());

        // Ajouter le texte pour les actions des personnages
        this.actionText = this.add.text(windowWidth / 2, windowHeight / 4, '', {
            font: '16px MCFont',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
    }

    update() {
    }

    createAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('joueurIdle', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('joueurAttack', { start: 0, end: 3 }),
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
            key: 'attack2',
            frames: this.anims.generateFrameNumbers('goblinAttack', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'death2',
            frames: this.anims.generateFrameNumbers('goblinDeath', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'deathStatic2',
            frames: [{ key: 'goblinDeathStatic', frame: 3 }],
            frameRate: 10,
            repeat: -1
        });
    }

    createButton(x, y, width, height, text, onClick) {
        let button = this.add.rectangle(x, y, width, height, 0xffffff).setInteractive();
        this.add.text(x, y, text, { font: '16px Arial', fill: '#000000' }).setOrigin(0.5);
        button.on('pointerup', onClick);
        return button;
    }

    handleAttackClick() {
        if (this.isMoving || this.turn !== 'joueur') return;
        this.isMoving = true;

        this.joueurSprite.anims.play('attack', true);
        this.updateActionText('Joueur attaque !');
        this.time.delayedCall(1000, () => {
            this.isMoving = false;
            this.joueurSprite.anims.play('idle', true);

            let damage = this.joueur.attaque - (this.defenseJ2 ? this.joueur2.defense * this.resistance : this.joueur2.defense);
            this.joueur2.pv -= Math.max(damage, 0);
            this.updateHealthBar(this.healthBar2, this.barX2, this.barY2, this.barWidth, this.barHeight, this.joueur2.pv / 100, this.joueur2.pv);
            if (this.joueur2.pv <= 0) {
                this.joueurSprite2.anims.play('death2', true);
                this.isDead = true;
                this.winText.setText('Vous avez gagné !').setAlpha(1);
                this.time.delayedCall(3000, () => {
                    this.scene.switch('GameScene');
                });
            } else {
                this.turn = 'ennemi';
                this.enemyTurn();
            }
        });
    }

    handleDefenseClick() {
        if (this.turn !== 'joueur') return;
        this.defenseJ1 = true;
        this.joueurSprite.setTint(0x00ff00);
        this.updateActionText('Joueur se défend !');
        this.time.delayedCall(1000, () => {
            this.defenseJ1 = false;
            this.joueurSprite.clearTint();
            this.turn = 'ennemi';
            this.enemyTurn();
        });
    }

    enemyTurn() {
        if (this.isDead) {
            this.time.delayedCall(2000, () => {
                this.scene.switch('GameScene');
            });
        }

        this.time.delayedCall(1000, () => {
            // Randomly decide if the enemy attacks or defends
            if (Math.random() < 0.5) {
                this.enemyAttack();
            } else {
                this.enemyDefense();
            }
        });
    }

    enemyAttack() {
        this.joueurSprite2.anims.play('attack2', true);
        this.updateActionText('Ennemi attaque !');
        this.time.delayedCall(1000, () => {
            this.joueurSprite2.anims.play('idle2', true);

            let damage = this.joueur2.attaque - (this.defenseJ1 ? this.joueur.defense * this.resistance : this.joueur.defense);
            this.joueur.pv -= Math.max(damage, 0);
            this.updateHealthBar(this.healthBar, this.barX, this.barY, this.barWidth, this.barHeight, this.joueur.pv / 100, this.joueur.pv);
            if (this.joueur.pv <= 0) {
                this.joueurSprite.anims.play('death', true);
                this.isDead = true;
                this.deathText.setText('Vous avez perdu !').setAlpha(1);
            } else {
                this.turn = 'joueur';
            }
        });
    }

    enemyDefense() {
        this.defenseJ2 = true;
        this.joueurSprite2.setTint(0x00ff00);
        this.updateActionText('Ennemi se défend !');
        this.time.delayedCall(1000, () => {
            this.defenseJ2 = false;
            this.joueurSprite2.clearTint();
            this.turn = 'joueur';
        });
    }

    updateHealthBar(healthBar, x, y, width, height, percentage, pv) {
        healthBar.clear();
        healthBar.fillStyle(0xff0000, 1);
        healthBar.fillRect(x, y, width, height);
        healthBar.fillStyle(0x00ff00, 1);
        healthBar.fillRect(x, y, width * percentage, height);
        healthBar.lineStyle(2, 0x000000, 1);
        healthBar.strokeRect(x, y, width, height);
    }

    updateActionText(text) {
        this.actionText.setText(text);
        this.actionText.setAlpha(1);
        this.time.delayedCall(2000, () => {
            this.actionText.setAlpha(0);
        });
    }
}

export default CombatScene;
