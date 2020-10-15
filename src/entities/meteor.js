import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";
import { collides } from "../helpers";
import { ImageRendererBehaviour } from "./components/imageRendererBehaviour";
import IMAGES from "../images/images";

export class InofensiveStaticMeteor extends GameObject {
    constructor(game, x, y, scale) {
        super(game);
        this.tag = 'wall';

        this.addComponent(new ImageRendererBehaviour(this, this.game, IMAGES.meteor_big, scale));

        this.transform.x = x;
        this.transform.y = y;
    }

    update() {
        super.update();
        this.game.entities.forEach(entity => {
            if (entity.isShip && collides(this, entity)) {
                entity.transform.moveAwayFromObject(this.transform, 2);
                entity.transform.dx = 0;
                entity.transform.dy = 0;
            }

            if (entity.isBullet && collides(this, entity)) {
                entity.destroy();
            }
        });
    }
}