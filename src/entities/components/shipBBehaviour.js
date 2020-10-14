import { ShipBFireBehaviour } from './shipBFireBehaviour';
import IMAGES from '../../images/images';
import { ShipBehaviour } from './shipBehaviour';

export class ShipBBehaviour extends ShipBehaviour {
    constructor(gameobject, game, color, enemytag) {
        super(gameobject, game, IMAGES[`playerShip1_${color}`], IMAGES[`playerShip1_damage1`], IMAGES[`playerShip1_damage2`], IMAGES[`playerShip1_damage3`]);

        this.addComponent(new ShipBFireBehaviour(this.gameobject, this.game, 0.3, 6, this.gameobject.id+'bullet', enemytag));
        this.fireBehaviour = this.getComponent(ShipBFireBehaviour);
    }
}