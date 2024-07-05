class Enemie {
    constructor(scene, x, y, key) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, key).setScale(1.5).setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
        console.log(x, y);
    }

    movementStarter() {
        this.sprite.setVelocityX(50);
    }

    moveLeft() {
        
    }

    moveRight() {
        
    }

    moveUp() {
        
    }

    moveDown() {
        
    }
}