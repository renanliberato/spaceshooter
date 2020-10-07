import { Ship } from './ship';
import { ShipABehaviour } from './components/shipABehaviour';

export class EnemyPlayer extends Ship {
    constructor(game) {
        super(game, 'red');

        this.tag = 'enemy';
        this.addComponent(new ShipABehaviour(this, this.game, 'orange', 'player'));
    }
}