import { Ship } from './ship';
import { FireBehaviour } from './components/fireBehaviour';
import { ShipABehaviour } from './components/shipABehaviour';

export class EnemyPlayer extends Ship {
    constructor(game) {
        super(game, 'red');

        this.tag = 'enemy';
        this.addComponent(new FireBehaviour(this, 0.5, this.game.sizeFromHeight(6), this.id+'bullet', 'player'));
        this.addComponent(new ShipABehaviour(this, 'orange'));
    }
}