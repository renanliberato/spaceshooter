import { Ship } from './ship';

export class Enemy extends Ship {
    constructor(game) {
        super(game);

        this.bulletTag = 'enemybullet';
        this.tag = 'enemy';
        this.curCommand = 'right';
        this.isFiring = true;

        this.object.width = game.sizeFromWidth(5);
        this.object.height = game.sizeFromWidth(5);
        this.object.fill = 'red';
        this.object.left = game.canvas.getWidth() / 2 - this.object.width / 2;
        this.object.top = this.game.ui.enemyHealthBar.top + this.game.ui.enemyHealthBar.height + this.game.sizeFromHeight(6);
        this.object.rotate(180);
        this.object.setCoords();
    }

    moveShip() {
        super.moveShip();

        if (Math.random() <= 0.01) {
            console.log('inverting');
            this.curCommand = this.curCommand == 'right' ? 'left' : 'right';
        }
    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.destroy();
        }
    }

    moveBullet(obj) {
        obj.top += this.bulletSpeed;
    }

    checkBulletHit(b) {
        if (b.object.intersectsWithObject(this.game.player.object)) {
            this.game.player.takeDamage(1);

            return true;
        }

        return false;
    }

    onDestroy() {
        this.game.entities.filter(e => e.tag == 'enemybullet').forEach(bullet => bullet.destroy());
        document.dispatchEvent(new Event('enemy_destroyed'));
    }
}