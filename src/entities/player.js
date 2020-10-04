import { Ship } from './ship';
import { FireBehaviour } from './components/fireBehaviour';
import { HealthBehaviour } from './components/healthBehaviour';
import { isMobile } from '../config';

const keycode = require('keycode');

export class Player extends Ship {
    constructor(game) {
        super(game, '#fff');

        this.tag = 'player';
        this.x = 100;
        this.y = 100;

        this.addComponent(new FireBehaviour(this, 0.5, this.game.sizeFromHeight(6), this.id+'bullet', 'enemy'));

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
        } else {
            this.getComponent(FireBehaviour).isFiring = true;
            this.acceleratingFrontwards = true;
            const leftSide = window.innerWidth / 3;
            const rightSide = window.innerWidth * 2 / 3;

            document.addEventListener('touchstart', (e) => {
                var clientX = e.touches[0].clientX;

                this.rotatingLeft = false;
                this.rotatingRight = false;

                if (clientX < leftSide) {
                    this.rotatingLeft = true;
                } else if (clientX > rightSide) {
                    this.rotatingRight = true;
                }
            });

            document.addEventListener('touchend', (e) => {
                this.rotatingLeft = false;
                this.rotatingRight = false;
            });
        }

        this.getComponent(HealthBehaviour).onHealthChange = (health, healthPercent) => {
            document.dispatchEvent(new CustomEvent('player_health_updated', {
                detail: {
                    health: healthPercent * 100
                }
            }))
        }
    }

    onFire() {
        this.emitter.emit("FireShot", {
            matchId: this.game.matchId,
            id: this.id,
            x: this.x,
            y: this.y,
            angle:this.angle
        });
    }

    update() {
        super.update();
    }

    onDestroy() {
        this.emitter.emit("DestroyPlayer", this.id);
        
        super.onDestroy();
        document.dispatchEvent(new CustomEvent('player_destroyed'));
    }
}