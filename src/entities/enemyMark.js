import { GameObject } from "./gameobject";

export class EnemyMark extends GameObject {
    constructor(game, owner, enemy) {
        super(game);
        this.tag = 'enemymark';
        this.width = 3;
        this.height = 3;
        this.color = 'red';
        this.owner = owner;
        this.enemy = enemy;
    }

    update() {
        super.update();
        if (this.enemy.destroyed)
        {
            this.destroy();
            return;
        }

        this.moveTo(this.owner.x, this.owner.y);

        var angle = this.owner.getAngleTowardsObject(this.enemy);
        this.angle = angle;
        this.moveAccordingToAngle('front', angle, this.owner.width + 25);
    }

    render() {
        const centerCoords = this.getCenterCanvasCoords();

        this.drawPolygon(
            centerCoords.x,
            centerCoords.y,
            3,
            this.width,
            1,
            this.color,
            this.color,
            this.angle
        );
    }
}