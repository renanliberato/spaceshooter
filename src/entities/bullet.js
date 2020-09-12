import { GameObject } from './gameobject';
import { AudioManager } from '../audios/AudioManager';

export class Bullet extends GameObject {
    constructor(game, object, moveFunc, tag, owner, targetTag) {
        super(game);

        this.owner = owner;
        this.tag = tag;
        this.moveFunc = moveFunc;
        this.targetTag = targetTag;

        this.setObject(object);

        setTimeout(() => {
            if (!this.destroyed) {
                this.destroy();
            }
        }, 5000);
    }

    update() {
        super.update();

        (this.moveFunc)(this);
        if (this.y <= 0 || this.y >= this.game.map.height || this.x <= 0 || this.x >= this.game.map.width)
            this.destroy('bullet out of bounds');

        var hitAnyone = false;
        this.game.entities.filter(e => e.isShip && e.id != this.owner.id && (!this.targetTag || e.tag == this.targetTag)).forEach(ship => {
            if (this.object.intersectsWithObject(ship.object)) {
                if (this.isVisible)
                    AudioManager.play(AudioManager.audios.hit);
                    
                ship.takeDamage(1);
                hitAnyone = true;
            }
        });

        if (hitAnyone) {
            this.destroy('bullet hit anyone');
        }
    }
}