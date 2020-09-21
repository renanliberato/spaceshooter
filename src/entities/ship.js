import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { Trail } from './trail';
import { HealthBehaviour } from './components/healthBehaviour';

export class Ship extends GameObject {
    constructor(game, color) {
        super(game);

        this.particles = []
        this.isShip = true;
        this.tag = 'ship';
        this.dx = 0;
        this.dy = 0;
        this.angle = 0;
        this.rotateSpeed = 4;
        this.accelerationForce = 0.01;
        this.dashForce = 2;
        this.dashDecreaseForce = 0.07;
        this.dashDecreaseTreshold = 0.3;
        this.trailSpeed = 0.1;
        this.lastTrailTime = 0;
        
        this.updateToServerOn = 10;

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

        this.addComponent(new HealthBehaviour(this, 10));
    }

    getHealth() {
        return this.getComponent(HealthBehaviour);
    }

    createTrail() {
        return;
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

    onFire() {

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

    update() {
        super.update();
        this.createTrail();
        this.moveShip();

        if (this.id == this.game.player.id && this.game.isConnected && --this.updateToServerOn <= 0) {
            this.game.connection.invoke("UpdateShipPosition", this.game.matchId, this.id, {
                x: this.x,
                y: this.y,
                dx: this.dx,
                dy: this.dy,
                angle: this.object.angle,
                health: this.getHealth().health,
                rotatingLeft: this.rotatingLeft,
                rotatingRight: this.rotatingRight,
                dashingLeft: this.dashingLeft,
                dashingRight: this.dashingRight,
                acceleratingFrontwards: this.acceleratingFrontwards,
                acceleratingBackwards: this.acceleratingBackwards,
            });
            this.updateToServerOn = 1;
        }
    }

    onDestroy() {
        super.onDestroy();

        if (this.isVisible)
            AudioManager.play(AudioManager.audios.explosion);
    }
}