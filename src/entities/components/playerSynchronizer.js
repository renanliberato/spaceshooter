import { GameObject } from '../gameobject';

export class PlayerSynchronizer extends GameObject
{
    constructor(gameobject, game) {
        super(game);
        this.gameobject = gameobject;

        this.disposables.push(this.gameobject.emitter.on("DestroyPlayer", id => {
            this.gameobject.game.connection.invoke("DestroyPlayer", this.gameobject.game.matchId, id);
        }));
        this.disposables.push(this.gameobject.emitter.on("FireShot", ev => {
            this.gameobject.game.connection.invoke("FireShot", ev.matchId, ev.id, ev.x, ev.y, ev.angle);
        }));
        this.disposables.push(this.gameobject.emitter.on("ShipPositionUpdated", ev => {
            this.gameobject.game.connection.sendEventsToOtherPlayers("ShipPositionUpdated", ev);
        }));
        this.disposables.push(this.gameobject.emitter.on("TookDamage", ({id, amount, health}) => {
            this.gameobject.game.connection.sendEventsToOtherPlayers("TookDamage", {
                id,
                amount,
                health
            });
        }));
    }
}