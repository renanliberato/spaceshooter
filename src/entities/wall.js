import { GameObject } from "./gameobject";

export class Wall extends GameObject {
    constructor(game, x, y) {
        super(game);
        this.tag = 'wall';
        this.x = x;
        this.y = y;
        this.setObject(new fabric.Rect({
            selectable: false,
            top: x,
            left: x,
            width: 25,
            height: 25,
            fill: '#fff'
        }));
    }
}