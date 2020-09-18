import { Ship } from './ship';

export class EnemyPlayer extends Ship {
    constructor(game) {
        super(game, 'red');

        this.tag = 'enemy';
        this.maxHealth = 1;
        this.health = 1;
        this.bulletTargetTag = 'player';
    }
}