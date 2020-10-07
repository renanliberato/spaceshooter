import { GameObject } from '../gameobject';
import { AudioManager } from '../../audios/AudioManager';
import { Bullet } from '../bullet';

export class ShipAFireBehaviour extends GameObject
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

        this.gameobject.emitter.emit("FireShot", {
            matchId: this.gameobject.game.matchId,
            id: this.gameobject.id,
            x: this.gameobject.x,
            y: this.gameobject.y,
            angle: this.gameobject.angle
        });

        this.executeShoot();
    }

    executeShoot() {
        const bullet1 = this.createBullet();
        bullet1.moveAccordingToAngle('left', bullet1.angle, 10);
        this.gameobject.game.instantiateEntity(bullet1);

        const bullet2 = this.createBullet();
        this.gameobject.game.instantiateEntity(bullet2);

        const bullet3 = this.createBullet();
        bullet3.moveAccordingToAngle('right', bullet3.angle, 10);
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
        bullet.destroyAfter(0.5);

        return bullet;
    }
}