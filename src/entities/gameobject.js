const uuid = require("uuid");

export class GameObject {
    constructor(game) {
        this.id = uuid.v4();
        this.createdAt = game.time;
        this.tag = 'gameobject';
        this.game = game;
        this.angle = 0;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.width = 0;
        this.height = 0;
        this.destroyed = false;
        this.isVisible = false;
        this.destroyAt = undefined;
        this.components = [];
        this.object = {rotate: () => {}};
    }

    addComponent(c) {
        this.components.push(c);
    }

    getComponent(theClass) {
        return this.components.find(c => c.constructor.name == theClass.name);
    }

    start() {
        this.components.forEach(c => c.start());
    }

    setObject(obj) {
        this.object = obj;
    }

    move(x, y) {
        this.moveTo(this.x + x, this.y + y)
    }

    moveTo(x, y) {
        this.x = Math.min(this.game.map.width, Math.max(0, x));
        this.y = Math.min(this.game.map.height, Math.max(0, y));
    }

    rotateAngle(dAngle) {
        this.angle = this.angle + dAngle;
        this.object.rotate(this.angle);
    }

    rotateToAngle(angle) {
        this.angle = angle;
        this.object.rotate(this.angle);
    }

    getAngleTowardsObject(obj) {
        return (Math.atan2(obj.y - this.y, obj.x - this.x) * 180 / Math.PI) + 90;
    }

    moveAccordingToAngle(direction, angle, speed) {
        switch (direction) {
            case 'front':
                this.move(
                    speed * Math.sin(angle * Math.PI / 180),
                    speed * Math.cos(angle * Math.PI / 180) * -1
                );
                break;
            case 'back':
                this.move(
                    speed * Math.cos(angle * Math.PI / 180),
                    speed * Math.sin(angle * Math.PI / 180)
                );
                break;
            case 'left':
                this.move(
                    speed * Math.cos(angle * Math.PI / 180),
                    speed * Math.sin(angle * Math.PI / 180)
                );
                break;
            case 'right':
                this.move(
                    speed * Math.cos(angle * Math.PI / 180) * -1,
                    speed * Math.sin(angle * Math.PI / 180) * -1
                );
                break;
        }
    }

    getCoordsTowardsDirection(x, y, direction, angle, speed) {
        switch (direction) {
            case 'front':
                return {
                    x: x + speed * Math.sin(angle * Math.PI / 180),
                    y: y + speed * Math.cos(angle * Math.PI / 180) * -1
                };
                break;
            case 'back':
                return {
                    x: x + speed * Math.cos(angle * Math.PI / 180),
                    y: y + speed * Math.sin(angle * Math.PI / 180)
                };
                break;
            case 'left':
                return {
                    x: x + speed * Math.cos(angle * Math.PI / 180),
                    y: y + speed * Math.sin(angle * Math.PI / 180)
                };
                break;
            case 'right':
                return {
                    x: x + speed * Math.cos(angle * Math.PI / 180) * -1,
                    y: y + speed * Math.sin(angle * Math.PI / 180) * -1
                };
                break;
        }
    }

    destroyAfter(time) {
        this.destroyAt = this.game.time + time;
    }

    update() {
        if (this.destroyAt && this.game.time > this.destroyAt) {
            this.destroy();
            return;
        }

        this.components.forEach(c => c.update());
        this.object.rotate(this.angle);
        this.isVisible = this.x >= this.game.visibleArea.x && this.x <= this.game.visibleArea.x2 && this.y >= this.game.visibleArea.y && this.y <= this.game.visibleArea.y2;

        this.object.left = this.x - this.game.visibleArea.x;
        this.object.top = this.y - this.game.visibleArea.y;
    }

    render() {
    }

    destroy(reason) {
        this.game.destroyEntity(this);
        
        if (this.onDestroy)
            this.onDestroy();
    }
    
    onDestroy() {
        this.components.forEach(c => c.onDestroy && c.onDestroy())
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

    getCenterCanvasCoords() {
        return {
            x: this.x - this.game.visibleArea.x,
            y: this.y - this.game.visibleArea.y,
        };
    }
}