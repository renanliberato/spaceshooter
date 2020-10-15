import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { Trail } from './trail';
import { HealthBehaviour } from './components/healthBehaviour';
import { isMobile } from '../config';
import IMAGES from '../images/images';


export class Ship extends GameObject {
    constructor(game, color) {
        super(game);

        this.color = color;
        this.particles = []
        this.isShip = true;
        this.tag = 'ship';
        this.rotateSpeed = 4;
        this.accelerationForce = 0.04;
        this.dashForce = 7;
        this.dashDecreaseForce = 0.12;
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

        this.addComponent(new HealthBehaviour(this, this.game, 10));
    }

    getHealth() {
        return this.getComponent(HealthBehaviour);
    }

    createTrail() {
        if (this.game.time - this.lastTrailTime <= this.trailSpeed || this.transform.dy == 0) {
            return;
        }
        this.lastTrailTime = this.game.time;
        
        var t = new Trail(this.game, this);
        t.destroyAfter(this.trailSpeed * 4);
        this.game.instantiateEntity(t);

        t.transform.moveAccordingToAngle('left', this.transform.angle, this.game.sizeFromWidth(1));
        t.transform.moveAccordingToAngle('front', this.transform.angle, this.transform.height * -0.5);
        
        var t = new Trail(this.game, this);
        t.destroyAfter(this.trailSpeed * 4);
        this.game.instantiateEntity(t);
        
        t.transform.moveAccordingToAngle('right', this.transform.angle, this.game.sizeFromWidth(1));
        t.transform.moveAccordingToAngle('front', this.transform.angle, this.transform.height * -0.5);
    }

    accelerateFrontwards() {
        this.transform.dy = Math.min(this.maxSpeed, this.transform.dy + this.acceleratingFrontwards * this.game.sizeFromHeight(this.accelerationForce));
    }

    accelerateBackwards() {
        this.transform.dy = Math.max(-this.maxSpeed, this.transform.dy - this.acceleratingBackwards * this.game.sizeFromHeight(this.accelerationForce));
    }

    deaccelerateFrontwards() {
        if (!this.acceleratingFrontwards && this.transform.dy > 0)
            this.transform.dy -= this.game.sizeFromHeight(this.accelerationForce);
    }

    deaccelerateBackwards() {
        if (!this.acceleratingBackwards && this.transform.dy < 0)
            this.transform.dy += this.game.sizeFromHeight(this.accelerationForce);
    }

    dashLeft() {
        this.dashingLeft = true;
        this.transform.dx = this.game.sizeFromWidth(this.dashForce) * -1;
    }

    dashRight() {
        this.dashingRight = true;
        this.transform.dx = this.game.sizeFromWidth(this.dashForce);
    }

    moveShip() {
        if (!this.acceleratingFrontwards && !this.acceleratingBackwards && Math.abs(this.transform.dy) <= 0.1) {
            this.transform.dy = 0;
        }

        this.accelerateFrontwards();
        this.deaccelerateFrontwards();

        this.accelerateBackwards();
        this.deaccelerateBackwards();

        if (this.rotatingLeft) {
            this.transform.rotateAngle(this.rotateSpeed * -1);
        }

        if (this.rotatingRight) {
            this.transform.rotateAngle(this.rotateSpeed);
        }

        if (this.dashingRight) {
            if (this.transform.dx > this.game.sizeFromWidth(this.dashDecreaseTreshold)) {
                this.transform.dx -= this.game.sizeFromWidth(this.dashDecreaseForce);
            } else {
                this.transform.dx = 0;
                this.dashingRight = false;
            }
        }

        if (this.dashingLeft) {
            if (this.transform.dx < this.game.sizeFromWidth(this.dashDecreaseTreshold)) {
                this.transform.dx += this.game.sizeFromWidth(this.dashDecreaseForce);
            } else {
                this.transform.dx = 0;
                this.dashingLeft = false;
            }
        }

        this.transform.moveAccordingToAngle('front', this.transform.angle, this.transform.dy);
        this.transform.moveAccordingToAngle('left', this.transform.angle, this.transform.dx);
    }

    update() {
        super.update();
        this.createTrail();
        this.moveShip();

        if (this.id == this.game.player.id && this.game.isConnected && --this.updateToServerOn <= 0) {
            this.emitter.emit("ShipPositionUpdated", {
                name: "ShipPositionUpdated",
                shipId: this.id,
                x: this.transform.x,
                y: this.transform.y,
                dx: this.transform.dx,
                dy: this.transform.dy,
                angle: this.transform.angle,
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
        super.render();
        const centerCoords = this.transform.getCenterCanvasCoords();

        this.game.context.font = "12px Comic Sans MS";
        this.game.context.fillStyle = '#fff';
        this.game.context.fillText(this.username, centerCoords.x - (this.username.length * 3), centerCoords.y - this.transform.width * 0.5 - 10);
    }

    onDestroy() {
        super.onDestroy();

        if (this.transform.isVisible)
            AudioManager.play(AudioManager.audios.explosion);
    }
}