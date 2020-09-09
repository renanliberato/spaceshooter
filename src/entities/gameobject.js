const uuid = require("uuid");

export class GameObject {
    constructor(game) {
        this.id = uuid.v4();
        this.game = game;        
    }

    setObject(obj) {
        this.object = obj;
    }

    destroy() {
        if (this.onDestroy)
            this.onDestroy();

        this.game.destroyEntity(this);
    }
}