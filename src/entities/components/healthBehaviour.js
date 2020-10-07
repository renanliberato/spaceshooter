import { GameObject } from '../gameobject';

export class HealthBehaviour extends GameObject
{
    constructor(gameobject, game, maxHealth) {
        super(game);
        this.gameobject = gameobject;
        this.lastHealth = maxHealth;
        this.health = maxHealth;
        this.maxHealth = maxHealth;

        this.disposables.push(this.gameobject.emitter.on("TookDamage", this.onTookDamage.bind(this)));
    }

    update() {
        super.update();
        if (this.health <= 0) {
            this.gameobject.destroy();
        }
    }

    onTookDamage({id, amount, health}) {
        this.health = health;
        this.onHealthChange(this.health, this.getPercent());
    }

    onHealthChange() {

    }

    takeDamage(amount) {
        this.gameobject.emitter.emit("TookDamage", {
            id: this.gameobject.id,
            amount,
            health: this.health - amount
        });
    }

    getPercent() {
        return this.health / this.maxHealth;
    }
}