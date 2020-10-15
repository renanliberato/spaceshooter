import { GameObject } from "../gameobject";
import { ImageRendererBehaviour } from "./imageRendererBehaviour";
import { TransformBehaviour } from "./transformBehaviour";

export class ShipDamageAnimation extends GameObject {
    constructor(game, owner, image) {
        super(game);
        this.destroyAfter(1);

        this.addComponent(new TransformBehaviour(this.game));
        this.getComponent(TransformBehaviour, transform => {
            owner.getComponent(TransformBehaviour, ownerTransform => {
                transform.x = ownerTransform.x;
                transform.y = ownerTransform.y;
                transform.dy = Math.random() * 4;
                transform.angle = Math.random() * 360;
            });
        });

        this.addComponent(new ImageRendererBehaviour(this, this.game, image, 0.5));
    }

    update() {
        super.update();

        this.getComponent(TransformBehaviour, transform => {
            if (transform.dy > 0)
                transform.dy -= 0.1
            transform.moveAccordingToAngle('front', transform.angle, transform.dy);
        });
    }
}