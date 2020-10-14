import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { collides } from '../helpers';
import { ImageRendererBehaviour } from './components/imageRendererBehaviour';
import IMAGES from '../images/images';

export class Bullet extends GameObject {
    constructor(game, tag, owner, targetTag, speed) {
        super(game);

        this.owner = owner;
        this.angle = this.owner.angle;
        this.tag = tag;
        this.targetTag = targetTag;

        this.x = this.owner.x;
        this.y = this.owner.y;
        this.dy = speed;
        this.width = 5;
        this.height = 10;

        this.rotateToAngle(this.owner.angle);

        this.addComponent(new ImageRendererBehaviour(this, this.game, IMAGES.laser_blue, 0.5))

        setTimeout(() => {
            if (!this.destroyed) {
                this.destroy();
            }
        }, 5000);
    }

    update() {
        super.update();
        this.moveAccordingToAngle('front', this.angle, this.dy)
        if (this.y <= 0 || this.y >= this.game.map.height || this.x <= 0 || this.x >= this.game.map.width)
            this.destroy('bullet out of bounds');

        var hitAnyone = false;
        this.game.entities.filter(e => e.isShip && e.id != this.owner.id && (!this.targetTag || e.tag == this.targetTag)).forEach(ship => {
            if (collides(this, ship)) {
                if (this.isVisible)
                    AudioManager.play(AudioManager.audios.hit);
                
                ship.getHealth().takeDamage(0.4);
                hitAnyone = true;
            }
        });

        if (hitAnyone) {
            this.destroy('bullet hit anyone');
        }
    }
}