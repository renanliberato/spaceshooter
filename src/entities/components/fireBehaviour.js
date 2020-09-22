import { Component } from './component';
import { AudioManager } from '../../audios/AudioManager';
import { Bullet } from '../bullet';

export class FireBehaviour extends Component
{
    constructor(gameobject, firingSpeed, bulletSpeed, bulletTag, bulletTargetTag) {
        super(gameobject);

        this.isFiring = false;
        this.lastFireTime = 0;
        this.firingSpeed = firingSpeed;
        this.bulletSpeed = bulletSpeed;
        this.bulletTag = bulletTag;
        this.bulletTargetTag = bulletTargetTag;
    }

    update() {
        if (!this.isFiring)
            return;

        if (this.gameobject.game.time - this.lastFireTime <= this.firingSpeed) {
            return;
        }
        this.lastFireTime = this.gameobject.game.time;
        const bullet = this.createBullet();

        this.gameobject.game.instantiateEntity(bullet);
        
        if (this.gameobject.isVisible)
            AudioManager.play(AudioManager.audios.shoot);

        if (this.gameobject.onFire)
            this.gameobject.onFire();
    }

    remoteFire(x, y, angle) {
        const bullet = this.createBullet();

        this.gameobject.game.instantiateEntity(bullet);
        
        if (this.gameobject.isVisible)
            AudioManager.play(AudioManager.audios.shoot);
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