import { Component } from './component'

export class HealthBehaviour extends Component
{
    constructor(gameobject, maxHealth) {
        super(gameobject);
        this.health = maxHealth;
        this.maxHealth = maxHealth;
    }

    update() {
        if (this.health <= 0) {
            this.gameobject.destroy();
        }
    }

    onHealthChange() {

    }

    takeDamage(amount) {
        this.health -= amount;

        this.onHealthChange(this.health, this.getPercent());

        if (this.health <= 0) {
            this.gameobject.destroy();
        }
    }

    getPercent() {
        return this.health / this.maxHealth;
    }
}