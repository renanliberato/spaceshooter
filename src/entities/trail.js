import { GameObject } from "./gameobject";

export class Trail extends GameObject
{
    constructor(game, owner) {
        super(game);
        this.owner = owner;
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.dy = this.owner.dy;
        this.dx = this.owner.dx;
        this.distantiationSpeed = 0;
        this.setObject(new fabric.Rect({
            selectable: false,
            left: 0,
            top: 0,
            fill: this.owner.object.fill,
            width: this.game.sizeFromWidth(0.5),
            height: this.game.sizeFromWidth(1 * this.owner.dy / 2),
            originX: 'center',
            originY: 'center',
        }));
        this.rotateToAngle(this.owner.object.angle);

        this.moveAccordingToAngle('front', this.owner.object.angle, this.owner.object.height * -1);
    }

    update() {
        super.update();
        this.dy = this.owner.dy;
        this.dx = this.owner.dx;

        if (this.game.time > this.destroyAt) {
            this.destroy();
        }
    }
}