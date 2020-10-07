import { GameObject } from "./gameobject";

export class Wall extends GameObject {
    constructor(game, x, y, width) {
        super(game);
        this.tag = 'wall';
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = width;
        this.color = '#fff';
    }

    render() {
        super.render();
        const centerCoords = this.getCenterCanvasCoords();
        this.game.context.strokeStyle = this.color;
        this.game.context.fillStyle = 'transparent';
        this.game.context.lineWidth = 3;
        this.game.context.strokeRect(centerCoords.x - this.width / 2, centerCoords.y - this.height / 2, this.width, this.width);
    }
}