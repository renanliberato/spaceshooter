import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { collides } from '../helpers';
import { ImageRendererBehaviour } from './components/imageRendererBehaviour';
import IMAGES from '../images/images';
import { TransformBehaviour } from './components/transformBehaviour';

export class Bullet extends GameObject {
    constructor(game, tag, owner, targetTag, speed) {
        super(game);

        this.owner = owner;
        this.tag = tag;
        this.targetTag = targetTag;

        this.addComponent(new TransformBehaviour(this.game));
        this.addComponent(new ImageRendererBehaviour(this, this.game, IMAGES.laser_blue, 0.5))

        this.getComponent(TransformBehaviour, transform => {
            this.owner.getComponent(TransformBehaviour, ownerTransform => {
                transform.angle = ownerTransform.angle;
                transform.x = ownerTransform.x;
                transform.y = ownerTransform.y;
                transform.dy = speed;
                transform.width = 5;
                transform.height = 10;

                transform.rotateToAngle(ownerTransform.angle);
            });
        });
        this.destroyAfter(5);
    }

    update() {
        super.update();
        this.getComponent(TransformBehaviour, transform => {
            transform.moveAccordingToAngle('front', transform.angle, transform.dy)
            if (transform.y <= 0 || transform.y >= this.game.map.height || transform.x <= 0 || transform.x >= this.game.map.width)
                this.destroy('bullet out of bounds');

            var hitAnyone = false;
            this.game.entities.filter(e => e.isShip && e.id != this.owner.id && (!this.targetTag || e.tag == this.targetTag)).forEach(ship => {
                if (collides(transform, ship.getComponent(TransformBehaviour))) {
                    if (transform.isVisible)
                        AudioManager.play(AudioManager.audios.hit);
                    
                    ship.getHealth().takeDamage(0.4);
                    hitAnyone = true;
                }
            });

            if (hitAnyone) {
                this.destroy('bullet hit anyone');
            }
        });
    }
}