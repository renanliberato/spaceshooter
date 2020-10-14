import { GameObject } from '../gameobject';
import { loadImage } from 'canvas';

export class ImageRendererBehaviour extends GameObject
{
    constructor(gameobject, game, image, scale) {
        super(game);
        this.gameobject = gameobject;
        this.scale = scale;

        loadImage(image).then(loadedImage => {
            this.image = loadedImage;
        });
    }

    render() {
        const centerCoords = this.gameobject.getCenterCanvasCoords();
        if (this.image)
            this.drawImage(this.image, centerCoords.x, centerCoords.y, this.scale, this.gameobject.angle)
    }
}