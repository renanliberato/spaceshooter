import { Ship } from './ship';
import { FireBehaviour } from './components/fireBehaviour';

const keycode = require('keycode');

export class Player extends Ship {
    constructor(game) {
        super(game, '#fff');

        this.tag = 'player';
        this.x = game.map.width / 2;
        this.y = game.map.height / 2;
        this.addComponent(new FireBehaviour(this, 0.5, this.game.sizeFromHeight(2), this.id+'bullet', 'enemy'));

        document.addEventListener('keydown', (e) => {
            switch (keycode(e)) {
                case 'w':
                    this.acceleratingFrontwards = true;
                    break;
                case 's':
                    this.acceleratingBackwards = true;
                    break;
                case 'a':
                    this.rotatingLeft = true;
                    break;
                case 'd':
                    this.rotatingRight = true;
                    break;
                case 'q':
                    this.dashLeft();
                    break;
                case 'e':
                    this.dashRight();
                    break;
                case 'space':
                    this.getComponent(FireBehaviour).isFiring = true;
                    break;

            }
        });

        document.addEventListener('keyup', (e) => {
            switch (keycode(e)) {
                case 'w':
                    this.acceleratingFrontwards = false;
                    break;
                case 's':
                    this.acceleratingBackwards = false;
                    break;
                case 'a':
                    this.rotatingLeft = false;
                case 'd':
                    this.rotatingRight = false;
                    break;
                case 'space':
                    this.getComponent(FireBehaviour).isFiring = false;
                    break;
            }
        });
    }

    onFire() {
        this.emitter.emit("FireShot", {
            matchId: this.game.matchId,
            id: this.id,
            x: this.x,
            y: this.y,
            angle:this.object.angle
        });
    }

    onDestroy() {
        super.onDestroy();
        this.game.connection.invoke("DestroyPlayer", this.game.matchId, this.id);
        document.dispatchEvent(new CustomEvent('player_destroyed'));
    }
}