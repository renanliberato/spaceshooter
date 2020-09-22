import { Ship } from './ship';
import { FireBehaviour } from './components/fireBehaviour';
import { HealthBehaviour } from './components/healthBehaviour';

export class Enemy extends Ship {
    constructor(game) {
        super(game, 'red');

        this.tag = 'enemy';
        this.addComponent(new FireBehaviour(this, 0.5, this.game.sizeFromHeight(2), this.id+'bullet', 'player'));
        this.getComponent(HealthBehaviour).health = 1;
        this.getComponent(HealthBehaviour).maxHealth = 1;
    }

    update() {
        super.update();

        const players = this.game.entities.filter(e => e.tag == 'player');
        if (players.length == 0) {
            return;
        }

        const player = players[0];

        const distanceFromPlayer = Math.abs((this.x - player.x + this.y - player.y) / 2);

        const isFarFromPlayer = distanceFromPlayer > 120;

        this.getComponent(FireBehaviour).isFiring = false;
        this.acceleratingFrontwards = false;
        this.acceleratingBackwards = false;
        
        if (this.shouldAct()) {
            const angleTowardsPlayer = this.getAngleTowardsObject(player);
            this.rotateToAngle(angleTowardsPlayer);

            if (isFarFromPlayer) {
                this.acceleratingFrontwards = true;
                this.acceleratingBackwards = false;
            } else {
                this.getComponent(FireBehaviour).isFiring = true;
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