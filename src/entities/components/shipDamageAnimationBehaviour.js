import { GameObject } from '../gameobject';
import { HealthBehaviour } from './healthBehaviour';
import { ShipDamageAnimation } from './shipDamageAnimation';

export class ShipDamageAnimationBehaviour extends GameObject {
    constructor(gameobject, game, image1, image2, image3) {
        super(game);
        this.gameobject = gameobject;

        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;

        this.startDamageAnimation = this.startDamageAnimation.bind(this);
    }

    startDamageAnimation() {
        const healthBehaviour = this.gameobject.getComponent(HealthBehaviour);
        const healthPercent = healthBehaviour.getPercent();

        if (healthPercent == 0) {
            [1,2,3,4,5,6,7,8,9,10].forEach(k => {
                this.game.instantiateEntity(new ShipDamageAnimation(this.game, this.gameobject, this.image3));
            })
            return;
        }

        if (healthPercent <= 0.3) {
            this.game.instantiateEntity(new ShipDamageAnimation(this.game, this.gameobject, this.image3));
            return;
        }

        if (healthPercent <= 0.6) {
            this.game.instantiateEntity(new ShipDamageAnimation(this.game, this.gameobject, this.image2));
            return;
        }

        this.game.instantiateEntity(new ShipDamageAnimation(this.game, this.gameobject, this.image1));
    }
}