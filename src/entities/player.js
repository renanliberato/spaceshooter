import { Ship } from './ship';
import { isMobile } from '../game';

const keycode = require('keycode');

export class Player extends Ship {
    constructor(game) {
        super(game);

        this.tag = 'player';
        this.bulletTag = 'playerbullet';

        this.object.width = game.sizeFromWidth(5);
        this.object.height = game.sizeFromWidth(5);
        this.object.fill = 'black';
        this.object.left = game.canvas.getWidth() / 2 - this.object.width / 2;
        this.object.top = game.ui.playerHealthBar.top - this.object.height - game.sizeFromHeight(6);
        this.object.setCoords();

        if (!isMobile) {
            document.addEventListener('keydown', (e) => {
                switch (keycode(e)) {
                    case 'a':
                        this.curCommand = 'left';
                        break;
                    case 'd':
                        this.curCommand = 'right';
                        break;
                    case 'space':
                        this.isFiring = true;
                        break;
    
                }
            });
    
            document.addEventListener('keyup', (e) => {
                switch (keycode(e)) {
                    case 'a':
                        this.curCommand = 'none';
                    case 'd':
                        this.curCommand = 'none';
                        break;
                    case 'space':
                        this.isFiring = false;
                        break;
                }
            });
        } else {
            this.isFiring = true;
            const halfScreenX = window.innerWidth / 2;
            document.addEventListener('touchstart', (e) => {
                var clientX = e.touches[0].clientX;

                if (clientX < halfScreenX) {
                    this.curCommand = 'left';
                } else {
                    this.curCommand = 'right';
                }
            });
    
            document.addEventListener('touchend', (e) => {
                if (e.touches.length == 0) {
                    this.curCommand = 'none';
                }
            });
        }

    }

    moveBullet(obj) {
        obj.top -= this.bulletSpeed;
    }

    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.destroy();
        }
    }

    checkBulletHit(b) {
        const enemies = this.game.entities.filter(e => e.tag == 'enemy');
        var hitAnyone = false;
        enemies.forEach(enemy => {
            if (b.object.intersectsWithObject(enemy.object)) {
                enemy.takeDamage(1);
                hitAnyone = true;
            }
        });

        return hitAnyone;
    }

    onDestroy() {
        super.onDestroy();
        document.dispatchEvent(new Event('player_destroyed'));
    }
}