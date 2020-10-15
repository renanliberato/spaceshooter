import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";

export class Trail extends GameObject
{
    constructor(game, owner) {
        super(game);
        this.owner = owner;
        
        this.addComponent(new TransformBehaviour(game));

        this.getComponent(TransformBehaviour, transform => {
            this.owner.getComponent(TransformBehaviour, ownerTransform => {
                transform.x = ownerTransform.x;
                transform.y = ownerTransform.y;
                transform.dy = ownerTransform.dy;
                transform.dx = ownerTransform.dx;
                transform.rotateToAngle(ownerTransform.angle);
            });
        });

        this.distantiationSpeed = 0;
    }

    update() {
        super.update();
        this.getComponent(TransformBehaviour, transform => {
            this.owner.getComponent(TransformBehaviour, ownerTransform => {
                transform.dy = ownerTransform.dy;
                transform.dx = ownerTransform.dx;
            });
        });

        if (this.game.time > this.destroyAt) {
            this.destroy();
        }
    }

    render() {
        super.render();
        this.getComponent(TransformBehaviour, transform => {
            const centerCoords = transform.getCenterCanvasCoords();
            this.drawPolygon(
                centerCoords.x,
                centerCoords.y,
                4,
                2,
                1,
                this.owner.color,
                this.owner.color,
                transform.angle
            );
        });
    }
}