import { Ship } from './ship';
import { isMobile } from '../game';

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

        if (!isMobile) {
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
        } else {
            // this.isFiring = true;
            // this.acceleratingFrontwards = true;
            // const leftSide = window.innerWidth / 3;
            // const rightSide = window.innerWidth * 2 / 3;
            
            // document.addEventListener('touchstart', (e) => {
            //     var clientX = e.touches[0].clientX;

            //     this.rotatingLeft = false;
            //     this.rotatingRight = false;

            //     if (clientX < leftSide) {
            //         this.rotatingLeft = true;
            //     } else if (clientX > rightSide) {
            //         this.rotatingRight = true;
            //     }
            // });
    
            // document.addEventListener('touchend', (e) => {
            //     this.rotatingLeft = false;
            //     this.rotatingRight = false;
            // });
        }
    }

    onDestroy() {
        super.onDestroy();
        document.dispatchEvent(new CustomEvent('player_destroyed'));
    }
}