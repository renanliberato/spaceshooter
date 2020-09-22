import { Component } from './component'

export class ShipPositionSynchronizer extends Component
{
    constructor(gameobject) {
        super(gameobject);

        this.disposables = [
            this.gameobject.emitter.on("ShipPositionUpdated", ev => {
                this.gameobject.game.connection.invoke("SendEventToOtherPlayers", this.gameobject.game.matchId, ev);
            }),
        ];
    }

    update() {
        if (this.health <= 0) {
            this.gameobject.destroy();
        }
    }

    onDestroy() {
        this.disposables.forEach(d => d());
    }
}