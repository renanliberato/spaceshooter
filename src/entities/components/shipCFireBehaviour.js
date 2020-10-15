import { GameObject } from '../gameobject';
import { AudioManager } from '../../audios/AudioManager';
import { Bullet } from '../bullet';
import { TransformBehaviour } from './transformBehaviour';

export class ShipCFireBehaviour extends GameObject
{
    constructor(gameobject, game, firingSpeed, bulletSpeed, bulletTag, bulletTargetTag) {
        super(game);
        this.gameobject = gameobject;

        this.isFiring = false;
        this.lastFireTime = 0;
        this.firingSpeed = firingSpeed;
        this.bulletSpeed = bulletSpeed;
        this.bulletTag = bulletTag;
        this.bulletTargetTag = bulletTargetTag;
    }

    update() {
        super.update();
        if (!this.isFiring)
            return;

        if (this.gameobject.game.time - this.lastFireTime <= this.firingSpeed) {
            return;
        }
        this.lastFireTime = this.gameobject.game.time;

        this.gameobject.getComponent(TransformBehaviour, gameobjectTransform => {
            this.gameobject.emitter.emit("FireShot", {
                matchId: this.gameobject.game.matchId,
                id: this.gameobject.id,
                x: gameobjectTransform.x,
                y: gameobjectTransform.y,
                angle: gameobjectTransform.angle
            });
        });

        this.executeShoot();
    }

    executeShoot() {
        [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].forEach(angle => {
            const bullet = this.createBullet();
            bullet.getComponent(TransformBehaviour, transform => transform.rotateToAngle(angle));
            this.gameobject.game.instantiateEntity(bullet);
        })
        
        if (this.gameobject.isVisible)
            AudioManager.play(AudioManager.audios.shoot);
    }

    remoteFire(x, y, angle) {
        this.executeShoot();
    }

    createBullet() {
        var bullet = new Bullet(
            this.gameobject.game,
            this.bulletTag,
            this.gameobject,
            this.bulletTargetTag,
            this.bulletSpeed
        );
        bullet.destroyAfter(1);

        return bullet;
    }
}