import { Ship } from './ship';
import { Trail } from './trail';
import { ShipABehaviour } from './components/shipABehaviour';
import { ShipBBehaviour } from './components/shipBBehaviour';
import { ShipCBehaviour } from './components/shipCBehaviour';
import { HealthBehaviour } from './components/healthBehaviour';
import { isMobile } from '../config';


const keycode = require('keycode');

const shipToClass = {
    Alpha: ShipABehaviour,
    Beta: ShipBBehaviour,
    Ovni: ShipCBehaviour,
}

export class Player extends Ship {
    constructor(game, ship) {
        super(game, '#fff');

        this.onKeydown = this.onKeydown.bind(this);
        this.onKeyup = this.onKeyup.bind(this);
        this.onTouchstart = this.onTouchstart.bind(this);
        this.onTouchend = this.onTouchend.bind(this);

        this.tag = 'player';
        this.lastTouchLeft = 0;
        this.lastTouchRight = 0;
        this.touchDashTimeout = 0.3;
        this.dashInterval = 5;
        this.lastDashTime = 0;
        this.lastDashTrailTime = 0;

        const Class = shipToClass[ship];
        this.addComponent(new Class(this, this.game, 'blue', 'enemy'));
        this.transform.x = 100;
        this.transform.y = 100;

        if (!isMobile) {

            document.addEventListener('keydown', this.onKeydown);

            document.addEventListener('keyup', this.onKeyup);
        } else {
            this.shipBehaviour.fireBehaviour.isFiring = true;
            this.acceleratingFrontwards = true;

            document.addEventListener('touchstart', this.onTouchstart);

            document.addEventListener('touchend', this.onTouchend);
        }

        this.getComponent(HealthBehaviour).onHealthChange = (health, healthPercent) => {
            document.dispatchEvent(new CustomEvent('player_health_updated', {
                detail: {
                    health: healthPercent * 100
                }
            }))
        }
    }

    onKeydown(e) {
        switch (keycode(e)) {
            case 'esc':
                game.paused = !game.paused;
                break;
            case 'w':
                this.acceleratingFrontwards = true;
                break;
            case 's':
                this.acceleratingBackwards = true;
                break;
            case 'a':
                this.rotatingLeft = true;
                break;
            case 'd':
                this.rotatingRight = true;
                break;
            case 'q':
                if (this.canDash()) {
                    this.dashLeft();
                    this.lastDashTime = this.game.time;
                }
                break;
            case 'e':
                if (this.canDash()) {
                    this.dashRight();
                    this.lastDashTime = this.game.time;
                }
                break;
            case 'space':
                this.shipBehaviour.fireBehaviour.isFiring = true;
                break;

        }
    }

    canDash() {
        return this.lastDashTime == 0 || this.game.time - this.lastDashTime > this.dashInterval;
    }

    onKeyup(e) {
        switch (keycode(e)) {
            case 'w':
                this.acceleratingFrontwards = false;
                break;
            case 's':
                this.acceleratingBackwards = false;
                break;
            case 'a':
                this.rotatingLeft = false;
            case 'd':
                this.rotatingRight = false;
                break;
            case 'space':
                this.shipBehaviour.fireBehaviour.isFiring = false;
                break;
        }
    }

    onTouchstart(e) {
        var clientX = e.touches[0].clientX;
        const leftSide = window.innerWidth / 3;
        const rightSide = window.innerWidth * 2 / 3;

        this.rotatingLeft = false;
        this.rotatingRight = false;

        if (clientX < leftSide) {
            if (this.game.time - this.lastTouchLeft < this.touchDashTimeout) {
                if (this.canDash()) {
                    this.dashLeft();
                    this.lastDashTime = this.game.time;
                }
            } else {
                this.rotatingLeft = true;
            }
            this.lastTouchLeft = this.game.time;
        } else if (clientX > rightSide) {
            if (this.game.time - this.lastTouchRight < this.touchDashTimeout) {
                if (this.canDash()) {
                    this.dashRight();
                    this.lastDashTime = this.game.time;
                }
            } else {
                this.rotatingRight = true;
            }
            this.lastTouchRight = this.game.time;
        }
    }

    onTouchend(e) {
        this.rotatingLeft = false;
        this.rotatingRight = false;
    }

    render() {
        super.render();
        this.createDashTrail();
    }

    createDashTrail() {
        if (this.game.time - this.lastDashTrailTime <= this.trailSpeed) {
            return;
        }
        this.lastDashTrailTime = this.game.time;
        
        if (this.canDash()) {
            var t = new Trail(this.game, this);
            t.destroyAfter(0.01 * 4);
            t.transform.moveAccordingToAngle('left', this.transform.angle, this.transform.width * 0.5 + this.game.sizeFromWidth(1));
            this.game.instantiateEntity(t);

            var t = new Trail(this.game, this);
            t.destroyAfter(0.01 * 4);
            t.transform.moveAccordingToAngle('right', this.transform.angle, this.transform.width * 0.5 + this.game.sizeFromWidth(1));
            this.game.instantiateEntity(t);
        }

        if (this.transform.dx < 0) {
            var t = new Trail(this.game, this);
            t.destroyAfter(this.trailSpeed * 4);
            t.transform.moveAccordingToAngle('left', this.transform.angle, this.transform.width * 0.5 + this.game.sizeFromWidth(1));
            this.game.instantiateEntity(t);
        }
        
        if (this.transform.dx > 0) {
            var t = new Trail(this.game, this);
            t.destroyAfter(this.trailSpeed * 4);
            t.transform.moveAccordingToAngle('right', this.transform.angle, this.transform.width * 0.5 + this.game.sizeFromWidth(1));
            this.game.instantiateEntity(t);
        }
    }

    onDestroy() {
        super.onDestroy();
        this.emitter.emit("DestroyPlayer", this.id);
        
        super.onDestroy();
        document.dispatchEvent(new CustomEvent('player_destroyed'));

        document.removeEventListener('keydown', this.onKeydown);
        document.removeEventListener('keyup', this.onKeyup);
        document.removeEventListener('touchstart', this.onTouchstart);
        document.removeEventListener('touchend', this.onTouchend);
    }
}