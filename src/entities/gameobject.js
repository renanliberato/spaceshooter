const uuid = require("uuid");

export class GameObject {
    constructor(game) {
        this.id = uuid.v4();
        this.createdAt = game.time;
        this.tag = 'gameobject';
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.destroyed = false;
        this.isVisible = false;
        this.destroyAt = undefined;
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
        this.object.rotate(this.object.angle + dAngle);
    }

    rotateToAngle(angle) {
        this.object.rotate(angle);
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

    destroyAfter(time) {
        this.destroyAt = this.game.time + time;
    }

    update() {
        if (this.destroyAt && this.game.time > this.destroyAt) {
            this.destroy();
            return;
        }
        if (this.x >= this.game.visibleArea.x && this.x <= this.game.visibleArea.x2 && this.y >= this.game.visibleArea.y && this.y <= this.game.visibleArea.y2) {
            this.isVisible = true;
            if (!this.game.canvas.contains(this.object)) {
                this.game.canvas.add(this.object);
            }

            this.object.left = this.x - this.game.visibleArea.x - Math.sin(this.object.angle * Math.PI / 180) * this.dy * 5;
            this.object.top = this.y - this.game.visibleArea.y + Math.cos(this.object.angle * Math.PI / 180) * this.dy * 5;
            this.object.setCoords();
        } else {
            this.isVisible = false;
            if (this.game.canvas.contains(this.object))
                this.game.canvas.remove(this.object);
        }
    }

    destroy(reason) {
        this.game.destroyEntity(this);
        
        if (this.onDestroy)
            this.onDestroy();
    }
    
    onDestroy() {

    }
}