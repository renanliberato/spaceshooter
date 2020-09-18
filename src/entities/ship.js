import { GameObject } from './gameobject';
import { Bullet } from './bullet';
import { AudioManager } from '../audios/AudioManager';
import { Trail } from './trail';

export class Ship extends GameObject {
    constructor(game, color) {
        super(game);

        this.particles = []
        this.isShip = true;
        this.firingSpeed = 1;
        this.lastFireTime = 0;
        this.tag = 'ship';
        this.bulletTag = this.id+'bullet';
        this.bulletSpeed = this.game.sizeFromHeight(2);
        this.dx = 0;
        this.dy = 0;
        this.rotateSpeed = 4;
        this.accelerationForce = 0.01;
        this.dashForce = 2;
        this.dashDecreaseForce = 0.07;
        this.dashDecreaseTreshold = 0.3;
        this.bulletTargetTag = '';
        this.trailSpeed = 0.1;
        this.lastTrailTime = 0;
        
        this.updateToServerOn = 5;

        this.isFiring = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.dashingLeft = false;
        this.dashingRight = false;
        this.acceleratingFrontwards = false;
        this.acceleratingBackwards = false;

        this.setObject(new fabric.Triangle({
            selectable: false,
            left: 0,
            top: 0,
            width: game.sizeFromWidth(5),
            height: game.sizeFromWidth(5),
            originX: 'center',
            originY: 'center',
            fill: color,
        }));
    }

    createTrail() {
        if (this.game.time - this.lastTrailTime <= this.trailSpeed) {
            return;
        }

        this.lastTrailTime = this.game.time;
        
        var t = new Trail(this.game, this);
        t.destroyAfter(this.trailSpeed);
        t.moveAccordingToAngle('left', this.object.angle, this.game.sizeFromWidth(1));
        this.game.instantiateEntity(t);
        
        var t = new Trail(this.game, this);
        t.destroyAfter(this.trailSpeed);
        t.moveAccordingToAngle('left', this.object.angle, this.game.sizeFromWidth(-1));
        this.game.instantiateEntity(t);
    }

    accelerateFrontwards() {
        this.dy = Math.min(5, this.dy + this.acceleratingFrontwards * this.game.sizeFromHeight(this.accelerationForce));
    }

    accelerateBackwards() {
        this.dy = Math.max(-5, this.dy - this.acceleratingBackwards * this.game.sizeFromHeight(this.accelerationForce));
    }

    deaccelerateFrontwards() {
        if (!this.acceleratingFrontwards && this.dy > 0)
            this.dy -= this.game.sizeFromHeight(this.accelerationForce);
    }

    deaccelerateBackwards() {
        if (!this.acceleratingBackwards && this.dy < 0)
            this.dy += this.game.sizeFromHeight(this.accelerationForce);
    }

    moveBullet(angle) {
        return (obj) => {
            obj.moveAccordingToAngle('front', angle, this.bulletSpeed);
        };
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
        
        if (this.isVisible)
            AudioManager.play(AudioManager.audios.shoot);
    }

    createBullet() {
        var bullet = new Bullet(
            this.game,
            new fabric.Rect({
                selectable: false,
                fill: this.object.fill,
                left: this.object.getCenterPoint().x,
                top: this.object.getCenterPoint().y,
                width: this.game.sizeFromWidth(1),
                height: this.game.sizeFromHeight(3),
                originX: 'center',
                originY: 'center',
            }),
            this.moveBullet(this.object.angle),
            this.bulletTag,
            this,
            this.bulletTargetTag
        );
        bullet.destroyAfter(0.5);

        bullet.x = this.x;
        bullet.y = this.y;

        bullet.rotateToAngle(this.object.angle);

        return bullet;
    }

    dashLeft() {
        this.dashingLeft = true;
        this.dx = this.game.sizeFromWidth(this.dashForce) * -1;
    }

    dashRight() {
        this.dashingRight = true;
        this.dx = this.game.sizeFromWidth(this.dashForce);
    }

    moveShip() {
        if (!this.acceleratingFrontwards && !this.acceleratingBackwards && Math.abs(this.dy) <= 0.1) {
            this.dy = 0;
        }

        this.accelerateFrontwards();
        this.deaccelerateFrontwards();

        this.accelerateBackwards();
        this.deaccelerateBackwards();

        if (this.rotatingLeft) {
            this.rotateAngle(this.rotateSpeed * -1);
        }

        if (this.rotatingRight) {
            this.rotateAngle(this.rotateSpeed);
        }

        if (this.dashingRight) {
            if (this.dx > this.game.sizeFromWidth(this.dashDecreaseTreshold)) {
                this.dx -= this.game.sizeFromWidth(this.dashDecreaseForce);
            } else {
                this.dx = 0;
                this.dashingRight = false;
            }
        }

        if (this.dashingLeft) {
            if (this.dx < this.game.sizeFromWidth(this.dashDecreaseTreshold)) {
                this.dx += this.game.sizeFromWidth(this.dashDecreaseForce);
            } else {
                this.dx = 0;
                this.dashingLeft = false;
            }
        }

        this.moveAccordingToAngle('front', this.object.angle, this.dy);
        this.moveAccordingToAngle('left', this.object.angle, this.dx);
    }

    updateHealth(health) {
        this.health = health;

        if (this.health <= 0) {
            this.destroy();
        }
    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.destroy();
        }
    }

    update() {
        super.update();
        this.createTrail();
        this.moveShip();
        this.fire();

        if (this.id == this.game.player.id && this.game.isConnected) {
            this.game.connection.invoke("UpdateShipPosition", this.id, this.x, this.y, this.object.angle, this.health);
            this.updateToServerOn = 1;
        } else {
        }
    }

    onDestroy() {
        super.onDestroy();

        if (this.isVisible)
            AudioManager.play(AudioManager.audios.explosion);
    }
}