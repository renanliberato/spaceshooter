import { ShipCFireBehaviour } from './shipCFireBehaviour';
import IMAGES from '../../images/images';
import { ShipBehaviour } from './shipBehaviour';

export class ShipCBehaviour extends ShipBehaviour {
    constructor(gameobject, game, color, enemytag) {
        color = color == 'orange' ? 'red' : color;
        super(gameobject, game, IMAGES[`ufo_${color}`], IMAGES[`playerShip1_damage1`], IMAGES[`playerShip1_damage2`], IMAGES[`playerShip1_damage3`]);

        this.addComponent(new ShipCFireBehaviour(this.gameobject, this.game, 1, 4, this.gameobject.id+'bullet', enemytag));
        this.fireBehaviour = this.getComponent(ShipCFireBehaviour);
    }
}