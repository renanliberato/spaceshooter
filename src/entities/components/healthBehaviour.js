import { Component } from './component'

export class HealthBehaviour extends Component
{
    constructor(gameobject, maxHealth) {
        super(gameobject);
        this.health = maxHealth;
        this.maxHealth = maxHealth;
    }

    start() {

    }

    update() {
        if (this.health <= 0) {
            this.gameobject.destroy();
        }
    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.gameobject.destroy();
        }
    }
}