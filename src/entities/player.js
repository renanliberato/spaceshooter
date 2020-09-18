import { Ship } from './ship';

const keycode = require('keycode');

export class Player extends Ship {
    constructor(game) {
        super(game, '#fff');

        this.tag = 'player';
        this.maxHealth = 10;
        this.health = 10;
        this.x = game.map.width / 2;
        this.y = game.map.height / 2;
        this.bulletTargetTag = 'enemy';
        this.firingSpeed = 0.5;

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
                    this.isFiring = true;
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
                    this.isFiring = false;
                    break;
            }
        });
    }

    onDestroy() {
        super.onDestroy();
        document.dispatchEvent(new CustomEvent('player_destroyed'));
    }
}