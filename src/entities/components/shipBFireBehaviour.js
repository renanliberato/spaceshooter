import { GameObject } from '../gameobject';
import { AudioManager } from '../../audios/AudioManager';
import { Bullet } from '../bullet';
import { TransformBehaviour } from './transformBehaviour';

export class ShipBFireBehaviour extends GameObject
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
        const bullet1 = this.createBullet();
        bullet1.getComponent(TransformBehaviour).rotateAngle(-30);
        this.gameobject.game.instantiateEntity(bullet1);

        const bullet2 = this.createBullet();
        this.gameobject.game.instantiateEntity(bullet2);

        const bullet3 = this.createBullet();
        bullet3.getComponent(TransformBehaviour).rotateAngle(30);
        this.gameobject.game.instantiateEntity(bullet3);
        
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
        bullet.destroyAfter(0.8);

        return bullet;
    }
}