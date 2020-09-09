import { GameObject } from './gameobject';
import { Bullet } from './bullet';

export class Ship extends GameObject {
    constructor(game) {
        super(game);

        this.maxHealth = 3;
        this.health = 3;
        this.curCommand = 'none';
        this.isFiring = false;
        this.firingSpeed = 1;
        this.lastFireTime = 0;
        this.tag = 'ship';
        this.bulletTag = 'bullet';
        this.bulletSpeed = this.game.sizeFromHeight(3);
        this.setSpeed(0.3);

        this.setObject(new fabric.Triangle({
            left: 0,
            top: 0,
            fill: '#fff',
        }));
    }

    setSpeed(s) {
        this.speed = this.game.sizeFromHeight(s);
    }

    fire() {
        if (!this.isFiring)
            return;

        if (this.game.time - this.lastFireTime <= this.firingSpeed) {
            return;
        }
        this.lastFireTime = this.game.time;
        const bullet = this.createBullet();

        this.game.instantiateEntity(bullet);
    }

    moveBullet() {

    }

    createBullet() {
        return new Bullet(
            this.game,
            new fabric.Rect({
                fill: this.object.fill,
                left: this.object.getCenterPoint().x,
                top: this.object.getCenterPoint().y,
                width: this.game.sizeFromWidth(1),
                height: this.game.sizeFromHeight(3),
            }),
            this.moveBullet.bind(this),
            this.bulletTag
        );
    }

    moveShip() {
        switch (this.curCommand) {
            case 'left':
                this.object.left -= this.speed;
                break;
            case 'right':
                this.object.left += this.speed;
                break;
        }
    }

    hitLeftWall() {
        this.object.left = 30;
    }

    hitRightWall() {
        this.object.left = this.game.canvas.getWidth() - this.object.width;
    }

    move() {
        this.moveShip();
        
        if (this.object.left < 30)
            this.hitLeftWall();

        if (this.object.left > this.game.canvas.getWidth() - this.object.width)
            this.hitRightWall();

        this.object.setCoords();

    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.destroy();
        }
    }

    checkBulletHit() {

    }

    processBullets() {
        this.game.entities.filter(e => e.tag == this.bulletTag).forEach((b) => {
            b.move();

            if (b.top >= this.game.canvas.getHeight()) {
                b.destroy();
                return;
            }

            if (this.checkBulletHit(b)) {
                b.destroy();
            }
        });
    }

    onDestroy() {
        this.game.entities.filter(e => e.tag == this.bulletTag).forEach(bullet => bullet.destroy());
    }
}