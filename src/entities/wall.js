import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";

export class Wall extends GameObject {
    constructor(game, x, y, width) {
        super(game);
        this.tag = 'wall';
        this.color = '#fff';

        this.addComponent(new TransformBehaviour(game));

        this.getComponent(TransformBehaviour, transform => {
            transform.x = x;
            transform.y = y;
            transform.width = width;
            transform.height = width;
        });
    }

    render() {
        super.render();
        this.getComponent(TransformBehaviour, transform => {
            const centerCoords = transform.getCenterCanvasCoords();
            this.game.context.strokeStyle = this.color;
            this.game.context.fillStyle = 'transparent';
            this.game.context.lineWidth = 3;
            this.game.context.strokeRect(centerCoords.x - transform.width / 2, centerCoords.y - transform.height / 2, transform.width, transform.width);
        });
    }
}