import { GameObject } from '../gameobject';
import { HealthBehaviour } from './healthBehaviour';
import { ShipCFireBehaviour } from './shipCFireBehaviour';
import { loadImage } from 'canvas';
import IMAGES from '../../images/images';

export class ShipCBehaviour extends GameObject {
    constructor(gameobject, game, color, enemytag) {
        super(game);
        this.gameobject = gameobject;

        this.addComponent(new ShipCFireBehaviour(this.gameobject, this.game, 1, 4, this.gameobject.id+'bullet', enemytag));
        this.fireBehaviour = this.getComponent(ShipCFireBehaviour);
        this.gameobject.shipBehaviour = this;

        //color = color.charAt(0).toUpperCase() + color.slice(1)

        loadImage(IMAGES[`ufo_${color}`]).then(image => {
            this.gameobject.shipImage = image;
        });

        this.damageImages = []
        loadImage(IMAGES[`playerShip1_damage1`]).then(image => {
            this.damageImage1 = image;
        });
        loadImage(IMAGES[`playerShip1_damage2`]).then(image => {
            this.damageImage2 = image;
        });
        loadImage(IMAGES[`playerShip1_damage3`]).then(image => {
            this.damageImage3 = image;
        });

        this.disposables.push(
            this.gameobject.emitter.on("TookDamage", ({id, amount, health}) => {
                if (this.gameobject.id == id) {
                    this.startDamageAnimation();
                }
            })
        );
    }

    startDamageAnimation() {
        const healthBehaviour = this.gameobject.getComponent(HealthBehaviour);
        const healthPercent = healthBehaviour.getPercent();

        if (healthPercent == 0 && this.damageImage3) {
            [1,2,3,4,5,6,7,8,9,10].forEach(k => {
                const damageAnimation = new ShipADamageAnimation(this.game);
                damageAnimation.image = this.damageImage3;

                damageAnimation.x = this.gameobject.x;
                damageAnimation.y = this.gameobject.y;

                this.game.instantiateEntity(damageAnimation);
            })
            return;
        }

        if (healthPercent <= 0.3 && this.damageImage3) {
            const damageAnimation = new ShipADamageAnimation(this.game);
            damageAnimation.image = this.damageImage3;

            damageAnimation.x = this.gameobject.x;
            damageAnimation.y = this.gameobject.y;

            this.game.instantiateEntity(damageAnimation);
            return;
        }

        if (healthPercent <= 0.6 && this.damageImage2) {
            const damageAnimation = new ShipADamageAnimation(this.game);
            damageAnimation.image = this.damageImage2;

            damageAnimation.x = this.gameobject.x;
            damageAnimation.y = this.gameobject.y;

            this.game.instantiateEntity(damageAnimation);
            return;
        }

        if (this.damageImage1) {
            const damageAnimation = new ShipADamageAnimation(this.game);
            damageAnimation.image = this.damageImage1;

            damageAnimation.x = this.gameobject.x;
            damageAnimation.y = this.gameobject.y;

            this.game.instantiateEntity(damageAnimation);
            return;
        }
    }
}

export class ShipADamageAnimation extends GameObject {
    constructor(game) {
        super(game);
        this.image = null;
        this.dy = Math.random() * 4;
        this.angle = Math.random() * 360;
        this.destroyAfter(1);
    }

    update() {
        super.update();
        if (this.dy > 0)
            this.dy -= 0.1
        this.moveAccordingToAngle('front', this.angle, this.dy);
    }

    render() {
        super.render();
        const center = this.getCenterCanvasCoords();
        this.drawImage(this.image, center.x, center.y, 0.5, this.angle);
    }
}