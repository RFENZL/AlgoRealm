class Enemie {
    constructor(scene, x, y, key) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, key).setScale(0.5).setImmovable(true);

        // Empêcher le personnage de sortir des limites du monde du jeu
        this.sprite.setCollideWorldBounds(true);
    }
}