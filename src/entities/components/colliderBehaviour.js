export class ColliderBehaviour {
    constructor(game, transform) {
        this.game = game;
        this.transform = transform;
    }

    updateCollider() {
        this.width = this.transform.width * 0.7;
        this.height = this.transform.height * 0.7;
    }
}