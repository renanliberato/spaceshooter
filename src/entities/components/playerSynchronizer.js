import { Component } from './component'

export class PlayerSynchronizer extends Component
{
    constructor(gameobject) {
        super(gameobject);

        this.disposables = [
            this.gameobject.emitter.on("DestroyPlayer", id => {
                console.log(id);
                this.gameobject.game.connection.invoke("DestroyPlayer", this.gameobject.game.matchId, id);
            }),
            this.gameobject.emitter.on("FireShot", ev => {
                this.gameobject.game.connection.invoke("FireShot", ev.matchId, ev.id, ev.x, ev.y, ev.angle);
            }),
            this.gameobject.emitter.on("ShipPositionUpdated", ev => {
                this.gameobject.game.connection.invoke("SendEventToOtherPlayers", this.gameobject.game.matchId, ev);
            }),
        ];
    }

    update() {
    }

    onDestroy() {
        this.disposables.forEach(d => d());
    }
}