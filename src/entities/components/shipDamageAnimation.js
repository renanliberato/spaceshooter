import { GameObject } from "../gameobject";
import { ImageRendererBehaviour } from "./imageRendererBehaviour";
import { TransformBehaviour } from "./transformBehaviour";

export class ShipDamageAnimation extends GameObject {
    constructor(game, owner, image) {
        super(game);
        this.destroyAfter(1);

        this.transform.x = owner.transform.x;
        this.transform.y = owner.transform.y;
        this.transform.dy = Math.random() * 4;
        this.transform.angle = Math.random() * 360;

        this.addComponent(new ImageRendererBehaviour(this, this.game, image, 0.5));
    }

    update() {
        super.update();

        if (this.transform.dy > 0)
            this.transform.dy -= 0.1
        this.transform.moveAccordingToAngle('front', this.transform.angle, this.transform.dy);
    }
}