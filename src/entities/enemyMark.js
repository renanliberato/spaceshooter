import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";

export class EnemyMark extends GameObject {
    constructor(game, owner, enemy) {
        super(game);
        this.tag = 'enemymark';
        this.color = 'red';
        this.owner = owner;
        this.enemy = enemy;

        this.transform.width = 3;
        this.transform.height = 3;
    }

    update() {
        super.update();
        if (this.enemy.destroyed)
        {
            this.destroy();
            return;
        }

        this.transform.moveTo(this.owner.transform.x, this.owner.transform.y);
        var angle = this.owner.transform.getAngleTowardsObject(this.enemy.transform);
        this.transform.angle = angle;

        this.transform.moveAccordingToAngle('front', angle, this.owner.transform.width + 25);
    }

    render() {
        super.render();
        const centerCoords = this.transform.getCenterCanvasCoords();

        this.drawPolygon(
            centerCoords.x,
            centerCoords.y,
            3,
            this.transform.width,
            1,
            this.color,
            this.color,
            this.transform.angle
        );
    }
}