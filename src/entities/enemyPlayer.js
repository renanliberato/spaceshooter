import { Ship } from './ship';
import { FireBehaviour } from './components/fireBehaviour';
import { loadImage } from 'canvas';
import IMAGES from '../images/images';

export class EnemyPlayer extends Ship {
    constructor(game) {
        super(game, 'red');

        this.tag = 'enemy';
        this.addComponent(new FireBehaviour(this, 0.5, this.game.sizeFromHeight(6), this.id+'bullet', 'player'));

        loadImage(IMAGES.ship_orange).then(image => {
            this.shipImage = image;
        });
    }
}