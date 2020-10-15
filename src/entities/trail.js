import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";

export class Trail extends GameObject
{
    constructor(game, owner) {
        super(game);
        this.owner = owner;
        
        this.transform.x = this.owner.transform.x;
        this.transform.y = this.owner.transform.y;
        this.transform.dy = this.owner.transform.dy;
        this.transform.dx = this.owner.transform.dx;
        this.transform.rotateToAngle(this.owner.transform.angle);

        this.distantiationSpeed = 0;
    }

    update() {
        super.update();
        this.transform.dy = this.owner.transform.dy;
        this.transform.dx = this.owner.transform.dx;

        if (this.game.time > this.destroyAt) {
            this.destroy();
        }
    }

    render() {
        super.render();
        const centerCoords = this.transform.getCenterCanvasCoords();
        this.drawPolygon(
            centerCoords.x,
            centerCoords.y,
            4,
            2,
            1,
            this.owner.color,
            this.owner.color,
            this.transform.angle
        );
    }
}