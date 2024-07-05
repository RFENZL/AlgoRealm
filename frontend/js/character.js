class Character {
    constructor(scene, x, y, key) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, key).setScale(0.5);

        this.sprite.setCollideWorldBounds(true);
    }

    moveLeft(speed) {
        this.sprite.setVelocityX(-speed);
    }

    moveRight(speed) {
        this.sprite.setVelocityX(speed);
    }

    moveUp(speed) {
        this.sprite.setVelocityY(-speed);
    }

    moveDown(speed) {
        this.sprite.setVelocityY(speed);
    }

    stop() {
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(0);
    }
}