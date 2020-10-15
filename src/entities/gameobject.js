const uuid = require("uuid");
import { createNanoEvents } from 'nanoevents';
import { TransformBehaviour } from './components/transformBehaviour';
import { ColliderBehaviour } from './components/colliderBehaviour';

export class GameObject {
    constructor(game) {
        this.id = uuid.v4();
        this.createdAt = game.time;
        this.tag = 'gameobject';
        this.game = game;
        this.destroyed = false;
        this.destroyAt = undefined;
        this.components = {};
        this.componentKeys = [];
        this.disposables = [];

        this.emitter = createNanoEvents();

        this.transform = new TransformBehaviour(this.game);
        this.collider = new ColliderBehaviour(this.game, this.transform);
        this.addComponent(this.transform);
    }

    addComponent(c) {
        this.components[c.constructor] = c;
        this.componentKeys.push(c.constructor);
    }

    getComponent(theClass, doThis) {
        const component = this.components[theClass];
        if (!doThis)
            return component;

        if (component)
            doThis(component);
    }

    start() {
        this.componentKeys.forEach(key => this.components[key].start());
    }

    setObject(obj) {
        this.object = obj;
    }

    destroyAfter(time) {
        this.destroyAt = this.game.time + time;
    }

    update() {
        if (this.destroyAt && this.game.time > this.destroyAt) {
            this.destroy();
            return;
        }

        this.componentKeys.forEach(key => this.components[key].update());
    }

    render() {
        this.componentKeys.forEach(key => this.components[key].render());
    }

    destroy(reason) {
        this.game.destroyEntity(this);
        
        this.onDestroy();
    }
    
    onDestroy() {
        this.componentKeys.forEach(key => this.components[key].onDestroy && this.components[key].onDestroy());
        setTimeout(() => this.disposables.forEach(d => d()), 200);
    }

    drawPolygon(centerX, centerY, sideCount, size, strokeWidth, strokeColor, fillColor, rotationDegrees) {
        switch (sideCount) {
            case 3:
                rotationDegrees += 90 / 3
                break;
            case 2:
                rotationDegrees += 90;
                break;
            case 4:
                rotationDegrees += 45;
                break;
        }

        var radians=rotationDegrees*Math.PI/180;
        this.game.context.translate(centerX, centerY);
        this.game.context.rotate(radians);
        this.game.context.beginPath();
        this.game.context.moveTo (size * Math.cos(0), size * Math.sin(0));          
        for (var i = 1; i <= sideCount;i += 1) {
            this.game.context.lineTo (size * Math.cos(i * 2 * Math.PI / sideCount), size * Math.sin(i * 2 * Math.PI / sideCount));
        }
        this.game.context.closePath();
        this.game.context.fillStyle=fillColor;
        this.game.context.strokeStyle = strokeColor;
        this.game.context.lineWidth = strokeWidth;
        this.game.context.stroke();
        this.game.context.fill();
        this.game.context.rotate(-radians);
        this.game.context.translate(-centerX,-centerY);
    }

    drawImage(image, x, y, scale, rotation) {
        this.game.context.save();
        this.game.context.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.game.context.rotate(rotation * Math.PI / 180);
        this.game.context.drawImage(image, -image.width / 2, -image.height / 2);
        this.game.context.restore();
    } 
}
