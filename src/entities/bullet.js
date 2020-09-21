import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';
import { HealthBehaviour } from './components/HealthBehaviour';

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

        this.setObject(new fabric.Rect({
            selectable: false,
            fill: this.owner.object.fill,
            width: this.owner.game.sizeFromWidth(1),
            height: this.owner.game.sizeFromHeight(3),
            top: this.owner.object.top,
            left: this.owner.object.left,
            originX: 'center',
            originY: 'center',
        }));

        this.rotateToAngle(this.owner.angle);

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
            if (this.object.intersectsWithObject(ship.object)) {
                if (this.isVisible)
                    AudioManager.play(AudioManager.audios.hit);
                
                ship.getHealth().takeDamage(1);
                hitAnyone = true;
            }
        });

        if (hitAnyone) {
            this.destroy('bullet hit anyone');
        }
    }
}