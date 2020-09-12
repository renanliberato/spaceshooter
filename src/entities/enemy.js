import { Ship } from './ship';

export class Enemy extends Ship {
    constructor(game) {
        super(game, 'red');

        this.tag = 'enemy';
        this.maxHealth = 1;
        this.health = 1;
        this.bulletTargetTag = 'player';
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

        this.isFiring = false;
        this.acceleratingFrontwards = false;
        this.acceleratingBackwards = false;
        
        if (this.shouldAct()) {
            const angleTowardsPlayer = this.getAngleTowardsObject(player);
            this.rotateToAngle(angleTowardsPlayer);

            if (isFarFromPlayer) {
                this.acceleratingFrontwards = true;
                this.acceleratingBackwards = false;
            } else {
                this.isFiring = true;
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