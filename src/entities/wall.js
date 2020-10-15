import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";
import { collides } from "../helpers";

export class Wall extends GameObject {
    constructor(game, x, y, width, height) {
        super(game);
        this.tag = 'wall';
        this.color = '#fff';

        this.transform.x = x;
        this.transform.y = y;
        this.transform.width = width;
        this.transform.height = height;
    }

    update() {
        super.update();
        this.game.entities.forEach(entity => {
            if (collides(this.transform, entity.transform) && entity.isShip) {
                entity.transform.moveAwayFromObject(this.transform, 1);
                entity.transform.dx = 0;
                entity.transform.dy = 0;
            }
        });
    }

    render() {
        super.render();
        const centerCoords = this.transform.getCenterCanvasCoords();
        this.game.context.strokeStyle = this.color;
        this.game.context.fillStyle = this.color;
        this.game.context.fillRect(centerCoords.x - this.transform.width / 2, centerCoords.y - this.transform.height / 2, this.transform.width, this.transform.width);
    }
}