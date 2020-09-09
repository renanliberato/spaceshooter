import { GameObject } from './gameobject';

export class Bullet extends GameObject {
    constructor(game, object, moveFunc, tag) {
        super(game);

        this.tag = tag;
        this.moveFunc = moveFunc;
        
        this.setObject(object);
    }

    move() {
        (this.moveFunc)(this.object);
        this.object.setCoords();

        if (this.object.top < 0 || this.object.top > this.game.canvas.getHeight() || this.object.left < 0 || this.object.left > this.game.canvas.getWidth())
            this.destroy();
    }

    onDestroy() {
        
    }
}