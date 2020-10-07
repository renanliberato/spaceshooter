import { Ship } from './ship';
import { ShipABehaviour } from './components/shipABehaviour';
import { HealthBehaviour } from './components/healthBehaviour';
import { isMobile } from '../config';

const keycode = require('keycode');

export class Player extends Ship {
    constructor(game) {
        super(game, '#fff');

        this.onKeydown = this.onKeydown.bind(this);
        this.onKeyup = this.onKeyup.bind(this);
        this.onTouchstart = this.onTouchstart.bind(this);

        this.tag = 'player';
        this.x = 100;
        this.y = 100;

        this.addComponent(new ShipABehaviour(this, this.game, 'blue', 'enemy'));

        if (!isMobile) {

            document.addEventListener('keydown', this.onKeydown);

            document.addEventListener('keyup', this.onKeyup);
        } else {
            this.shipBehaviour.fireBehaviour.isFiring = true;
            this.acceleratingFrontwards = true;
            const leftSide = window.innerWidth / 3;
            const rightSide = window.innerWidth * 2 / 3;

            document.addEventListener('touchstart', this.onTouchstart);

            document.addEventListener('touchend', this.onTouchend);
        }

        this.getComponent(HealthBehaviour).onHealthChange = (health, healthPercent) => {
            document.dispatchEvent(new CustomEvent('player_health_updated', {
                detail: {
                    health: healthPercent * 100
                }
            }))
        }
    }

    onKeydown(e) {
        switch (keycode(e)) {
            case 'esc':
                game.paused = !game.paused;
                break;
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
                this.shipBehaviour.fireBehaviour.isFiring = true;
                break;

        }
    }

    onKeyup(e) {
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
                this.shipBehaviour.fireBehaviour.isFiring = false;
                break;
        }
    }

    onTouchstart(e) {
        var clientX = e.touches[0].clientX;

        this.rotatingLeft = false;
        this.rotatingRight = false;

        if (clientX < leftSide) {
            this.rotatingLeft = true;
        } else if (clientX > rightSide) {
            this.rotatingRight = true;
        }
    }

    onTouchend(e) {
        this.rotatingLeft = false;
        this.rotatingRight = false;
    }

    update() {
        super.update();
    }

    onDestroy() {
        super.onDestroy();
        this.emitter.emit("DestroyPlayer", this.id);
        
        super.onDestroy();
        document.dispatchEvent(new CustomEvent('player_destroyed'));

        document.removeEventListener('keydown', this.onKeydown);
        document.removeEventListener('keyup', this.onKeyup);
        document.removeEventListener('touchstart', this.onTouchstart);
        document.removeEventListener('touchend', this.onTouchend);
    }
}