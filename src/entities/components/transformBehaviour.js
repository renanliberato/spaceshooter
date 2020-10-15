export class TransformBehaviour {
    constructor(game) {
        this.game = game;
        this.angle = 0;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.width = 0;
        this.height = 0;
        this.isVisible = false;

        this.move = this.move.bind(this);
        this.moveTo = this.moveTo.bind(this);
        this.rotateAngle = this.rotateAngle.bind(this);
        this.rotateToAngle = this.rotateToAngle.bind(this);
        this.getAngleTowardsObject = this.getAngleTowardsObject.bind(this);
        this.moveAccordingToAngle = this.moveAccordingToAngle.bind(this);
        this.getCoordsTowardsDirection = this.getCoordsTowardsDirection.bind(this);
        this.update = this.update.bind(this);
        this.getCenterCanvasCoords = this.getCenterCanvasCoords.bind(this);
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
    }

    rotateToAngle(angle) {
        this.angle = angle;
    }

    /**
     * 
     * @param {TransformBehaviour} transform 
     */
    getAngleTowardsObject(transform) {
        return (Math.atan2(transform.y - this.y, transform.x - this.x) * 180 / Math.PI) + 90;
    }

    moveAwayFromObject(transform, distance) {
        const angle = this.getAngleTowardsObject(transform);

        this.moveAccordingToAngle('back', angle, distance);
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

    update() {
        this.isVisible = this.x >= this.game.visibleArea.x && this.x <= this.game.visibleArea.x2 && this.y >= this.game.visibleArea.y && this.y <= this.game.visibleArea.y2;
    }

    render() {}

    getCenterCanvasCoords() {
        return {
            x: this.x - this.game.visibleArea.x,
            y: this.y - this.game.visibleArea.y,
        };
    }
}