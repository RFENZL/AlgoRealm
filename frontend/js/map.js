var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var character;

function preload ()
{
    // Chargez le fichier JSON de la carte Tiled
    this.load.tilemapTiledJSON('map', 'assets/maps_json/map.json');

    // Chargez les images de la carte
    this.load.image('sol', 'assets/sol.png');
    this.load.image('arbres', 'assets/arbres.png');
    this.load.image('houses', 'assets/houses.png');

    // Chargez l'image du personnage
    this.load.image('character', 'assets/main_menu/gemme_logo.png');

    this.load.on('complete', () => {
        // Créez un personnage à partir de la classe Character
        character = new Character(this, 400, 300, 'character');
    });
}

function create ()
{
    // Create the map from the Tiled JSON file
    var map = this.make.tilemap({ key: 'map' });

    // Add the tileset images
    var solTiles = map.addTilesetImage('sol');
    var arbresTiles = map.addTilesetImage('arbres');
    var housesTiles = map.addTilesetImage('houses');

    // Create the map layers
    var solLayer = map.createLayer('sol', solTiles);
    var arbresLayer = map.createLayer('arbres', arbresTiles);
    var housesLayer = map.createLayer('houses', housesTiles);

    // Set the collisions for the map layers
    solLayer.setCollisionByProperty({ collides: true });
    arbresLayer.setCollisionByProperty({ collides: true });
    housesLayer.setCollisionByProperty({ collides: true });

    // Add the collision between the character and the map layers
    this.physics.add.collider(character.sprite, solLayer);
    this.physics.add.collider(character.sprite, arbresLayer);
    this.physics.add.collider(character.sprite, housesLayer);
}

function update ()
{
    character.stop();

    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT), 1)) {
        character.moveLeft(200);
    }
    else if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT), 1)) {
        character.moveRight(200);
    }

    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP), 1)) {
        character.moveUp(200);
    }
    else if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN), 1)) {
        character.moveDown(200);
    }
}