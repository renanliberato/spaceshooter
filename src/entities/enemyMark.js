import { GameObject } from "./gameobject";
import { TransformBehaviour } from "./components/transformBehaviour";

export class EnemyMark extends GameObject {
    constructor(game, owner, enemy) {
        super(game);
        this.tag = 'enemymark';
        this.color = 'red';
        this.owner = owner;
        this.enemy = enemy;

        this.addComponent(new TransformBehaviour(this.game));
        this.getComponent(TransformBehaviour, transform => {
            transform.width = 3;
            transform.height = 3;
        });
    }

    update() {
        super.update();
        if (this.enemy.destroyed)
        {
            this.destroy();
            return;
        }

        this.getComponent(TransformBehaviour, transform => {
            this.owner.getComponent(TransformBehaviour, ownerTransform => {

                transform.moveTo(ownerTransform.x, ownerTransform.y);
                var angle = ownerTransform.getAngleTowardsObject(this.enemy.getComponent(TransformBehaviour));
                transform.angle = angle;

                transform.moveAccordingToAngle('front', angle, ownerTransform.width + 25);
            })
        });
    }

    render() {
        super.render();
        this.getComponent(TransformBehaviour, transform => {
            const centerCoords = transform.getCenterCanvasCoords();

            this.drawPolygon(
                centerCoords.x,
                centerCoords.y,
                3,
                transform.width,
                1,
                this.color,
                this.color,
                transform.angle
            );
        });
    }
}