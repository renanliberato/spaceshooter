import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { collides } from '../helpers';
import { ImageRendererBehaviour } from './components/imageRendererBehaviour';
import IMAGES from '../images/images';


export class Bullet extends GameObject {
    constructor(game, tag, owner, targetTag, speed) {
        super(game);

        this.owner = owner;
        this.tag = tag;
        this.isBullet = true;
        this.targetTag = targetTag;

        this.addComponent(new ImageRendererBehaviour(this, this.game, IMAGES.laser_blue, 0.5))

        this.transform.angle = this.owner.transform.angle;
        this.transform.x = this.owner.transform.x;
        this.transform.y = this.owner.transform.y;
        this.transform.dy = speed;
        this.transform.width = 5;
        this.transform.height = 10;

        this.transform.rotateToAngle(this.owner.transform.angle);
        this.destroyAfter(5);
    }

    update() {
        super.update();
        this.transform.moveAccordingToAngle('front', this.transform.angle, this.transform.dy)
        if (this.transform.y <= 0 || this.transform.y >= this.game.map.height || this.transform.x <= 0 || this.transform.x >= this.game.map.width)
            this.destroy('bullet out of bounds');

        var hitAnyone = false;
        this.game.entities.filter(e => e.isShip && e.id != this.owner.id && (!this.targetTag || e.tag == this.targetTag)).forEach(ship => {
            if (collides(this.transform, ship.transform)) {
                if (this.transform.isVisible)
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