import { GameObject } from "../gameobject";
import { ImageRendererBehaviour } from "./imageRendererBehaviour";

export class ShipDamageAnimation extends GameObject {
    constructor(game, owner, image) {
        super(game);
        this.x = owner.x;
        this.y = owner.y;
        this.dy = Math.random() * 4;
        this.angle = Math.random() * 360;
        this.destroyAfter(1);

        this.addComponent(new ImageRendererBehaviour(this, this.game, image, 0.5));
    }

    update() {
        super.update();
        if (this.dy > 0)
            this.dy -= 0.1
        this.moveAccordingToAngle('front', this.angle, this.dy);
    }
}