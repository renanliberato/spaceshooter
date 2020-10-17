import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";
import { ImageRendererBehaviour } from "./components/imageRendererBehaviour";
import IMAGES from "../images/images";

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
        this.addComponent(new ImageRendererBehaviour(this, this.game, IMAGES.fire, 0.5));
    }

    update() {
        super.update();
        this.transform.dy = this.owner.transform.dy;
        this.transform.dx = this.owner.transform.dx;

        if (this.game.time > this.destroyAt) {
            this.destroy();
        }
    }
}