import { GameObject } from '../gameobject';
import { loadImage } from 'canvas';
import { TransformBehaviour } from './transformBehaviour';

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
        this.gameobject.getComponent(TransformBehaviour, gameobjectTransform => {
            const centerCoords = gameobjectTransform.getCenterCanvasCoords();
            if (this.image)
                this.drawImage(this.image, centerCoords.x, centerCoords.y, this.scale, gameobjectTransform.angle)
        });
    }
}