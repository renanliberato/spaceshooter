import { Ship } from './ship';
import { ShipABehaviour } from './components/shipABehaviour';
import { ShipBBehaviour } from './components/shipBBehaviour';
import { ShipCBehaviour } from './components/shipCBehaviour';

const shipToClass = {
    Alpha: ShipABehaviour,
    Beta: ShipBBehaviour,
    Ovni: ShipCBehaviour,
}

export class EnemyPlayer extends Ship {
    constructor(game, ship) {
        super(game, 'red');

        this.tag = 'enemy';
        const Class = shipToClass[ship]
        this.addComponent(new Class(this, this.game, 'orange', 'player'));
    }
}