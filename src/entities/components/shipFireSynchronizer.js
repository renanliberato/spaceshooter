import { Component } from './component'

export class ShipFireSynchronizer extends Component
{
    constructor(gameobject) {
        super(gameobject);

        this.disposables = [
            this.gameobject.emitter.on("FireShot", ev => {
                this.gameobject.game.connection.invoke("FireShot", ev.matchId, ev.id, ev.x, ev.y, ev.angle);
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