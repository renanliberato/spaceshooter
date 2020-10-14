import { ShipAFireBehaviour } from './shipAFireBehaviour';
import IMAGES from '../../images/images';
import { ShipBehaviour } from './shipBehaviour';

export class ShipABehaviour extends ShipBehaviour {
    constructor(gameobject, game, color, enemytag) {
        super(gameobject, game, IMAGES[`playerShip2_${color}`], IMAGES[`playerShip2_damage1`], IMAGES[`playerShip2_damage2`], IMAGES[`playerShip2_damage3`]);

        this.addComponent(new ShipAFireBehaviour(this.gameobject, this.game, 0.5, 12, this.gameobject.id+'bullet', enemytag));
        this.fireBehaviour = this.getComponent(ShipAFireBehaviour);
    }
}