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
        this.rotateToAngle(this.owner.angle);
    }

    update() {
        super.update();
        this.dy = this.owner.dy;
        this.dx = this.owner.dx;

        if (this.game.time > this.destroyAt) {
            this.destroy();
        }
    }

    render() {
        super.render();
        const centerCoords = this.getCenterCanvasCoords();
        this.drawPolygon(
            centerCoords.x,
            centerCoords.y,
            4,
            2,
            1,
            this.owner.color,
            this.owner.color,
            this.angle
        );
    }
}