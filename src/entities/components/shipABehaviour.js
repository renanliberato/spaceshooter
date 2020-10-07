import { Component } from './component';
import { loadImage } from 'canvas';
import IMAGES from '../../images/images';

const colorToImage = {
    'blue': IMAGES.ship_blue,
    'green': IMAGES.ship_green,
    'orange': IMAGES.ship_orange,
}

export class ShipABehaviour extends Component {
    constructor(gameobject, color) {
        super(gameobject);

        loadImage(colorToImage[color]).then(image => {
            this.gameobject.shipImage = image;
        });
    }
}