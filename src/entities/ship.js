import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { Trail } from './trail';
import { HealthBehaviour } from './components/healthBehaviour';
import { isMobile } from '../config';
import IMAGES from '../images/images';
import { TransformBehaviour } from './components/transformBehaviour';

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
        this.addComponent(new TransformBehaviour(game));
        this.getComponent(TransformBehaviour, transform => {
            transform.width = 25;
            transform.height = 25;
        });
    }

    getHealth() {
        return this.getComponent(HealthBehaviour);
    }

    createTrail() {
        this.getComponent(TransformBehaviour, transform => {
            if (this.game.time - this.lastTrailTime <= this.trailSpeed || transform.dy == 0) {
                return;
            }
            this.lastTrailTime = this.game.time;
            
            var t = new Trail(this.game, this);
            t.destroyAfter(this.trailSpeed * 4);
            this.game.instantiateEntity(t);
    
            t.getComponent(TransformBehaviour, trailTransform => {
                this.getComponent(TransformBehaviour, transform => {
                    trailTransform.moveAccordingToAngle('left', transform.angle, this.game.sizeFromWidth(1));
                    trailTransform.moveAccordingToAngle('front', transform.angle, transform.height * -1);
                });
            });
            
            var t = new Trail(this.game, this);
            t.destroyAfter(this.trailSpeed * 4);
            this.game.instantiateEntity(t);
            
            t.getComponent(TransformBehaviour, trailTransform => {
                this.getComponent(TransformBehaviour, transform => {
                    trailTransform.moveAccordingToAngle('right', transform.angle, this.game.sizeFromWidth(1));
                    trailTransform.moveAccordingToAngle('front', transform.angle, transform.height * -1);
                });
            });
        });
    }

    accelerateFrontwards() {
        this.getComponent(TransformBehaviour, transform => {
            transform.dy = Math.min(this.maxSpeed, transform.dy + this.acceleratingFrontwards * this.game.sizeFromHeight(this.accelerationForce));
        });
    }

    accelerateBackwards() {
        this.getComponent(TransformBehaviour, transform => {
            transform.dy = Math.max(-this.maxSpeed, transform.dy - this.acceleratingBackwards * this.game.sizeFromHeight(this.accelerationForce));
        });
    }

    deaccelerateFrontwards() {
        this.getComponent(TransformBehaviour, transform => {
            if (!this.acceleratingFrontwards && transform.dy > 0)
                transform.dy -= this.game.sizeFromHeight(this.accelerationForce);
        });
    }

    deaccelerateBackwards() {
        this.getComponent(TransformBehaviour, transform => {
            if (!this.acceleratingBackwards && transform.dy < 0)
                transform.dy += this.game.sizeFromHeight(this.accelerationForce);
        });
    }

    dashLeft() {
        this.getComponent(TransformBehaviour, transform => {
            this.dashingLeft = true;
            transform.dx = this.game.sizeFromWidth(this.dashForce) * -1;
        });
    }

    dashRight() {
        this.getComponent(TransformBehaviour, transform => {
            this.dashingRight = true;
            transform.dx = this.game.sizeFromWidth(this.dashForce);
        });
    }

    moveShip() {
        this.getComponent(TransformBehaviour, transform => {
            if (!this.acceleratingFrontwards && !this.acceleratingBackwards && Math.abs(transform.dy) <= 0.1) {
                transform.dy = 0;
            }

            this.accelerateFrontwards();
            this.deaccelerateFrontwards();

            this.accelerateBackwards();
            this.deaccelerateBackwards();

            if (this.rotatingLeft) {
                transform.rotateAngle(this.rotateSpeed * -1);
            }

            if (this.rotatingRight) {
                transform.rotateAngle(this.rotateSpeed);
            }

            if (this.dashingRight) {
                if (transform.dx > this.game.sizeFromWidth(this.dashDecreaseTreshold)) {
                    transform.dx -= this.game.sizeFromWidth(this.dashDecreaseForce);
                } else {
                    transform.dx = 0;
                    this.dashingRight = false;
                }
            }

            if (this.dashingLeft) {
                if (transform.dx < this.game.sizeFromWidth(this.dashDecreaseTreshold)) {
                    transform.dx += this.game.sizeFromWidth(this.dashDecreaseForce);
                } else {
                    transform.dx = 0;
                    this.dashingLeft = false;
                }
            }

            transform.moveAccordingToAngle('front', transform.angle, transform.dy);
            transform.moveAccordingToAngle('left', transform.angle, transform.dx);
        });
    }

    update() {
        super.update();
        this.createTrail();
        this.moveShip();

        this.getComponent(TransformBehaviour, transform => {
            if (this.id == this.game.player.id && this.game.isConnected && --this.updateToServerOn <= 0) {
                this.emitter.emit("ShipPositionUpdated", {
                    name: "ShipPositionUpdated",
                    shipId: this.id,
                    x: transform.x,
                    y: transform.y,
                    dx: transform.dx,
                    dy: transform.dy,
                    angle: transform.angle,
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
        });
    }

    render() {
        super.render();
        this.getComponent(TransformBehaviour, transform => {
            const centerCoords = transform.getCenterCanvasCoords();

            this.game.context.font = "12px Comic Sans MS";
            this.game.context.fillStyle = '#fff';
            this.game.context.fillText(this.username, centerCoords.x - (this.username.length * 3), centerCoords.y - transform.width - 10);
        });
    }

    onDestroy() {
        super.onDestroy();

        this.getComponent(TransformBehaviour, transform => {
            if (transform.isVisible)
            AudioManager.play(AudioManager.audios.explosion);
        });
    }
}