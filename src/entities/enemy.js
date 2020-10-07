import { Ship } from './ship';
import { FireBehaviour } from './components/fireBehaviour';
import { HealthBehaviour } from './components/healthBehaviour';
import { ShipABehaviour } from './components/shipABehaviour';

export class Enemy extends Ship {
    constructor(game) {
        super(game, 'red');

        this.tag = 'enemy';
        this.addComponent(new ShipABehaviour(this, this.game, 'orange', 'player'));
        this.getComponent(HealthBehaviour).health = 1;
        this.getComponent(HealthBehaviour).maxHealth = 1;
    }

    update() {
        super.update();
        const fireBehaviour = this.getComponent(FireBehaviour);

        const players = this.game.entities.filter(e => e.tag == 'player');
        if (players.length == 0) {
            return;
        }

        const player = players[0];

        const distanceFromPlayer = Math.abs((this.x - player.x + this.y - player.y) / 2);

        const isFarFromPlayer = distanceFromPlayer > 80;

        if (fireBehaviour) fireBehaviour.isFiring = false;
        this.acceleratingFrontwards = false;
        this.acceleratingBackwards = false;
        
        if (this.shouldAct()) {
            const angleTowardsPlayer = this.getAngleTowardsObject(player);
            this.rotateToAngle(angleTowardsPlayer);

            if (isFarFromPlayer) {
                this.acceleratingFrontwards = true;
                this.acceleratingBackwards = false;
            } else {
                if (fireBehaviour) fireBehaviour.isFiring = true;
            }
        }
    }

    shouldAct() {
        return Math.random() > 0.5;
    }

    onDestroy() {
        super.onDestroy();

        document.dispatchEvent(new CustomEvent('enemy_destroyed', {
            detail: {
                enemiesLeft: this.game.entities.filter(e => e.tag == 'enemy' && !e.destroyed).length
            }
        }));
    }
}