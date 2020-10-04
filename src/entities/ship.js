import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { Trail } from './trail';
import { HealthBehaviour } from './components/healthBehaviour';
import { createNanoEvents } from 'nanoevents';
import { isMobile } from '../config';

export class Ship extends GameObject {
    constructor(game, color) {
        super(game);

        this.color = color;
        this.particles = []
        this.isShip = true;
        this.tag = 'ship';
        this.dx = 0;
        this.dy = 0;
        this.width = 12.5;
        this.height = 12.5;
        this.rotateSpeed = 4;
        this.accelerationForce = 0.04;
        this.dashForce = 4;
        this.dashDecreaseForce = 0.04;
        this.dashDecreaseTreshold = 0.3;
        this.trailSpeed = 0.05;
        this.lastTrailTime = 0;
        this.username = 'Ship';
        this.maxSpeed = isMobile ? 2 : 5;
        
        this.updateToServerOn = 10;

        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.dashingLeft = false;
        this.dashingRight = false;
        this.acceleratingFrontwards = false;
        this.acceleratingBackwards = false;

        this.emitter = createNanoEvents();

        this.addComponent(new HealthBehaviour(this, 10));
    }

    getHealth() {
        return this.getComponent(HealthBehaviour);
    }

    createTrail() {
        if (this.game.time - this.lastTrailTime <= this.trailSpeed || this.dy == 0) {
            return;
        }
        this.lastTrailTime = this.game.time;
        
        var t = new Trail(this.game, this);
        t.destroyAfter(this.trailSpeed * 4);
        t.moveAccordingToAngle('left', this.angle, this.game.sizeFromWidth(1));
        this.game.instantiateEntity(t);
        
        var t = new Trail(this.game, this);
        t.destroyAfter(this.trailSpeed * 4);
        t.moveAccordingToAngle('right', this.angle, this.game.sizeFromWidth(1));
        this.game.instantiateEntity(t);
    }

    accelerateFrontwards() {
        this.dy = Math.min(this.maxSpeed, this.dy + this.acceleratingFrontwards * this.game.sizeFromHeight(this.accelerationForce));
    }

    accelerateBackwards() {
        this.dy = Math.max(-this.maxSpeed, this.dy - this.acceleratingBackwards * this.game.sizeFromHeight(this.accelerationForce));
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

        this.moveAccordingToAngle('front', this.angle, this.dy);
        this.moveAccordingToAngle('left', this.angle, this.dx);
    }

    update() {
        super.update();
        this.createTrail();
        this.moveShip();

        if (this.id == this.game.player.id && this.game.isConnected && --this.updateToServerOn <= 0) {
            this.emitter.emit("ShipPositionUpdated", {
                name: "ShipPositionUpdated",
                shipId: this.id,
                x: this.x,
                y: this.y,
                dx: this.dx,
                dy: this.dy,
                angle: this.angle,
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

    render() {
        const centerCoords = this.getCenterCanvasCoords();

        this.drawPolygon(
            centerCoords.x,
            centerCoords.y,
            3,
            this.width,
            1,
            this.color,
            this.color,
            this.angle
        );

        const pointerCoords = this.getCoordsTowardsDirection(
            centerCoords.x,
            centerCoords.y,
            'front',
            this.angle,
            this.width * 3 / 4
        );
        const pointerSize = this.width / 4;

        this.drawPolygon(
            pointerCoords.x,
            pointerCoords.y,
            3,
            pointerSize,
            1,
            'red',
            'red',
            this.angle
        );

        this.game.context.font = "12px Comic Sans MS";
        this.game.context.fillStyle = '#fff';
        this.game.context.fillText(this.username, centerCoords.x - (this.username.length * 3), centerCoords.y - this.width - 10);
    }

    onDestroy() {
        super.onDestroy();

        if (this.isVisible)
            AudioManager.play(AudioManager.audios.explosion);
    }
}